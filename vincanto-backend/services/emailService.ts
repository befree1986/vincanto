import nodemailer from 'nodemailer';
import { IBooking } from '../models/Booking';
import { config } from '../config';

// Configura il "trasportatore" di email usando le credenziali dal file .env
const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure, // true per la porta 465 (SSL), false per altre (es. 587 con TLS)
    auth: {
        user: config.email.user,
        pass: config.email.pass,
    },
});

/**
 * Invia due email: una di notifica all'amministratore e una di conferma al cliente.
 * @param bookingDetails I dettagli della prenotazione appena salvata.
 */
export const sendBookingRequestEmails = async (bookingDetails: IBooking) => {
    // --- Email per l'amministratore ---
    const adminMailOptions = {
        from: `"Sito Vincanto" <${config.email.user}>`,
        to: config.adminEmail,
        subject: `Nuova Richiesta di Prenotazione da ${bookingDetails.name} ${bookingDetails.surname}`,
        html: `
            <h1>Nuova Richiesta di Prenotazione Ricevuta</h1>
            <p>Hai ricevuto una nuova richiesta di prenotazione con i seguenti dettagli:</p>
            <ul>
                <li><b>Nome:</b> ${bookingDetails.name} ${bookingDetails.surname}</li>
                <li><b>Email:</b> ${bookingDetails.email}</li>
                <li><b>Telefono:</b> ${bookingDetails.phone}</li>
                <li><b>Check-in:</b> ${bookingDetails.checkin.toLocaleDateString('it-IT')}</li>
                <li><b>Check-out:</b> ${bookingDetails.checkout.toLocaleDateString('it-IT')}</li>
                <li><b>Ospiti:</b> ${bookingDetails.guests} adulti, ${bookingDetails.children} bambini</li>
                <li><b>Stato:</b> ${bookingDetails.status}</li>
            </ul>
            <p>Accedi al tuo pannello di amministrazione o al CRM per confermare la prenotazione.</p>
        `,
    };

    // --- Email di riepilogo per il cliente ---
    const clientMailOptions = {
        from: `"Vincanto - Maiori" <${config.email.user}>`,
        to: bookingDetails.email,
        subject: 'La tua richiesta di prenotazione per Vincanto è stata ricevuta!',
        html: `
            <h1>Grazie per la tua richiesta, ${bookingDetails.name}!</h1>
            <p>Abbiamo ricevuto la tua richiesta di prenotazione per il periodo dal <b>${bookingDetails.checkin.toLocaleDateString('it-IT')}</b> al <b>${bookingDetails.checkout.toLocaleDateString('it-IT')}</b>.</p>
            <p>Un nostro operatore la verificherà al più presto e ti contatterà per la conferma definitiva e per le istruzioni sul pagamento.</p>
            <p>Grazie per aver scelto Vincanto!</p>
            <br>
            <p><em>Questa è un'email generata automaticamente, per favore non rispondere.</em></p>
        `,
    };

    try {
        await transporter.sendMail(adminMailOptions);
        console.log('✉️ Email di notifica inviata all\'amministratore.');
        await transporter.sendMail(clientMailOptions);
        console.log('✉️ Email di conferma inviata al cliente.');
    } catch (error) {
        console.error('❌ Errore durante l\'invio delle email:', error);
        // In un'app di produzione, potresti voler gestire questo errore in modo più robusto
    }
};