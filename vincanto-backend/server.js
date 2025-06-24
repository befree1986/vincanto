const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Per consentire richieste dal frontend
const { Pool } = require('pg'); // Per la connessione al database PostgreSQL
const dotenv = require('dotenv');

dotenv.config(); // Carica le variabili ambiente da .env
const app = express();
app.use(cors());
app.use(express.json()); // Per parsare il body JSON delle richieste


// Configura il transporter di Nodemailer usando le variabili d'ambiente
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true', // true per 465, false per altri
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS // IMPORTANTE: La password è ora sicura nel file .env
    }
});

// Configurazione del Pool di Connessioni PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

// Funzione helper per il calcolo dei costi (da rendere più dinamica in futuro leggendo da DB)
function calculateServerSideCosts(formData) {
    const { checkin, checkout, guests, children, parkingOption } = formData;
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Gestione del caso in cui le date non siano valide o checkout sia prima di checkin
    if (isNaN(checkinDate.getTime()) || isNaN(checkoutDate.getTime()) || checkoutDate <= checkinDate) {
        // La validazione a monte dovrebbe già aver bloccato la richiesta,
        // ma per sicurezza ritorniamo 0 notti.
        return { numberOfNights: 0 /* ...altri valori a zero... */ };
    }

    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Tariffe (per ora statiche, in futuro da DB)
    const PRICE_PER_PERSON_PER_NIGHT = 70; // Esempio
    const CLEANING_FEE = 50; // Esempio
    const PARKING_COST_PRIVATE = 10; // Esempio costo parcheggio privato per notte
    const TOURIST_TAX_PER_PERSON_PER_NIGHT = 2;
    const DEPOSIT_PERCENTAGE = 0.30; // 30%

    const totalGuests = parseInt(guests, 10) + parseInt(children || 0, 10);
    let subtotalNightlyRate = numberOfNights * parseInt(guests, 10) * PRICE_PER_PERSON_PER_NIGHT;
    // Qui potresti aggiungere logica per prezzi diversi per bambini se necessario

    let parkingCost = 0;
    if (parkingOption === 'private') {
        parkingCost = numberOfNights * PARKING_COST_PRIVATE;
    }

    const totalPayableOnline = subtotalNightlyRate + CLEANING_FEE + parkingCost;

    const touristTaxEligibleGuests = parseInt(guests, 10); // Solo adulti pagano la tassa di soggiorno (esempio)
    const touristTax = touristTaxEligibleGuests * TOURIST_TAX_PER_PERSON_PER_NIGHT * numberOfNights;

    const grandTotalWithTax = totalPayableOnline + touristTax; // Questo è il totale che include la tassa
    const depositAmount = totalPayableOnline * DEPOSIT_PERCENTAGE; // Acconto calcolato sul totale online (esclusa tassa)

    return {
        numberOfNights,
        pricePerPersonPerNight: PRICE_PER_PERSON_PER_NIGHT,
        subtotalNightlyRateCents: Math.round(subtotalNightlyRate * 100),
        cleaningFeeCents: Math.round(CLEANING_FEE * 100),
        parkingCostCents: Math.round(parkingCost * 100),
        totalPayableOnlineCents: Math.round(totalPayableOnline * 100),
        touristTaxEligibleGuests,
        touristTaxCents: Math.round(touristTax * 100),
        grandTotalWithTaxCents: Math.round(grandTotalWithTax * 100),
        calculatedDepositCents: Math.round(depositAmount * 100),
        // Per l'email, passiamo anche i valori non in centesimi
        subtotalNightlyRate: subtotalNightlyRate,
        cleaningFee: CLEANING_FEE,
        parkingCost: parkingCost,
        totalPayableOnline: totalPayableOnline,
        touristTax: touristTax,
        grandTotalWithTax: grandTotalWithTax,
        depositAmount: depositAmount,
    };
}

// Route per la richiesta di prenotazione
app.post('/api/booking-request', async (req, res) => {
    const { formData, paymentAmount, paymentMethod } = req.body;

    // --- Validazione Dati Essenziali ---
    if (!formData || !paymentAmount || !paymentMethod) {
        return res.status(400).json({ success: false, message: "Dati di prenotazione incompleti." });
    }
    const { name, surname, email, phone, checkin, checkout, guests, parkingOption } = formData;
    if (!name || !surname || !email || !phone || !checkin || !checkout || !guests || !parkingOption) {
        return res.status(400).json({ success: false, message: "Mancano alcuni campi obbligatori nel form." });
    }

    // --- Validazione Aggiuntiva ---
    if (new Date(checkin) >= new Date(checkout)) {
        return res.status(400).json({ success: false, message: "La data di check-out deve essere successiva a quella di check-in." });
    }
    if (parseInt(guests, 10) <= 0) {
        return res.status(400).json({ success: false, message: "Il numero di ospiti deve essere almeno 1." });
    }
    // Si potrebbe aggiungere una validazione per il formato dell'email con una regex

    // --- Ricalcolo Costi Lato Server ---
    // Questo garantisce che i costi siano sempre quelli corretti, indipendentemente da ciò che invia il client.
    const serverCalculatedCosts = calculateServerSideCosts(formData);

    try {
        // --- Salvataggio nel Database (usando direttamente pool.query per semplicità e sicurezza) ---
        const queryText = `
            INSERT INTO Bookings (
                guest_name, guest_surname, guest_email, guest_phone,
                check_in_date, check_out_date, num_adults, num_children, children_ages,
                parking_option_selected, selected_payment_amount_option, selected_payment_method,
                number_of_nights,
                subtotal_nightly_rate_cents, cleaning_fee_cents, parking_cost_cents,
                tourist_tax_eligible_guests, tourist_tax_cents,
                grand_total_with_tax_cents, calculated_deposit_cents,
                booking_status, payment_status, currency
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
            RETURNING id;
        `;
        const values = [
            formData.name, formData.surname, formData.email, formData.phone,
            formData.checkin, formData.checkout, parseInt(formData.guests, 10), parseInt(formData.children || 0, 10), formData.childrenAges || [],
            formData.parkingOption, // street o private
            paymentAmount, // acconto o totale
            paymentMethod, // bonifico, carta, altro
            serverCalculatedCosts.numberOfNights,
            serverCalculatedCosts.subtotalNightlyRateCents, serverCalculatedCosts.cleaningFeeCents, serverCalculatedCosts.parkingCostCents,
            serverCalculatedCosts.touristTaxEligibleGuests, serverCalculatedCosts.touristTaxCents,
            serverCalculatedCosts.grandTotalWithTaxCents, serverCalculatedCosts.calculatedDepositCents,
            'PENDING_CONFIRMATION', // Stato iniziale
            'PENDING', // Stato pagamento iniziale
            'EUR'
        ];
        const dbRes = await pool.query(queryText, values);
        const bookingId = dbRes.rows[0].id;
        console.log('Prenotazione inserita con ID:', bookingId);

        // --- Invio Email di Conferma ---
        const mailOptions = {
            from: '"Vincanto" <info@vincantomaiori.it>',
            to: formData.email,
            subject: 'Conferma Prenotazione Vincanto',
            // Usa i costi ricalcolati dal server per l'email, garantendo coerenza
            html: generateConfirmationEmailHTML(formData, serverCalculatedCosts, paymentAmount, paymentMethod)
        };

        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, message: "Richiesta di prenotazione ricevuta e email di conferma inviata!" });
    } catch (error) {
        console.error("Errore durante la richiesta di prenotazione:", error);
        res.status(500).json({ success: false, message: "Errore durante l'elaborazione della richiesta." });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));

function generateConfirmationEmailHTML(formData, calculationResults, paymentAmount, paymentMethod) {
  const {
      name, surname, email, phone,
      checkin, checkout, guests, children, childrenAges
  } = formData;

  const {
      numberOfNights, pricePerPersonPerNight,
      subtotalNightlyRate, // Usiamo i valori non in centesimi per la visualizzazione
      cleaningFee, parkingCost, totalPayableOnline,
      touristTax, grandTotalWithTax, depositAmount, touristTaxEligibleGuests
  } = calculationResults;

  const paymentOption = paymentAmount === 'acconto' ? 'Acconto (caparra)' : 'Importo totale';
  let paymentMethodName = '';
  switch (paymentMethod) {
      case 'bonifico': paymentMethodName = 'Bonifico Immediato'; break;
      case 'carta': paymentMethodName = 'Carta di Credito/Bancomat'; break;
      case 'altro': paymentMethodName = 'Altri metodi elettronici'; break;
      default: paymentMethodName = paymentMethod; // Fallback per valori inattesi
  }

  let paymentInstructions = '';
  if (paymentMethod === 'bonifico') {
    // Istruzioni per il bonifico lette dalle variabili d'ambiente per maggiore flessibilità
    paymentInstructions = `
      <p>Per completare la prenotazione, effettua un bonifico di 
      ${paymentAmount === 'acconto' ? `€${depositAmount.toFixed(2)} (acconto)` : `€${totalPayableOnline.toFixed(2)} (importo totale online)`} alle seguenti coordinate:</p>
      <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Beneficiario:</strong> ${process.env.BANK_BENEFICIARY || 'NOME BENEFICIARIO'}</li>
          <li><strong>IBAN:</strong> ${process.env.BANK_IBAN || 'IT00 A000 0000 0000 0000 0000 000'}</li>
          <li><strong>Causale:</strong> Prenotazione Vincanto ${name} ${surname} - dal ${checkin} al ${checkout}</li>
      </ul>
      <p>Ti preghiamo di inviarci una copia della contabile via email a prenotazioni@vincantomaiori.it.</p>
    `;
  }
  // else if (paymentMethod === 'carta') { ... qui andrebbe la logica per il pagamento con carta ... }

  const childrenDetails = children > 0 ? ` e ${children} bambino${children > 1 ? 'i' : ''} (${childrenAges.map(age => `${age} anni`).join(', ')})` : '';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Conferma Prenotazione - Vincanto</h2>

      <p>Gentile ${name} ${surname},</p>

      <p>Grazie per aver prenotato il tuo soggiorno presso Vincanto! Abbiamo ricevuto la tua richiesta e ti confermiamo i dettagli:</p>

      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3>Dettagli Prenotazione:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Nome:</strong> ${name} ${surname}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefono:</strong> ${phone}</li>
          <li><strong>Check-in:</strong> ${checkin}</li>
          <li><strong>Check-out:</strong> ${checkout}</li>
          <li><strong>Ospiti:</strong> ${guests} adulto${parseInt(guests, 10) > 1 ? 'i' : ''}${childrenDetails}</li>
          <li><strong>Durata del soggiorno:</strong> ${numberOfNights} notti</li>
        </ul>

        <h3>Riepilogo Costi:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li><strong>Prezzo base:</strong> €${pricePerPersonPerNight.toFixed(2)} a persona/notte</li>
            <li><strong>Subtotale soggiorno (notti):</strong> €${subtotalNightlyRate.toFixed(2)}</li>
            ${formData.parkingOption === 'private' ? `<li><strong>Costo parcheggio privato:</strong> €${parkingCost.toFixed(2)}</li>` : ''}
            <li><strong>Costo pulizia:</strong> €${cleaningFee.toFixed(2)}</li>
            <li><strong>Totale da pagare online (esclusa tassa di soggiorno):</strong> €${totalPayableOnline.toFixed(2)}</li>
            ${paymentAmount === 'acconto' ? `<li><strong>Acconto (30%):</strong> €${depositAmount.toFixed(2)}</li>` : ''}
            <li><strong>Tassa di soggiorno (da pagare in struttura):</strong> €${touristTax.toFixed(2)}  (€2.00 x ${touristTaxEligibleGuests} adulto/i x ${numberOfNights} notti)</li>
            <li><strong>Importo Totale (inclusa tassa di soggiorno): €${grandTotalWithTax.toFixed(2)}</strong></li>
        </ul>

        <h3>Pagamento:</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li><strong>Opzione di pagamento scelta:</strong> ${paymentOption}</li>
          <li><strong>Metodo di pagamento:</strong> ${paymentMethodName}</li>
        </ul>

        ${paymentInstructions}

      </div>

      ${paymentMethod === 'bonifico' ? 
        `<p><strong>IMPORTANTE:</strong> La prenotazione sarà confermata solo dopo la ricezione e verifica del pagamento dell'acconto/saldo. Hai 48 ore per effettuare il pagamento e inviare la contabile, altrimenti la prenotazione potrebbe essere annullata.</p>` :
        '<p>A breve riceverai conferma del pagamento se effettuato con carta o altro metodo elettronico istantaneo.</p>'
      }

      <p>Non vediamo l'ora di accoglierti a Vincanto e rendere il tuo soggiorno indimenticabile!</p>
    </div>
  `;
}
