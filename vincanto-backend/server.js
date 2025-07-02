const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const ejs = require('ejs');
const path = require('path');
const pool = require('./src/config/db.js'); // Assicurati che il percorso sia corretto
const dotenv = require('dotenv');

// Carica le variabili d'ambiente dal file .env nella cartella principale
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Per parsare il body delle richieste JSON

// --- Configurazione di Nodemailer ---
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true solo se la porta è 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// --- Logica di Calcolo dei Prezzi (Fonte di Verità Ufficiale) ---
function calculateServerSideCosts(formData) {
    const { checkin, checkout, guests, childrenAges, parkingOption } = formData;

    // --- Dati di base ---
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkoutDate <= checkinDate) return null;

    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.round(Math.abs((checkoutDate - checkinDate) / oneDay));
    
    // --- REGOLA 1: Soggiorno minimo 2 notti ---
    if (nights < 2) {
        return { error: "Il soggiorno minimo è di 2 notti." };
    }

    const numAdults = parseInt(guests, 10) || 0;
    
    // --- REGOLA 3: Bambini 0-3 anni non pagano (per il soggiorno) ---
    let payingChildren = 0;
    (childrenAges || []).forEach(ageStr => {
        const age = parseInt(ageStr, 10);
        if (!isNaN(age) && age > 3) {
            payingChildren++;
        }
    });

    const totalPayingGuests = numAdults + payingChildren;
    if (totalPayingGuests <= 0) return null;

    // --- Costanti di prezzo ---
    const CLEANING_FEE = 30;
    const TOURIST_TAX_RATE = 2.00;
    const PARKING_RATE = 15; // REGOLA 4: Parcheggio fisso
    const DEPOSIT_PERCENTAGE = 0.50;

    // --- REGOLA 2: Calcolo costo soggiorno a scaglioni (nuovi prezzi) ---
    let costPerNight = 0;
    if (totalPayingGuests >= 1) {
        costPerNight += Math.min(totalPayingGuests, 2) * 75; // Primi 2 ospiti paganti
    }
    if (totalPayingGuests >= 3) {
        costPerNight += (totalPayingGuests - 2) * 30; // Dal 3° ospite pagante in poi
    }
    const base_price = costPerNight * nights;

    // --- Calcolo costo parcheggio ---
    const parking_cost = parkingOption === 'private' ? PARKING_RATE * nights : 0;

    // --- Calcolo tassa di soggiorno (esclusi under 14) ---
    let taxableGuests = numAdults;
    (childrenAges || []).forEach(ageStr => {
        const age = parseInt(ageStr, 10);
        if (!isNaN(age) && age >= 14) {
            taxableGuests++;
        }
    });
    const tourist_tax = taxableGuests * TOURIST_TAX_RATE * nights;

    // --- Calcolo totali ---
    const cleaning_fee = CLEANING_FEE;
    const total_amount = base_price + cleaning_fee + parking_cost + tourist_tax;
    const deposit_amount = total_amount * DEPOSIT_PERCENTAGE;

    return {
        nights,
        base_price,
        cleaning_fee,
        parking_cost,
        tourist_tax,
        total_amount,
        deposit_amount,
        taxableGuests,
        totalPayingGuests,
    };
}


// --- Endpoint per la Creazione di una Nuova Prenotazione ---
app.post('/api/booking-request', async (req, res) => {
    try {
        // Leggiamo i dati dalla struttura corretta inviata dal frontend
        const { formData, paymentAmount, paymentMethod } = req.body;

        // 1. Calcola i costi lato server e valida le regole di business.
        const costs = calculateServerSideCosts(formData);

        // Controlla se il calcolo ha prodotto un errore (es. soggiorno minimo non rispettato) o dati non validi.
        if (!costs || costs.error) {
            const errorMessage = (costs && costs.error) ? costs.error : "Dati di prenotazione non validi.";
            return res.status(400).json({ success: false, message: errorMessage });
        }

        // Determina l'importo numerico effettivo da salvare in base alla scelta dell'utente
        const numericAmountToPay = paymentAmount === 'acconto' ? costs.deposit_amount : costs.total_amount;

        // 2. Inserisci la prenotazione nel database
        const queryText = `
            INSERT INTO Bookings (
                guest_name, guest_surname, guest_email, guest_phone,
                check_in_date, check_out_date, num_adults, num_children, 
                children_ages, parking_option, 
                base_price, parking_cost, cleaning_fee, tourist_tax, total_amount, deposit_amount,
                payment_amount, payment_method, booking_status, payment_choice
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'PENDING', $19)
            RETURNING *;
        `;
        const values = [
            formData.name,
            formData.surname,
            formData.email,
            formData.phone,
            formData.checkin,
            formData.checkout,
            parseInt(formData.guests, 10),
            formData.children,
            JSON.stringify(formData.childrenAges || []),
            formData.parkingOption,
            costs.base_price,
            costs.parking_cost,
            costs.cleaning_fee,
            costs.tourist_tax,
            costs.total_amount,
            costs.deposit_amount,
            numericAmountToPay,
            paymentMethod,
            paymentAmount, // La scelta testuale: 'acconto' o 'totale'
        ];

        const { rows } = await pool.query(queryText, values);
        const newBooking = rows[0]; // Questa è la nostra "fonte di verità"

        // 3. Invia l'email di conferma al cliente
        const bankDetails = {
            beneficiary: process.env.BANK_BENEFICIARY,
            iban: process.env.BANK_IBAN,
        };
        
        const emailHtml = await ejs.renderFile(
            path.join(__dirname, 'src', 'views', 'booking-confirmation.ejs'), 
            { booking: newBooking, bankDetails } // Passiamo i dati corretti dal DB
        );

        const mailOptions = {
            from: `"Vincanto" <${process.env.EMAIL_USER}>`,
            to: newBooking.guest_email,
            subject: 'Conferma Richiesta di Prenotazione per Vincanto',
            html: emailHtml,
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "Richiesta di prenotazione ricevuta!", booking: newBooking });

    } catch (error) {
        console.error("Errore durante la richiesta di prenotazione:", error);
        res.status(500).json({ success: false, message: "Errore durante l'elaborazione della richiesta." });
    }
});

// --- Avvio del Server ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
