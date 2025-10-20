import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { buffer } from 'micro';
import db from '../db';
import nodemailer from 'nodemailer';
import { format, parseISO } from 'date-fns';

// Disabilita il body parser di Vercel per questa rotta.
// È necessario per verificare la firma del webhook di Stripe, che richiede il corpo della richiesta "grezzo".
export const config = {
  api: {
    bodyParser: false,
  },
};

interface BookingDetails {
  id: number;
  check_in_date: string;
  check_out_date: string;
  customer_name: string;
  customer_email: string;
  total_price: number;
  deposit_price: number;
}

// Funzione helper per ottenere il corpo grezzo della richiesta
async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return buffer(req);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL } = process.env;

  if (!STRIPE_SECRET_KEY || !STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Chiave segreta di Stripe o segreto del webhook non configurati.');
    return res.status(500).send('Errore di configurazione del server.');
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event: Stripe.Event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig!, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error(`❌ Errore nella verifica della firma del webhook: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestisce l'evento checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.client_reference_id;

    if (!bookingId) {
      console.error('❌ ID prenotazione mancante nella sessione di Stripe:', session.id);
      return res.status(400).send('ID prenotazione mancante dalla sessione di Stripe.');
    }

    const client = await db.connect(); // Otteniamo un client per la transazione
    try {
      await client.query('BEGIN');
      // Aggiorna lo stato della prenotazione a 'confirmed'
      const updateResult = await client.query<BookingDetails>(
        "UPDATE bookings SET status = 'confirmed' WHERE id = $1 AND status = 'pending' RETURNING id, check_in_date, check_out_date, customer_name, customer_email, total_price, deposit_price",
        [bookingId]
      );

      if ((updateResult.rowCount ?? 0) > 0) { // La prenotazione è stata aggiornata
        const booking = updateResult.rows[0];
        console.log(`✅ Prenotazione ${booking.id} confermata con successo.`);

        // Invia email di conferma al cliente
        const transporter = nodemailer.createTransport({
          host: EMAIL_HOST,
          port: Number(EMAIL_PORT),
          secure: Number(EMAIL_PORT) === 465,
          auth: { user: EMAIL_USER, pass: EMAIL_PASS },
        });

        await transporter.sendMail({
          from: `"Vincanto" <${EMAIL_USER}>`,
          to: booking.customer_email,
          subject: 'La tua prenotazione a Vincanto è confermata!',
          html: `
            <h1>Ciao ${booking.customer_name}, la tua prenotazione è confermata!</h1>
            <p>Abbiamo ricevuto il pagamento dell'acconto di ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(booking.deposit_price)}.</p>
            <p>Il tuo soggiorno dal <strong>${format(parseISO(booking.check_in_date), 'dd/MM/yyyy')}</strong> al <strong>${format(parseISO(booking.check_out_date), 'dd/MM/yyyy')}</strong> è ora confermato.</p>
            <p>Il saldo rimanente di ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(booking.total_price - booking.deposit_price)} sarà da pagare in loco.</p>
            <p>Non vediamo l'ora di darti il benvenuto!</p>
          `,
        });

        // Invia email di notifica all'amministratore
        await transporter.sendMail({
          from: `"Notifica Sistema" <${EMAIL_USER}>`,
          to: ADMIN_EMAIL,
          subject: `✅ Prenotazione Confermata: ${booking.customer_name} (${format(parseISO(booking.check_in_date), 'dd/MM/yyyy')})`,
          html: `
            <h1>Prenotazione #${booking.id} confermata!</h1>
            <p>Il cliente <strong>${booking.customer_name}</strong> ha completato il pagamento dell'acconto.</p>
            <p>La prenotazione dal <strong>${format(parseISO(booking.check_in_date), 'dd/MM/yyyy')}</strong> al <strong>${format(parseISO(booking.check_out_date), 'dd/MM/yyyy')}</strong> è ora confermata nel sistema.</p>
            <p>Dettagli cliente: ${booking.customer_email}</p>
          `,
        });
        await client.query('COMMIT');
      } else {
        await client.query('ROLLBACK'); // Annulla se la prenotazione non è stata trovata o era già confermata
      }
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Errore durante l\'aggiornamento della prenotazione o l\'invio dell\'email:', error);
      // Non inviare un errore 500 a Stripe, altrimenti continuerà a inviare il webhook.
      // Logghiamo l'errore per un'analisi manuale.
    } finally {
      client.release();
    }
  }

  // Rispondi a Stripe per confermare la ricezione dell'evento
  res.status(200).json({ received: true });
}