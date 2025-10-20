import type { VercelRequest, VercelResponse } from '@vercel/node';
import { calculateBookingCosts, type CalculationInput } from '../src/utils/priceCalculator';
import db from '../db';

interface Coupon {
  id: number;
  code: string;
  discount_percentage: number;
  active: boolean;
}

/**
 * Valida i dati in input per il calcolo del prezzo.
 * @param body Il corpo della richiesta.
 * @returns Un oggetto con i dati validati o un messaggio di errore.
 */
function validateInput(body: any): { data?: Omit<CalculationInput, 'discount'>; error?: string; couponCode?: string } {
  const { checkin, checkout, numAdults, numChildren, parking, couponCode } = body;

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (typeof checkin !== 'string' || !dateRegex.test(checkin)) {
    return { error: 'Il parametro checkin non è valido. Formato richiesto: YYYY-MM-DD.' };
  }
  if (typeof checkout !== 'string' || !dateRegex.test(checkout)) {
    return { error: 'Il parametro checkout non è valido. Formato richiesto: YYYY-MM-DD.' };
  }
  if (typeof numAdults !== 'number' || numAdults < 1) {
    return { error: 'Il numero di adulti deve essere un numero maggiore o uguale a 1.' };
  }
  if (typeof numChildren !== 'number' || numChildren < 0) {
    return { error: 'Il numero di bambini deve essere un numero maggiore o uguale a 0.' };
  }
  if (typeof parking !== 'boolean') {
    return { error: 'Il parametro parking deve essere un valore booleano.' };
  }

  return {
    data: { checkin, checkout, numAdults, numChildren, parking },
    couponCode: typeof couponCode === 'string' ? couponCode : undefined,
  };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { data, couponCode, error: validationError } = validateInput(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  let discount: CalculationInput['discount'] | undefined;

  try {
    if (couponCode) {
      const { rows } = await db.query<Coupon>(
        "SELECT discount_percentage FROM coupons WHERE code = $1 AND active = TRUE",
        [couponCode]
      );
      if (rows.length > 0) {
        discount = { type: 'percentage', value: rows[0].discount_percentage };
      }
    }

    // Usiamo 'data!' perché la validazione ci assicura che non sia undefined
    const costs = await calculateBookingCosts({ ...data!, discount });
    return res.status(200).json(costs);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto durante il calcolo del prezzo.';
    console.error('Errore nel calcolo del prezzo:', errorMessage);
    return res.status(500).json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
    });
  }
}