const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/contact-request', async (req, res) => {
  const { name, email, phone, guests, checkin, checkout, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${email}>`,
    replyTo: email,
    to: process.env.MAIL_TO,
    subject: `Richiesta da ${name} — Vincanto`,
    html: `
      <h3>Nuova richiesta dal sito:</h3>
      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Telefono:</strong> ${phone}</p>
      <p><strong>Ospiti:</strong> ${guests}</p>
      <p><strong>Arrivo:</strong> ${checkin}</p>
      <p><strong>Partenza:</strong> ${checkout}</p>
      <p><strong>Messaggio:</strong><br/> ${message}</p>
    `,
  };

  try {
    console.log('📥 Dati form ricevuti:', req.body);
    console.log(`📨 Email in arrivo da ${name} <${email}>`);

    await transporter.sendMail(mailOptions);

    console.log('✅ Email inviata con successo!');
    res.status(200).json({ success: true, message: 'Email inviata con successo!' });
  } catch (error) {
    console.error('❌ Errore invio email:', error);
    res.status(500).json({ success: false, message: 'Errore invio email' });
  }
});

app.listen(3001, () => {
  console.log('✅ Backend avviato su http://localhost:3001');
});