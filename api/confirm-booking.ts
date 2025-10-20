import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../db';
import Stripe from 'stripe';

interface BookingForPayment {
  id: number;
  deposit_price: number;
  customer_email: string;
  check_in_date: string;
  check_out_date: string;
  customer_name: string;
  language: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  const { token } = req.query;

  // --- 1. Validazione input e variabili d'ambiente ---
  if (typeof token !== 'string' || !token) {
    return res.status(400).send('<h1>Errore: Token di conferma mancante o non valido.</h1>');
  }

  const { STRIPE_SECRET_KEY, VERCEL_URL } = process.env;
  if (!STRIPE_SECRET_KEY || !VERCEL_URL) {
    console.error('❌ Chiave segreta di Stripe o VERCEL_URL non configurate.');
    return res.status(500).send('<h1>Errore di configurazione del server.</h1>');
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  try {
    // --- 2. Trova la prenotazione usando il token ---
    const { rows } = await db.query<BookingForPayment>(
      "SELECT id, deposit_price, customer_email, customer_name, language, check_in_date, check_out_date FROM bookings WHERE confirmation_token = $1 AND status = 'pending'",
      [token]
    );

    if (rows.length === 0) {
      return res.status(404).send('<h1>Link di conferma non valido o già utilizzato.</h1><p>Per favore, effettua una nuova richiesta di prenotazione.</p>');
    }

    const booking = rows[0];

    // --- 3. Controllo finale di sovrapposizione ---
    // Controlla se un'altra prenotazione è stata confermata nel frattempo
    const conflictCheck = await db.query(
      `SELECT id FROM bookings
       WHERE check_in_date < $2 AND check_out_date > $1
       AND status = 'confirmed'`,
      [booking.check_in_date, booking.check_out_date]
    );

    if ((conflictCheck?.rowCount ?? 0) > 0) {
      // Le date non sono più disponibili, informa l'utente.
      return res.status(409).send('<h1>Spiacenti, le date non sono più disponibili.</h1><p>Qualcun altro ha confermato una prenotazione per lo stesso periodo. Per favore, effettua una nuova richiesta.</p>');
    }

    // --- 4. Crea la sessione di checkout di Stripe ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: { name: `Acconto prenotazione Vincanto` },
          unit_amount: Math.round(booking.deposit_price * 100), // Prezzo in centesimi
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://${VERCEL_URL}/booking-success`, // Pagina di successo sul tuo frontend
      cancel_url: `https://${VERCEL_URL}/booking-cancelled`, // Pagina di cancellazione sul tuo frontend
      client_reference_id: String(booking.id), // Collega la sessione all'ID della prenotazione
      customer_email: booking.customer_email,
      locale: booking.language as Stripe.Checkout.SessionCreateParams.Locale,
    });

    // --- 5. Reindirizza l'utente alla pagina di pagamento ---
    if (session.url) {
      res.redirect(303, session.url);
    } else {
      res.status(500).send('<h1>Errore durante la creazione della sessione di pagamento.</h1>');
    }
  } catch (error) {
    console.error('❌ Errore durante la conferma della prenotazione:', error);
    res.status(500).send('<h1>Errore interno del server.</h1>');
  }
}