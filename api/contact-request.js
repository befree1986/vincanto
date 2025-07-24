import nodemailer from 'nodemailer';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' });
  }

  const { name, email, phone, guests, checkin, checkout, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // Vercel legge tutto come stringa
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Vincanto" <${process.env.EMAIL_USER}>`, // mittente = utente SMTP
    replyTo: email, // così puoi rispondere al visitatore
    to: process.env.ADMIN_EMAIL,
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
  console.log('📥 Dati ricevuti:', req.body);
  console.log('📨 Configurazione SMTP:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
  });

  await transporter.sendMail(mailOptions);

  console.log('✅ Email inviata!');
  res.status(200).json({ success: true, message: 'Email inviata con successo!' });
} catch (error) {
  console.error('❌ Errore invio email:', error);
  res.status(500).json({ success: false, message: 'Errore invio email', error: error.message });
}
}