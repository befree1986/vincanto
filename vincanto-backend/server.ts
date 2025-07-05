import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import validator from 'validator';
import mongoose from 'mongoose';
import BookingModel, { IBooking } from './models/Booking';
import { sendBookingRequestEmails } from './services/emailService';
import { config } from './config';

// import nodemailer from 'nodemailer'; // Da decommentare per le email


const app = express();


mongoose.connect(config.mongoUri)
    .then(() => console.log('✅ Connesso a MongoDB'))
    .catch(err => console.error('❌ Impossibile connettersi a MongoDB:', err));

// Middleware
// Abilita le richieste Cross-Origin dal tuo frontend React (che gira su localhost:3000)
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json()); // Permette al server di interpretare JSON nel corpo delle richieste

// =================================================================
// --- ENDPOINT API ---
// =================================================================


// --- CONFIGURAZIONE PRENOTAZIONE (lato server) ---
const BOOKING_CONFIG = {
    CLEANING_FEE: 30,
    DEPOSIT_PERCENTAGE: 0.50,
    PARKING_RATE: 15,
    MIN_NIGHTS: 2,
    RATES: {
        BASE_PER_GUEST: 75,
        ADDITIONAL_GUEST: 30,
    },
    AUGUST_RULE_START: new Date(2024, 7, 11),
    AUGUST_RULE_END: new Date(2024, 7, 25),
};

// API per ottenere le date già prenotate
app.get('/api/booked-dates', async (req: Request, res: Response) => {
    try {
        // Trova solo le prenotazioni confermate per bloccare le date
        const bookings = await BookingModel.find({ status: 'confirmed' }).select('checkin checkout');
        const dateRanges = bookings.map(b => ({
            start: b.checkin,
            end: b.checkout,
        }));
        res.json(dateRanges);
    } catch (error) {
        console.error("Errore nel recuperare le date prenotate:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

// API per gestire una nuova richiesta di prenotazione
app.post('/api/booking-request', async (req: Request, res: Response) => {
    const { formData, paymentAmount, paymentMethod } = req.body;

    // --- VALIDAZIONE DEI DATI (FONDAMENTALE!) ---
    const requiredFields = ['name', 'surname', 'email', 'phone', 'checkin', 'checkout', 'guests', 'parkingOption'];
    for (const field of requiredFields) {
        if (!formData || !formData[field]) {
            return res.status(400).json({ message: `Il campo '${field}' è obbligatorio.` });
        }
    }

    if (!validator.isEmail(formData.email)) {
        return res.status(400).json({ message: 'L\'indirizzo email non è valido.' });
    }

    if (formData.phone && !validator.isMobilePhone(formData.phone, 'it-IT')) {
        // Nota: questa validazione è basica, potresti volerla più flessibile
        // return res.status(400).json({ message: 'Il numero di telefono non sembra valido.' });
    }

    const checkin = new Date(formData.checkin);
    const checkout = new Date(formData.checkout);

    if (isNaN(checkin.getTime()) || isNaN(checkout.getTime()) || checkout <= checkin) {
        return res.status(400).json({ message: 'Le date fornite non sono valide.' });
    }

    try {
        const newBooking = new BookingModel({
            name: formData.name,
            surname: formData.surname,
            email: formData.email,
            phone: formData.phone,
            checkin: new Date(formData.checkin),
            checkout: new Date(formData.checkout),
            guests: parseInt(formData.guests, 10),
            children: formData.children,
            parkingOption: formData.parkingOption,
            paymentMethod: paymentMethod,
            paymentAmount: paymentAmount,
            status: 'pending' // Lo stato iniziale è "in attesa"
        });

        await newBooking.save();

        console.log('--- NUOVA RICHIESTA DI PRENOTAZIONE SALVATA SU DB ---');
        console.log(newBooking.toObject());
        console.log('-------------------------------------------------');

       // Invia le email di notifica e conferma
        await sendBookingRequestEmails(newBooking)

        res.status(201).json({ message: 'Richiesta di prenotazione inviata con successo! Verrai ricontattato a breve per la conferma.' });

     } catch (error: any) {
        console.error("❌ Errore API /api/booking-request:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Errore di validazione dei dati: ${error.message}` });
        }

        // Messaggio generico per il client per non esporre dettagli interni
        res.status(500).json({ message: "Si è verificato un errore interno durante l'elaborazione della richiesta." });
    }
});

// API per gestire una nuova richiesta di contatto
app.post('/api/contact-request', (req: Request, res: Response) => {
    const { name, email, phone, message } = req.body;

    // --- VALIDAZIONE ---
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Nome, email e messaggio sono obbligatori.' });
    }
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'L\'indirizzo email non è valido.' });
    }

    console.log('--- NUOVA RICHIESTA DI CONTATTO ---');
    console.log(`Da: ${name} (${email})`);
    console.log(`Telefono: ${phone || 'Non fornito'}`);
    console.log(`Messaggio: ${message}`);
    console.log('-----------------------------------');

    // In un'applicazione reale:
    // 1. Salva il messaggio nel DB o nel CRM.
    // 2. Invia una email di notifica all'amministratore.

    res.status(200).json({ message: 'Messaggio inviato con successo. Grazie per averci contattato!' });
});


app.listen(config.port, () => {
    console.log(`🚀 Server backend in ascolto sulla porta ${config.port}`);
});
