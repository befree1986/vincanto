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
    const { checkin, checkout, guests, children, childrenAges, parkingOption } = formData;

    // --- Dati di base ---
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    if (checkoutDate <= checkinDate) return null;

    const oneDay = 1000 * 60 * 60 * 24;
    const nights = Math.round(Math.abs((checkoutDate - checkinDate) / oneDay));
    if (nights <= 0) return null;

    const numAdults = parseInt(guests, 10) || 0;
    const numChildren = parseInt(children, 10) || 0;
    const totalGuests = numAdults + numChildren;
    if (totalGuests <= 0) return null;

    // --- Costanti di prezzo (in futuro da DB) ---
    const CLEANING_FEE = 30;
    const TOURIST_TAX_RATE = 2.00;
    const PARKING_LOW_SEASON_RATE = 15;
    const PARKING_HIGH_SEASON_RATE = 25;
    const DEPOSIT_PERCENTAGE = 0.50;

    // --- 1. Calcolo costo soggiorno a scaglioni ---
    let base_price = 0;
    if (nights === 1) {
        base_price = totalGuests * 50;
    } else {
        let costPerNight = 0;
        if (totalGuests >= 1) costPerNight += Math.min(totalGuests, 2) * 50;
        if (totalGuests >= 3) costPerNight += Math.min(totalGuests - 2, 2) * 40;
        if (totalGuests >= 5) costPerNight += (totalGuests - 4) * 30;
        base_price = costPerNight * nights;
    }

    // --- 2. Calcolo costo parcheggio stagionale ---
    let parking_cost = 0;
    if (parkingOption === 'private') {
        const month = checkinDate.getMonth(); // 0=Gen, 5=Giu, 6=Lug, 7=Ago
        const isHighSeason = (month >= 5 && month <= 7); // Giugno, Luglio, Agosto
        const parkingRate = isHighSeason ? PARKING_HIGH_SEASON_RATE : PARKING_LOW_SEASON_RATE;
        parking_cost = parkingRate * nights;
    }

    // --- 3. Calcolo tassa di soggiorno (esclusi under 14) ---
    let taxableGuests = numAdults;
    (childrenAges || []).forEach(ageStr => {
        const age = parseInt(ageStr, 10);
        if (!isNaN(age) && age >= 14) {
            taxableGuests++;
        }
    });
    const tourist_tax = taxableGuests * TOURIST_TAX_RATE * nights;

    // --- 4. Calcolo totali ---
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
    };
}

// --- Endpoint per la Creazione di una Nuova Prenotazione ---
app.post('/api/booking-request', async (req, res) => {
    try {
        // Leggiamo i dati dalla struttura corretta inviata dal frontend
        const { formData, paymentAmount, paymentMethod } = req.body;

        // 1. Calcola i costi lato server per sicurezza.
        const costs = calculateServerSideCosts(formData);
        if (!costs) {
            return res.status(400).json({ success: false, message: "Dati di prenotazione non validi." });
        }
        if (costs.nights === 1 && paymentAmount === 'acconto') {
            return res.status(400).json({ success: false, message: "L'acconto non è disponibile per soggiorni di una sola notte." });
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
            RETURNING *;
        `;
        const values = [
            formData.name,                            // $1
            formData.surname,                         // $2
            formData.email,                           // $3
            formData.phone,                           // $4
            formData.checkin,                         // $5
            formData.checkout,                        // $6
            parseInt(formData.guests, 10),            // $7
            parseInt(formData.children, 10) || 0,     // $8
            JSON.stringify(formData.childrenAges || []),// $9
            formData.parkingOption,                   // $10
            costs.base_price,                         // $11
            costs.parking_cost,                       // $12
            costs.cleaning_fee,                       // $13
            costs.tourist_tax,                        // $14
            costs.total_amount,                       // $15
            costs.deposit_amount,                     // $16
            numericAmountToPay,                       // $17: L'importo numerico corretto
            paymentMethod,                            // $18
            'PENDING',                                // $19: Lo stato della prenotazione
            paymentAmount,                            // $20: La scelta testuale 'acconto' o 'totale'
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
