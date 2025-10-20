import type { VercelRequest, VercelResponse } from '@vercel/node';
import db from '../db';
import nodemailer from 'nodemailer';
import * as crypto from 'crypto';
import { format, parseISO } from 'date-fns';
import { calculateBookingCosts } from '../src/utils/priceCalculator';

interface BookingData {
  checkin: string;
  checkout: string;
  num_adults: number;
  num_children: number;
  total_price: number;
  parking: boolean; // Aggiunto per il ricalcolo
  deposit_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  language: string;
}

interface NewBooking {
  id: number;
  confirmation_token: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' });
  }

  const {
    checkin,
    checkout,
    num_adults,
    num_children,
    customer_phone,
    customer_name,
    customer_email,
    language,
    parking, // Aggiunto
  } = req.body as BookingData;

  // --- Validazione di base ---
  if (!checkin || !checkout || !num_adults || !customer_name || !customer_email) {
    return res.status(400).json({ success: false, message: 'Dati mancanti per la prenotazione.' });
  }

  // --- Validazione variabili d'ambiente per email ---
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL, VERCEL_URL } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !ADMIN_EMAIL) {
    console.error('❌ Variabili d\'ambiente per l\'invio email non configurate. L\'email non verrà inviata.');
    // Non blocchiamo la prenotazione, ma logghiamo l'errore grave.
    // L'invio email fallirà silenziosamente più avanti.
  }

  const client = await db.connect(); // Usiamo un client per le transazioni
  let newBookingId: number;

  try {
    // --- SICUREZZA: Ricalcola il prezzo sul backend ---
    const costs = await calculateBookingCosts({
      checkin,
      checkout,
      numAdults: num_adults,
      numChildren: num_children,
      parking,
    });
    const { totalAmount: totalPrice, depositAmount: deposit } = costs;

    await client.query('BEGIN');

    // 1. Controllo di disponibilità COMPLETO (DB + iCal)
    // Usiamo una funzione helper che astrae la logica da /api/availability
    const availabilityResponse = await fetch(`https://${req.headers.host}/api/availability?startDate=${checkin}&endDate=${checkout}`);
    if (!availabilityResponse.ok) {
      throw new Error('Failed to fetch availability');
    }
    const availabilityData = await availabilityResponse.json();
    const unavailableDates = new Set<string>(availabilityData.unavailableDates);
    
    const requestedDates = [];
    let currentDate = parseISO(checkin);
    const lastDate = parseISO(checkout);
    while (currentDate < lastDate) {
      requestedDates.push(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const conflictCheck = requestedDates.some(date => unavailableDates.has(date));

    if (conflictCheck) {

      await client.query('ROLLBACK');
      return res.status(409).json({ success: false, message: 'Le date selezionate non sono più disponibili.' });
    }

    // 2. Genera un token di conferma sicuro
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // 3. Inserisci la nuova prenotazione con stato 'pending'
    const insertQuery = `
      INSERT INTO bookings (
        check_in_date, check_out_date, num_adults, num_children, 
        total_price, deposit_price, customer_name, customer_email, customer_phone,
        status, confirmation_token, language
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10, $11)
      RETURNING id;
    `;
    const result = await client.query<NewBooking>(insertQuery, [
      checkin, checkout, num_adults, num_children, totalPrice, deposit,
      customer_name, customer_email, customer_phone, confirmationToken, language
    ]);

    newBookingId = result.rows[0].id;

    await client.query('COMMIT');

    // --- Invio Email di Notifica (non blocca la risposta in caso di errore) ---
    if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS && ADMIN_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: EMAIL_HOST,
        port: Number(EMAIL_PORT),
        secure: Number(EMAIL_PORT) === 465, // true for 465, false for other ports
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      try {
        const confirmationUrl = `https://${VERCEL_URL || req.headers.host}/api/confirm-booking?token=${confirmationToken}`;

        // Email al cliente
        await transporter.sendMail({
          from: `"Vincanto" <${EMAIL_USER}>`,
          to: customer_email,
          subject: 'La tua richiesta di prenotazione a Vincanto',
          html: `
            <h1>Grazie per la tua richiesta, ${customer_name}!</h1>
            <p>Abbiamo ricevuto la tua richiesta di prenotazione dal <strong>${format(parseISO(checkin), 'dd/MM/yyyy')}</strong> al <strong>${format(parseISO(checkout), 'dd/MM/yyyy')}</strong>.</p>
            <p>Per confermare la tua prenotazione e procedere con il pagamento dell'acconto di ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(deposit)}, clicca sul seguente link:</p>
            <a href="${confirmationUrl}">Conferma e Paga</a>
            <p>Se non hai effettuato tu questa richiesta, puoi ignorare questa email.</p>
          `,
        });

        // Email all'amministratore
        await transporter.sendMail({
          from: `"Notifica Sistema" <${EMAIL_USER}>`,
          to: ADMIN_EMAIL,
          subject: `Nuova richiesta di prenotazione da ${customer_name}`,
          html: `
            <h1>Nuova richiesta di prenotazione ricevuta</h1>
            <ul>
              <li><b>Cliente:</b> ${customer_name}</li>
              <li><b>Email:</b> ${customer_email}</li>
              <li><b>Telefono:</b> ${customer_phone || 'Non fornito'}</li>
              <li><b>Check-in:</b> ${format(parseISO(checkin), 'dd/MM/yyyy')}</li>
              <li><b>Check-out:</b> ${format(parseISO(checkout), 'dd/MM/yyyy')}</li>
              <li><b>Adulti:</b> ${num_adults}</li>
              <li><b>Bambini:</b> ${num_children || 0}</li>
              <li><b>Prezzo Totale:</b> ${new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(totalPrice)}</li>
            </ul>
          `,
        });
      } catch (emailError) {
        console.error('❌ Errore durante l\'invio dell\'email di notifica:', emailError);
        // Non blocchiamo la risposta, la prenotazione è comunque nel DB
      }
    }

    return res.status(201).json({ success: true, bookingId: newBookingId, message: 'Richiesta di prenotazione creata con successo. Controlla la tua email per confermare.' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Errore durante la creazione della prenotazione:', error);
    return res.status(500).json({ success: false, message: 'Errore interno del server durante la creazione della prenotazione.' });
  } finally {
    client.release();
  }
}
