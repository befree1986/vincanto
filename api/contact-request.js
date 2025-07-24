import nodemailer from 'nodemailer'; // ✅ corretto per ESModule    
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' });
  }

  // 🧪 LOG dei dati ricevuti dal form
  console.log("📥 Dati ricevuti dal form:", req.body);

  // 🧪 LOG delle variabili ambiente lette
  console.log("🌐 Variabili ENV SMTP:", {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***' : 'undefined', // protezione password
    to: process.env.ADMIN_EMAIL,
  });

  const {
    name = 'Sconosciuto',
    email = 'noreply@example.com',
    phone = 'Non fornito',
    guests = 'Non specificato',
    checkin = 'Data non indicata',
    checkout = 'Data non indicata',
    message = 'Nessun messaggio',
  } = req.body;

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Vincanto" <${process.env.EMAIL_USER}>`,
    replyTo: email,
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
    console.log("📤 Invio email in corso...");
    await transporter.sendMail(mailOptions);
    console.log("✅ Email inviata con successo!");
    res.status(200).json({ success: true, message: 'Email inviata con successo!' });
  } catch (error) {
    console.error("❌ Errore durante l'invio:", error);
    res.status(500).json({ success: false, message: 'Errore invio email', error: error.message });
  }
}