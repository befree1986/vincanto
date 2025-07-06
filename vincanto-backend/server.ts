import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';
import ejs from 'ejs';

// Ora questo import funzionerà! Usa un percorso relativo che parte dalla cartella corrente.
// Aggiorna il percorso in base alla reale posizione del file Booking.ts/Booking.js
import Booking from './models/Booking';

// --- 1. CONFIGURAZIONE INIZIALE ---
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// --- 2. CONFIGURAZIONE CORS (LA SOLUZIONE AL TUO PROBLEMA ORIGINALE) ---
const whitelist = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permetti richieste dalla whitelist e richieste senza 'origin' (es. Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non permesso da CORS'));
    }
  },
  credentials: true,
};

// Applica il middleware CORS a TUTTE le rotte (DEVE ESSERE PRIMA DELLE ROTTE API)
app.use(cors(corsOptions));

// Middleware per leggere il corpo delle richieste in formato JSON
app.use(express.json());

// --- DEBUG E CONFIGURAZIONE NODEMAILER ---
console.log('--- Variabili Ambiente Email ---');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL); // Email per le notifiche
console.log('--- Fine Variabili Ambiente ---');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_PORT == '465', // true per la porta 465, false per le altre
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Usa una "Password per le app" se usi Gmail
  },
});

// Dettagli per il pagamento tramite bonifico
const bankDetails = {
  beneficiary: "Vincanto Maiori",
  iban: "IT04D360810513828884288937", // <-- Sostituisci con il tuo IBAN reale
  // puoi aggiungere altri dati se vuoi
};

// --- 3. CONNESSIONE A MONGODB ---
// Incolla qui la tua logica di connessione a MongoDB.
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('ERRORE: La variabile d\'ambiente MONGODB_URI non è definita nel file .env');
  process.exit(1); // Interrompe l'avvio se la URI non è presente
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connesso a MongoDB'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));
// --- 4. DEFINIZIONE DELLE TUE ROTTE API ---
// Ora devi reintegrare le tue rotte qui.

// Esempio per le date prenotate (GET)
app.get('/api/booked-dates', async (req: Request, res: Response) => {
  try {
    // QUI VA LA TUA LOGICA PER RECUPERARE LE DATE DA MONGODB
    // Esempio: const bookings = await BookingModel.find({}, 'check_in_date checkout_date');
    // res.json(bookings);
    console.log('Richiesta ricevuta a /api/booked-dates');
    res.json({ message: 'Endpoint /api/booked-dates funziona! La logica va implementata.' });
  } catch (error) {
    console.error("Errore in /api/booked-dates:", error);
    res.status(500).json({ message: "Errore nel recupero delle date" });
  }
});

// Esempio per la richiesta di prenotazione (POST)
app.post('/api/booking-request', async (req: Request, res: Response) => {
  try {
    console.log('Richiesta ricevuta a /api/booking-request con dati:', req.body);

    // 1. Mappa i dati dal frontend ai campi richiesti dal modello
    const { formData, paymentAmount, paymentMethod, costs } = req.body;

    const bookingData = {
      guest_name: formData.name,
      guest_surname: formData.surname,
      guest_email: formData.email,
      guest_phone: formData.phone,
      check_in_date: new Date(formData.checkin),
      check_out_date: new Date(formData.checkout),
      num_adults: parseInt(formData.guests, 10),
      num_children: formData.children,
      children_ages: formData.childrenAges,
      parking_option: formData.parkingOption || 'none',
      base_price: costs ? costs.subtotalNightlyRate : 0,
      parking_cost: costs ? costs.parkingCost : 0,
      cleaning_fee: costs ? costs.cleaningFee : 0,
      tourist_tax: costs ? costs.touristTax : 0,
      total_amount: costs ? costs.grandTotalWithTax : 0,
      deposit_amount: costs ? costs.depositAmount : 0,
      payment_amount: costs
        ? (paymentAmount === 'acconto' ? costs.depositAmount : costs.grandTotalWithTax)
        : 0,
      payment_method: paymentMethod || '',
      booking_status: 'PENDING',
      payment_choice: paymentAmount === 'acconto' ? 'acconto' : 'totale',
    };

    // 2. Salva la prenotazione nel database
    const newBooking = new Booking(bookingData);
    await newBooking.save();
    console.log('Prenotazione salvata con successo nel DB.');

    // 3. Invia email di conferma al cliente
        const customerTemplateData = {
      booking: newBooking.toObject(), // È buona norma passare un oggetto semplice
      costs: req.body.costs,
      paymentMethod: req.body.paymentMethod,
      bankDetails: req.body.paymentMethod === 'bonifico' ? bankDetails : null,
    };
    const customerEmailHtml = await ejs.renderFile(
      path.join(__dirname, 'src', 'views', 'booking-confirmation.ejs'),
            customerTemplateData
           ) as string;

    await transporter.sendMail({
      from: `"Vincanto" <${process.env.EMAIL_USER}>`,
      to: newBooking.guest_email,
      subject: 'Conferma Richiesta di Prenotazione per Vincanto',
      html: customerEmailHtml,
    });
    console.log(`Email di conferma inviata a: ${newBooking.guest_email}`);

    // 4. Invia email di notifica all'admin
    const adminEmailHtml = await ejs.renderFile(
      path.join(__dirname, 'src', 'views', 'admin-notification.ejs'),
      req.body
    ) as string;

    await transporter.sendMail({
      from: `"Notifica Vincanto" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL, // La tua email
      subject: `Nuova Richiesta di Prenotazione da ${newBooking.guest_name} ${newBooking.guest_surname}`,
      html: adminEmailHtml,
    });
    console.log(`Email di notifica inviata all'admin: ${process.env.ADMIN_EMAIL}`);

    res.status(201).json({ success: true, message: 'Richiesta di prenotazione ricevuta e email inviate!' });

  } catch (error) {
    console.error("Errore in /api/booking-request:", error);
    res.status(500).json({ success: false, message: "Errore durante la richiesta di prenotazione." });
  }
});

// --- 5. AVVIO DEL SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server backend in ascolto sulla porta ${PORT}`);
  // Questo messaggio è la prova che stai eseguendo il file corretto!
  console.log('✅ CORS è configurato per permettere richieste da:', whitelist.join(', '));
});
