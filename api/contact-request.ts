import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { verify } from 'hcaptcha';

/**
 * Semplice funzione di sanificazione per rimuovere i tag HTML.
 * @param text Il testo da sanificare.
 * @returns Il testo senza tag HTML.
 */
function sanitize(text: string): string {
  return text.replace(/<[^>]*>?/gm, '');
}

/**
 * Interfaccia per i dati del form di contatto.
 */
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  guests?: string;
  checkin?: string;
  checkout?: string;
  message: string;
  hcaptchaToken: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Metodo non consentito' });
  }

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL, HCAPTCHA_SECRET } = process.env;
  if (!EMAIL_HOST || !EMAIL_PORT || !EMAIL_USER || !EMAIL_PASS || !ADMIN_EMAIL || !HCAPTCHA_SECRET) {
    console.error('❌ Variabili d\'ambiente per l\'email non configurate correttamente.');
    return res.status(500).json({ success: false, message: 'Errore di configurazione del server.' });
  }

  // --- Validazione e sanificazione dell'input ---
  const body = req.body as Partial<ContactFormData>;
  const { name, email, message, hcaptchaToken } = body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Il campo nome è obbligatorio.' });
  }
  if (!email || typeof email !== 'string' || !emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'L\'indirizzo email non è valido.' });
  }
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, message: 'Il campo messaggio è obbligatorio.' });
  }

  // --- Verifica hCaptcha ---
  if (!hcaptchaToken) {
    return res.status(400).json({ success: false, message: 'Verifica CAPTCHA non riuscita.' });
  }
  try {
    const { success } = await verify(HCAPTCHA_SECRET, hcaptchaToken);
    if (!success) {
      return res.status(400).json({ success: false, message: 'Verifica CAPTCHA non valida.' });
    }
  } catch (error) {
    console.error('❌ Errore nella verifica hCaptcha:', error);
    return res.status(500).json({ success: false, message: 'Errore durante la verifica CAPTCHA.' });
  }

  const sanitizedData: ContactFormData = {
    name: sanitize(name),
    email: email, // L'email è già validata, non serve sanificarla ulteriormente
    phone: body.phone ? sanitize(body.phone) : 'Non fornito',
    guests: body.guests ? sanitize(body.guests) : 'Non specificato',
    checkin: body.checkin ? sanitize(body.checkin) : 'Data non indicata',
    checkout: body.checkout ? sanitize(body.checkout) : 'Data non indicata',
    message: sanitize(message),
    hcaptchaToken: '', // Non serve inviarlo via email
  };

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: Number(EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  // --- Email all'amministratore ---
  const mailOptions = {
    from: `"Vincanto" <${EMAIL_USER}>`,
    replyTo: sanitizedData.email,
    to: ADMIN_EMAIL,
    subject: `Richiesta da ${sanitizedData.name} — Vincanto`,
    html: `
      <h3>Nuova richiesta dal sito:</h3>
      <p><strong>Nome:</strong> ${sanitizedData.name}</p>
      <p><strong>Email:</strong> ${sanitizedData.email}</p>
      <p><strong>Telefono:</strong> ${sanitizedData.phone}</p>
      <p><strong>Ospiti:</strong> ${sanitizedData.guests}</p>
      <p><strong>Arrivo:</strong> ${sanitizedData.checkin}</p>
      <p><strong>Partenza:</strong> ${sanitizedData.checkout}</p>
      <p><strong>Messaggio:</strong><br/> ${sanitizedData.message.replace(/\n/g, '<br>')}</p>
    `,
  };

  // --- Email di conferma al cliente ---
  const confirmationMail = {
    from: `"Vincanto" <${EMAIL_USER}>`,
    to: sanitizedData.email,
    subject: "Abbiamo ricevuto la tua richiesta ✨",
    html: `
      <p>Ciao ${sanitizedData.name},</p>
      <p>Grazie per averci contattato! 🍋</p>
      <p>Abbiamo ricevuto la tua richiesta e ti risponderemo al più presto. Siamo felici che tu stia considerando Vincanto per il tuo soggiorno.</p>
      <p><strong>Riepilogo della tua richiesta:</strong></p>
      <ul>
        <li><strong>Email:</strong> ${sanitizedData.email}</li>
        <li><strong>Telefono:</strong> ${sanitizedData.phone}</li>
        <li><strong>Numero di ospiti:</strong> ${sanitizedData.guests}</li>
        <li><strong>Data di arrivo:</strong> ${sanitizedData.checkin}</li>
        <li><strong>Data di partenza:</strong> ${sanitizedData.checkout}</li>
        <li><strong>Messaggio:</strong> ${sanitizedData.message}</li>
      </ul>
      <p>📍 <em>Vincanto • Via Torre di Milo, 7 • Maiori (SA)</em></p>
      <p>Un caro saluto,<br/>Lo staff di Vincanto</p>
    `,
  };

  try {
    console.log("📤 Invio email in corso...");
    
    // Inviamo entrambe le email in parallelo
    await Promise.all([
      transporter.sendMail(mailOptions),
      transporter.sendMail(confirmationMail)
    ]);

    console.log("✅ Email inviata con successo!");
    console.log("📧 Conferma inviata al cliente!");

    res.status(200).json({ success: true, message: 'Email inviata con successo!' });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.error("❌ Errore durante l'invio:", errorMessage);
    res.status(500).json({ 
      success: false, 
      message: 'Errore durante l\'invio dell\'email.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}