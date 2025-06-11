const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Per consentire richieste dal frontend

const app = express();
app.use(cors());
app.use(express.json()); // Per解析 JSON


// Configura il transporter di Nodemailer (sostituisci con le tue credenziali)
const transporter = nodemailer.createTransport({
    host: "smtp.vincantomaiori.it", // es: smtp.gmail.com per Gmail
    port: 465, // o 587 per TLS
    secure: true, // true per 465, false per altri, controlla le impostazioni del tuo provider
    auth: {
        user: "info@vincantomaiori.it",
        pass: "Anrosysi75"
    }
});

// Route per inviare l'email di conferma
app.post('/api/send-confirmation-email', async (req, res) => {
    const { formData, calculationResults, paymentAmount, paymentMethod } = req.body;

    if (!formData || !calculationResults || !paymentAmount || !paymentMethod) {
        return res.status(400).json({ success: false, message: "Dati incompleti per l'email." });
    }

    try {
        // Costruisci il contenuto dell'email (HTML)
        const mailOptions = {
            from: '"Vincanto" <info@vincantomaiori.it>',
            to: formData.email,
            subject: 'Conferma Prenotazione Vincanto',
            html: generateConfirmationEmailHTML(formData, calculationResults, paymentAmount, paymentMethod)
        };

        // Invia l'email
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: "Email di conferma inviata con successo!" });
    } catch (error) {
        console.error("Errore invio email:", error);
        res.status(500).json({ success: false, message: "Errore durante l'invio dell'email." });
    }
});

// Funzione per generare il HTML dell'email (vedi sotto)
function generateConfirmationEmailHTML(formData, calculationResults, paymentAmount, paymentMethod) {
  // ... (definizione della funzione - vedi passaggio successivo) ...
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server attivo sulla porta ${PORT}`));

function generateConfirmationEmailHTML(formData, calculationResults, paymentAmount, paymentMethod) {
  const {
      name, surname, email, phone,
      checkin, checkout, guests, children, childrenAges
  } = formData;

  const {
      numberOfNights, pricePerPersonPerNight, subtotal, touristTax, grandTotal, depositAmount
  } = calculationResults;

  const paymentOption = paymentAmount === 'acconto' ? 'Acconto (caparra)' : 'Importo totale';
  let paymentMethodName = '';
  switch (paymentMethod) {
      case 'bonifico': paymentMethodName = 'Bonifico Immediato'; break;
      case 'carta': paymentMethodName = 'Carta di Credito/Bancomat'; break;
      case 'altro': paymentMethodName = 'Altri metodi elettronici'; break;
  }

  let paymentInstructions = '';
  if (paymentMethod === 'bonifico') {
    // Aggiungi qui le tue istruzioni per il bonifico (IBAN, beneficiario, causale, etc.)
    paymentInstructions = `
      <p>Per completare la prenotazione, effettua un bonifico di 
      ${paymentAmount === 'acconto' ? `€${depositAmount.toFixed(2)} (acconto del 30%)` : `€${grandTotal.toFixed(2)} (importo totale)`}
      alle seguenti coordinate:</p>
      <ul>
          <li>Beneficiario: ...</li>
          <li>IBAN: ...</li>
          <li>Causale: Prenotazione Vincanto dal ${checkin} al ${checkout}</li>
      </ul>
      <p>Ti preghiamo di inviarci una copia della contabile via email a your-email@example.com.</p>
    `;
  }  // Altri metodi potrebbero avere istruzioni diverse o un link al gateway...
  // else if (paymentMethod === 'carta') { ... }

  const childrenDetails = children > 0 ? ` e ${children} bambino${children > 1 ? 'i' : ''} (${childrenAges.map(age => `${age} anni`).join(', ')})` : '';

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Conferma Prenotazione - Vincanto</h2>

      <p>Gentile ${name} ${surname},</p>

      <p>Grazie per aver prenotato il tuo soggiorno presso Vincanto! Abbiamo ricevuto la tua richiesta e ti confermiamo i dettagli:</p>

      <div style="background-color: #f8f8f8; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h3>Dettagli Prenotazione:</h3>
        <ul>
          <li><strong>Nome:</strong> ${name} ${surname}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Telefono:</strong> ${phone}</li>
          <li><strong>Check-in:</strong> ${checkin}</li>
          <li><strong>Check-out:</strong> ${checkout}</li>
          <li><strong>Ospiti:</strong> ${guests} adulto${parseInt(guests, 10) > 1 ? 'i' : ''}${childrenDetails}</li>
          <li><strong>Durata del soggiorno:</strong> ${numberOfNights} notti</li>
        </ul>

        <h3>Riepilogo Costi:</h3>
        <ul>
            <li><strong>Prezzo base:</strong> €${pricePerPersonPerNight.toFixed(2)} a persona/notte</li>
            <li><strong>Subtotale soggiorno:</strong> €${subtotal.toFixed(2)}</li>
            <li><strong>Tassa di soggiorno (da pagare in struttura):</strong> €${touristTax.toFixed(2)}  (€2.00 x ${calculationResults.touristTaxEligibleGuests} adulti x ${numberOfNights} notti)</li>
            <li><strong>Totale da pagare online (esclusa tassa di soggiorno):</strong> €${grandTotal.toFixed(2)}</li>
            ${paymentAmount === 'acconto' ? `<li><strong>Acconto (30%):</strong> €${depositAmount.toFixed(2)}</li>` : ''}
        </ul>

        <h3>Pagamento:</h3>
        <ul>
          <li><strong>Opzione di pagamento scelta:</strong> ${paymentOption}</li>
          <li><strong>Metodo di pagamento:</strong> ${paymentMethodName}</li>
        </ul>

        ${paymentInstructions}

      </div>

      <p>Riceverai a breve un'ulteriore email con le istruzioni di pagamento dettagliate, se necessario.</p>

      <p>Non vediamo l'ora di accoglierti a Vincanto e rendere il tuo soggiorno indimenticabile!</p>

      <p>Cordiali saluti,<br>
      Il Team Vincanto</p>
    </div>
  `;
}
