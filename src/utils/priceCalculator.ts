import db from '../../db';

export interface CalculationInput {
  checkin: string;
  checkout: string;
  numAdults: number;
  numChildren: number;
  parking: boolean;
  discount?: {
    type: 'percentage';
    value: number;
  };
}

interface Setting {
  key: string;
  value: string;
}

export interface CalculationOutput {
  nights: number;
  basePrice: number;
  cleaningFee: number;
  parkingCost: number;
  touristTax: number;
  totalAmount: number;
  discountAmount: number;
  depositAmount: number;
}

async function getPricingConfig(): Promise<Record<string, number>> {
  const { rows } = await db.query<Setting>('SELECT key, value FROM settings');
  return rows.reduce((acc, setting) => ({ ...acc, [setting.key]: parseFloat(setting.value) }), {});
}

export async function calculateBookingCosts(input: CalculationInput): Promise<CalculationOutput> {
  const { checkin, checkout, numAdults, numChildren, parking, discount } =
    input;

  // Carica la configurazione dei prezzi dal DB
  const PRICING_CONFIG = await getPricingConfig();

  const checkinDate = new Date(checkin);
  const checkoutDate = new Date(checkout);

  if (checkoutDate <= checkinDate) {
    throw new Error("La data di check-out deve essere successiva a quella di check-in.");
  }

  const nights = Math.round((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24));

  // --- Logica di calcolo del prezzo base corretta ---
  const totalGuests = numAdults + numChildren;
  let basePriceInCents = 0;
  if (totalGuests > 0) {
    const priceForFirstTwo = Math.min(totalGuests, 2) * PRICING_CONFIG.PRICE_PER_NIGHT_FIRST_TWO * nights;
    const additionalGuests = Math.max(0, totalGuests - 2);
    const priceForOthers = additionalGuests * PRICING_CONFIG.PRICE_PER_NIGHT_ADDITIONAL * nights;
    basePriceInCents = priceForFirstTwo + priceForOthers;
  }

  // --- Applicazione dello sconto ---
  let discountAmountInCents = 0;
  if (discount && discount.type === 'percentage' && discount.value > 0) {
    // Lo sconto si applica solo al prezzo base del soggiorno
    discountAmountInCents = basePriceInCents * (discount.value / 100);
  }

  const cleaningFeeInCents = PRICING_CONFIG.CLEANING_FEE;
  const parkingCostInCents = parking ? PRICING_CONFIG.PARKING_PER_NIGHT * nights : 0;

  // La tassa di soggiorno si applica solo agli adulti (ipotizzando > 12 anni) per un max di 5 notti
  const taxableGuests = numAdults;
  const taxableNights = Math.min(nights, PRICING_CONFIG.TOURIST_TAX_MAX_NIGHTS);
  const touristTaxInCents = taxableGuests * PRICING_CONFIG.TOURIST_TAX_PER_ADULT_PER_NIGHT * taxableNights;

  const totalAmountInCents =
    basePriceInCents -
    discountAmountInCents +
    cleaningFeeInCents +
    parkingCostInCents +
    touristTaxInCents;
  const depositAmountInCents = totalAmountInCents * PRICING_CONFIG.DEPOSIT_PERCENTAGE;

  // Converte i centesimi in euro solo alla fine
  const toEuros = (cents: number) => parseFloat((cents / 100).toFixed(2));

  return {
    nights,
    basePrice: toEuros(basePriceInCents),
    cleaningFee: toEuros(cleaningFeeInCents),
    parkingCost: toEuros(parkingCostInCents),
    touristTax: toEuros(touristTaxInCents),
    totalAmount: toEuros(totalAmountInCents),
    discountAmount: toEuros(discountAmountInCents),
    depositAmount: toEuros(depositAmountInCents),
  };
}