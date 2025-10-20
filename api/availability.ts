import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../db';
import { format } from 'date-fns';

/**
 * Funzione helper per ottenere le date non disponibili da tutte le fonti.
 * @param startDate La data di inizio del periodo di interesse.
 * @param endDate La data di fine del periodo di interesse.
 * @returns Un oggetto con le date non disponibili e un flag per la disponibilità parziale.
 */
async function getUnavailableDates(startDate: Date, endDate: Date) {
  const unavailableDates = new Set<string>();
  let partial = false;

  // 1. Recupera le prenotazioni confermate dal database
  // Logica di sovrapposizione manuale per evitare l'inclusività di OVERLAPS.
  // Una data è occupata se esiste una prenotazione dove:
  // (booking.check_in <= endDate) AND (booking.check_out > startDate)
  // Questo copre tutti i casi di sovrapposizione escludendo il giorno di check-out.
  const { rows } = await pool.query<{ check_in_date: string, check_out_date: string }>(
    `SELECT check_in_date, check_out_date
     FROM bookings
     WHERE status = 'confirmed' AND check_in_date < $2 AND check_out_date > $1`,
    [format(startDate, 'yyyy-MM-dd'), format(endDate, 'yyyy-MM-dd')]
  );

  for (const booking of rows) {
    let currentDate = new Date(booking.check_in_date);
    const lastDate = new Date(booking.check_out_date);
    while (currentDate < lastDate) {
      unavailableDates.add(format(currentDate, 'yyyy-MM-dd'));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  // 2. Recupera eventi da iCal (se configurato)
  // Aggiungi qui la logica per il fetch e il parsing di iCal se necessario.
  // Esempio:
  // const events = await ical.fromURL('URL_DEL_TUO_ICAL');
  // ... logica per aggiungere date da iCal a unavailableDates ...

  return { unavailableDates, partial };
}

/**
 * API endpoint per ottenere le date non disponibili.
 * Accetta `startDate` e `endDate` come parametri query (formato YYYY-MM-DD).
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { startDate: startDateStr, endDate: endDateStr } = req.query;

  // --- Validazione dell'input più robusta ---
  if (typeof startDateStr !== 'string' || typeof endDateStr !== 'string') {
    return res.status(400).json({ error: 'I parametri startDate e endDate sono obbligatori e devono essere stringhe.' });
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return res.status(400).json({ error: 'Formato data non valido. Usare YYYY-MM-DD.' });
  }
  if (startDate > endDate) {
    return res.status(400).json({ error: 'La data di inizio non può essere successiva alla data di fine.' });
  }

  try {
    const { unavailableDates, partial } = await getUnavailableDates(startDate, endDate);

    return res.status(200).json({
      unavailableDates: Array.from(unavailableDates),
      partial,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
    console.error('Errore nel recuperare la disponibilità:', errorMessage);
    return res.status(500).json({ 
      error: 'Errore interno del server.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}