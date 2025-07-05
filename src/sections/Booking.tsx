import React, { useEffect, useState } from 'react';
import './Booking.css';
import LemonDivider from '../components/LemonDivider';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { it } from 'date-fns/locale';

registerLocale('it', it); // Registra la localizzazione italiana per il date-picker

interface BookingFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  guests: string;
  children: number;
  childrenAges: string[];
  checkin: Date | null;
  checkout: Date | null;
  parkingOption: 'street' | 'private' | '';
}

interface CalculationResults {
  numberOfNights: number;
  subtotalNightlyRate: number;
  cleaningFee: number;
  parkingCost: number;
  parkingOption: string;
  touristTaxEligibleGuests: number;
  touristTax: number;
  grandTotalWithTax: number;
  depositAmount: number;
  totalPayingGuests: number;
}

const MAX_CHILDREN = 5;

// --- CONFIGURAZIONE PRENOTAZIONE ---
// Spostiamo le costanti qui per una gestione più semplice.
const BOOKING_CONFIG = {
  CLEANING_FEE: 30,
  DEPOSIT_PERCENTAGE: 0.50,
  PARKING_RATE: 15,
  MIN_NIGHTS: 2,
  RATES: {
    BASE_PER_GUEST: 75, // Prezzo per i primi 2 ospiti
    ADDITIONAL_GUEST: 30, // Prezzo per ogni ospite aggiuntivo
  },
  // Le date vengono create senza orario per evitare problemi di fuso orario.
  // Mese è 0-indicizzato (7 = Agosto).
  AUGUST_RULE_START: new Date(2024, 7, 11),
  AUGUST_RULE_END: new Date(2024, 7, 25),
};

const BookingForm: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    surname: '',
    email: '',
    phone: '',
    guests: '',
    children: 0,
    childrenAges: [],
    checkin: null,
    checkout: null,
    parkingOption: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showParkingSelectionStep, setShowParkingSelectionStep] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [sending, setSending] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(1); // Nuovo stato per gestire i passaggi
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  // Carica le date prenotate dal backend quando il componente viene montato
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/booked-dates');
        const ranges: { start: string; end: string }[] = response.data;
        
        const disabledDates = ranges.flatMap(range => {
          const dates = [];
          let currentDate = new Date(range.start);
          const endDate = new Date(range.end);
          while (currentDate < endDate) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
          }
          return dates;
        });
        setBookedDates(disabledDates);
      } catch (error) {
        console.error("Errore nel caricamento delle date prenotate:", error);
        // Potresti voler mostrare un messaggio di errore all'utente
      }
    };

    fetchBookedDates();
  }, []);

  const getMinDate = () => {
    const now = new Date();
    // REGOLA: Prenotazione per il giorno dopo
    if (now.getHours() >= 23) { // Dalle 23:00 in poi
        now.setDate(now.getDate() + 2);
    } else {
        now.setDate(now.getDate() + 1);
    }
    now.setHours(0, 0, 0, 0); // Azzera l'orario per evitare problemi di confronto
    return now;
  };

  // --- LOGICA DI FILTRO PER AGOSTO ---
  const isDateInSpecialPeriod = (date: Date) => {
    return date >= BOOKING_CONFIG.AUGUST_RULE_START && date < BOOKING_CONFIG.AUGUST_RULE_END;
  };

  // Filtra le date di CHECK-IN: nel periodo speciale, solo le domeniche sono selezionabili.
  const filterCheckinDates = (date: Date) => {
    if (isDateInSpecialPeriod(date)) {
      return date.getDay() === 0; // Solo domenica
    }
    return true;
  };

  // Filtra le date di CHECK-OUT: se il check-in è nel periodo speciale, solo la domenica successiva è selezionabile.
  const filterCheckoutDates = (date: Date) => {
    if (formData.checkin && isDateInSpecialPeriod(formData.checkin)) {
      const nextSunday = new Date(formData.checkin);
      nextSunday.setDate(formData.checkin.getDate() + 7);
      return date.getTime() === nextSunday.getTime();
    }
    return true;
  };

  // Evidenzia i giorni del periodo speciale
  const dayClassName = (date: Date) => {
    const { AUGUST_RULE_START, AUGUST_RULE_END } = BOOKING_CONFIG;
    if (date >= AUGUST_RULE_START && date < AUGUST_RULE_END) {
      return 'special-august-day';
    }
    return '';
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Se l'utente cambia dettagli che influenzano il prezzo, resetta il flusso di prenotazione.
    if (['guests', 'children'].includes(name)) {
      setAvailability('idle');
      setShowParkingSelectionStep(false);
      setShowSummary(false);
      setError(null);
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name: 'checkin' | 'checkout', date: Date | null) => {
    setAvailability('idle');
    setShowParkingSelectionStep(false);
    setShowSummary(false);
    setError(null);

    if (name === 'checkin') {
      if (!date) { // Se il checkin viene cancellato
        setFormData(prev => ({ ...prev, checkin: null, checkout: null }));
        return;
      }
      // REGOLA SPECIALE AGOSTO: Se il check-in è una domenica nel periodo speciale,
      // imposta automaticamente il checkout alla domenica successiva.
      if (isDateInSpecialPeriod(date) && date.getDay() === 0) {
        const nextSunday = new Date(date);
        nextSunday.setDate(date.getDate() + 7);
        setFormData(prev => ({ ...prev, checkin: date, checkout: nextSunday }));
      } else {
        // Comportamento normale: resetta il checkout per forzare una nuova selezione
        setFormData(prev => ({ ...prev, checkin: date, checkout: null }));
      }
    } else if (name === 'checkout') {
      setFormData(prev => ({ ...prev, checkout: date }));
    }
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      children: num,
      childrenAges: Array(num).fill(''),
    }));
    // Resetta il flusso di prenotazione quando il numero di bambini cambia
    setAvailability('idle');
    setShowParkingSelectionStep(false);
    setShowSummary(false);
    setError(null);
  };

  const handleChildAgeChange = (idx: number, value: string) => {
    setFormData(prev => {
      const newAges = [...prev.childrenAges];
      newAges[idx] = value;
      return { ...prev, childrenAges: newAges };
    });
  };

  const handleParkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, parkingOption: e.target.value as 'street' | 'private' | '' }));
  };

  const checkAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Resetta errori precedenti

    if (!formData.checkin || !formData.checkout) {
      setError(t("Per favore, seleziona sia la data di check-in che quella di check-out."));
      return;
    }

    const checkinDate = formData.checkin;
    const checkoutDate = formData.checkout;

    if (checkoutDate <= checkinDate) {
      setError(t("La data di check-out deve essere successiva a quella di check-in."));
      return;
    }

    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numberOfNights < BOOKING_CONFIG.MIN_NIGHTS) {
      setError(t("Il soggiorno minimo è di 2 notti."));
      setAvailability('unavailable');
      return;
    }

    setAvailability('checking');

    // Simula una chiamata API per verificare la disponibilità
    setTimeout(() => {
      // --- REGOLA SPECIALE AGOSTO ---
      // Le due settimane centrali di agosto (dall'11 al 25) sono prenotabili
      // solo per intere settimane, da Domenica a Domenica.
      const { AUGUST_RULE_START: augustRuleStart, AUGUST_RULE_END: augustRuleEnd } = BOOKING_CONFIG;

      // La regola speciale si applica solo se il CHECK-IN avviene all'interno del periodo speciale.
      const isCheckinInSpecialPeriod = checkinDate >= augustRuleStart && checkinDate < augustRuleEnd;

      if (isCheckinInSpecialPeriod) {
        const isCheckinSunday = checkinDate.getDay() === 0;
        const isCheckoutSunday = checkoutDate.getDay() === 0;
        if (!isCheckinSunday || !isCheckoutSunday || (numberOfNights % 7 !== 0)) {
          setError(t("Nel periodo centrale di Agosto, le prenotazioni sono accettate solo per settimane complete, da Domenica a Domenica."));
          setAvailability('unavailable');
          return;
        }
      }

      // Controlla la sovrapposizione con altre date già prenotate
      const isOverlapping = bookedDates.some(range => {
        return checkinDate < range.end && checkoutDate > range.start;
      });

      if (isOverlapping) {
        setAvailability('unavailable');
        setError(t('Non disponibile per le date selezionate.'));
      } else {
        setAvailability('available');
        setShowParkingSelectionStep(false);
        setShowSummary(false);
      }
    }, 1200);
  };

  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(e.target.value);
  };
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const calculateBookingCosts = (): CalculationResults | null => {
    const { checkin, checkout, guests, childrenAges, parkingOption } = formData;
    if (!checkin || !checkout || !guests) return null;

    const checkinDate = checkin;
    const checkoutDate = checkout;

    if (checkoutDate <= checkinDate) {
      setError(t("ErroreDateNonValide"));
      return null;
    }

    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const numAdults = parseInt(guests, 10);
    
    let payingChildren = 0;
    (childrenAges || []).forEach(ageStr => {
        const age = parseInt(ageStr, 10);
        if (!isNaN(age) && age > 3) {
            payingChildren++;
        }
    });

    const totalPayingGuests = numAdults + payingChildren;
    if (totalPayingGuests <= 0) return null;

    let costPerNight = 0;
    if (totalPayingGuests >= 1) {
        costPerNight += Math.min(totalPayingGuests, 2) * BOOKING_CONFIG.RATES.BASE_PER_GUEST;
    }
    if (totalPayingGuests >= 3) {
        costPerNight += (totalPayingGuests - 2) * BOOKING_CONFIG.RATES.ADDITIONAL_GUEST;
    }
    const subtotalNightlyRate = costPerNight * numberOfNights;

    let touristTaxEligibleGuests = numAdults;
    childrenAges.forEach(ageStr => {
      const age = parseInt(ageStr, 10);
      if (!isNaN(age) && age >= 14) {
        touristTaxEligibleGuests++;
      }
    });
    const touristTax = touristTaxEligibleGuests * 2 * numberOfNights;

    const parkingCost = parkingOption === 'private' ? BOOKING_CONFIG.PARKING_RATE * numberOfNights : 0;

    const cleaningFee = BOOKING_CONFIG.CLEANING_FEE;
    const grandTotalWithTax = subtotalNightlyRate + cleaningFee + parkingCost + touristTax;
    const depositAmount = grandTotalWithTax * BOOKING_CONFIG.DEPOSIT_PERCENTAGE;

    return {
      numberOfNights,
      subtotalNightlyRate,
      cleaningFee,
      parkingCost,
      parkingOption: parkingOption || 'street',
      touristTaxEligibleGuests,
      touristTax,
      grandTotalWithTax,
      depositAmount,
      totalPayingGuests,
    };
  };

  const handleProceedToParkingSelection = () => {
    if (!formData.name || !formData.surname || !formData.email || !formData.phone || !paymentAmount || !paymentMethod) {
      setError(t("ErroreCompilaCampiUtentePagamento"));
      return;
    }
    setError(null);
    setShowParkingSelectionStep(true);
    setStep(3); // Vai allo step Parcheggio
  };

  const handleProceedToSummaryFromParking = () => {
    if (!formData.parkingOption) {
      setError(t("ErroreSelezionaParcheggio"));
      return;
    }
    setError(null);
    const costs = calculateBookingCosts();
    if (costs) {
      setCalculationResults(costs);
      setShowSummary(true);
      setShowParkingSelectionStep(false);
      setStep(4); // Vai allo step Riepilogo
    } else if (!error) {
      setError(t("ErroreControllaDateOspitiParcheggio"));
    }
  };

  const handleBackToParkingSelection = () => {
    setShowSummary(false);
    setShowParkingSelectionStep(true);
    setStep(3); // Torna allo step Parcheggio
  };
  const handleBackToUserDetails = () => {
    setShowParkingSelectionStep(false);
    setStep(2); // Torna allo step Pagamento
  };

  const handleCloseSuccessMessage = () => {
    setSubmitted(false);
  };

const handleActualSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSending(true);
  setError(null);

  const finalData = {
    formData,
    paymentAmount,
    paymentMethod,
    costs: calculateBookingCosts() // Includiamo anche i costi calcolati
  };

  try {
    const response = await axios.post('http://localhost:3001/api/booking-request', finalData);

    setSubmitted(true);
    // Reset completo dello stato del form
    setFormData({ name: '', surname: '', email: '', phone: '', guests: '', children: 0, childrenAges: [], checkin: null, checkout: null, parkingOption: '' });
    setPaymentAmount(''); setPaymentMethod('');
    setCalculationResults(null); setShowSummary(false);
    setAvailability('idle'); setStep(1);
    setShowParkingSelectionStep(false);

  } catch (err: any) {
    const serverMessage = err.response?.data?.message || t('Si è verificato un errore durante l\'invio. Riprova più tardi.');
    setError(serverMessage);
  } finally {
    setSending(false);
  }
};

  const areCoreDetailsValid =
    formData.checkin && 
    formData.checkout &&
    formData.checkout > formData.checkin &&
    formData.guests && parseInt(formData.guests, 10) > 0;

  const canProceedToParking =
    areCoreDetailsValid &&
    formData.name && formData.surname && formData.email && formData.phone && paymentAmount && paymentMethod;

  // --- NOTA VISIVA PER IL PERIODO SPECIALE ---
  const showSpecialPeriodNote =
    formData.checkin &&
    isDateInSpecialPeriod(formData.checkin) &&
    formData.checkin.getDay() === 0;

  return (
    <div className="booking-content">
      <form className="availability-form" onSubmit={checkAvailability}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkin">{t('Check-in')}</label>
            <DatePicker
              id="checkin"
              selected={formData.checkin}
              onChange={date => handleDateChange('checkin', date)}
              minDate={getMinDate()}
              filterDate={filterCheckinDates}
              dayClassName={dayClassName}
              excludeDates={bookedDates}
              locale="it"
              dateFormat="dd/MM/yyyy"
              placeholderText={t('Check-in')}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkout">{t('Check-out')}</label>
            <DatePicker
              id="checkout"
              selected={formData.checkout}
              onChange={date => handleDateChange('checkout', date)}
              minDate={formData.checkin ? new Date(formData.checkin.getTime() + 24 * 60 * 60 * 1000) : getMinDate()}
              filterDate={filterCheckoutDates}
              dayClassName={dayClassName}
              excludeDates={bookedDates}
              locale="it"
              dateFormat="dd/MM/yyyy"
              placeholderText={t('Check-out')}
              className="form-control"
              required
            />
          </div>
        </div>
        <div className="special-period-note">
          <span className="special-day-indicator"></span>
          {t('Le date evidenziate indicano il periodo con prenotazione settimanale obbligatoria (Dom-Dom).')}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="guests">{t('Adulti')}</label>
            <select id="guests" name="guests" value={formData.guests} onChange={handleFormChange} required>
              <option value="">{t('Seleziona')}</option>
              {[...Array(6)].map((_, idx) => (
                <option key={idx+1} value={String(idx+1)}>{idx+1}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="children">{t('Bambini e/o Ragazzi')}</label>
            <select id="children" name="children" value={formData.children} onChange={handleChildrenChange}>
              {[...Array(MAX_CHILDREN+1)].map((_, idx) => (
                <option key={idx} value={idx}>{idx}</option>
              ))}
            </select>
          </div>
        </div>
        {formData.children > 0 && (
          <div className="form-row">
            {Array.from({ length: formData.children }).map((_, idx) => (
              <div className="form-group" key={idx}>
                <label>{t('Età bambino')} {idx+1}</label>
                <select value={formData.childrenAges[idx] || ''} onChange={e => handleChildAgeChange(idx, e.target.value)} required>
                  <option value="">{t('Seleziona')}</option>
                  {[...Array(18)].map((_, age) => (
                    <option key={age} value={String(age)}>{age} {t('Anni')}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="btn btn-accent" disabled={availability==='checking'}>
          {availability==='checking' ? (
            <>{t('Verifica...')}</>
          ) : (
            <>{t('Verifica disponibilità')}</>
          )}
        </button>
        {availability==='available' && <div className="availability-message available">{t('Disponibile! Puoi prenotare ora.')}</div>}
        {availability==='unavailable' && error && <div className="availability-message unavailable">{error}</div>}
      </form>

      {availability === 'available' && !submitted && (
        <form className="booking-process-form" onSubmit={handleActualSubmit} style={{ marginTop: '2rem' }}>
          <div className="booking-steps-indicator">
            <span className={step === 1 ? 'active' : ''}>{t('Dati')}</span>
            <span className={step === 2 ? 'active' : ''}>{t('Pagamento')}</span>
            <span className={step === 3 ? 'active' : ''}>{t('Parcheggio')}</span>
            <span className={step === 4 ? 'active' : ''}>{t('Riepilogo')}</span>
          </div>

          {/* Nota periodo speciale */}
          {showSpecialPeriodNote && (
            <div className="special-period-note">
              <span className="special-day-indicator"></span>
              {t("Nel periodo centrale di Agosto (11-24), puoi prenotare solo settimane intere da Domenica a Domenica.")}
            </div>
          )}

          {!showParkingSelectionStep && !showSummary && areCoreDetailsValid && (
            <> {/* Step 1: Dati Utente e Pagamento */}
              <div className="form-row user-details-row">
                <div className="form-group">
                  <label htmlFor="name">{t('Nome')}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">{t('Cognome')}</label>
                  <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('Email')}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleFormChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t('Telefono')}</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleFormChange} required />
                </div>
              </div>
              {/* Sezione pagamento */}
              <div className="payment-section">
                <h3 className="payment-section-title">{t('Pagamento della Prenotazione')}</h3>
                <div className="form-group">
                  <label>{t('Scegli importo da pagare')}</label>
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="paymentAmount" value="acconto" checked={paymentAmount === 'acconto'} onChange={handlePaymentAmountChange} required /> {t('Acconto (caparra)')}
                    </label>
                    <label>
                      <input type="radio" name="paymentAmount" value="totale" checked={paymentAmount === 'totale'} onChange={handlePaymentAmountChange} required /> {t('Importo totale')}
                    </label>
                  </div>
                </div>
                <div className="form-group payment-method-group">
                  <label>{t('Metodo di pagamento')}</label>
                  <div className="radio-group radio-group-wrap">
                    <label><input type="radio" name="paymentMethod" value="bonifico" checked={paymentMethod === 'bonifico'} onChange={handlePaymentMethodChange} required /> {t('Bonifico Immediato')}</label>
                    <label><input type="radio" name="paymentMethod" value="carta" checked={paymentMethod === 'carta'} onChange={handlePaymentMethodChange} required /> {t('Carta di Credito / Bancomat')}</label>
                    <label><input type="radio" name="paymentMethod" value="altro" checked={paymentMethod === 'altro'} onChange={handlePaymentMethodChange} required /> {t('Altri metodi elettronici')}</label>
                  </div>
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="button" className="btn btn-accent" onClick={handleProceedToParkingSelection} disabled={sending || !canProceedToParking}>
                {t('ProcediSceltaParcheggio')}
              </button>
            </>
          )}

          {showParkingSelectionStep && !showSummary && (
            <> {/* Step 2: Selezione Parcheggio */}
              <div className="parking-selection-section" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <h3 className="parking-section-title">{t('OpzioniParcheggio')}</h3>
                <div className="form-group">
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="parkingOption" value="street" checked={formData.parkingOption === 'street'} onChange={handleParkingChange} required /> {t('ParcheggioInStrada')}
                    </label>
                    <label>
                      <input type="radio" name="parkingOption" value="private" checked={formData.parkingOption === 'private'} onChange={handleParkingChange} required /> {t('ParcheggioPrivatoCustodito')}
                    </label>
                  </div>
                  {formData.parkingOption === 'private' && <p className="parking-cost-note">{t('CostoParcheggioPrivatoInfo')}</p>}
                </div>
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="summary-actions">
                <button type="button" className="btn btn-secondary" onClick={handleBackToUserDetails} disabled={sending}>
                  {t('IndietroDatiUtente')}
                </button>
                <button type="button" className="btn btn-accent" onClick={handleProceedToSummaryFromParking} disabled={sending || !formData.parkingOption}>
                {t('ProcediAlRiepilogo')}
                </button>
              </div>
            </>
          )}
          {showSummary && calculationResults && (
            <div className="booking-summary-page"> {/* Step 3: Riepilogo Prenotazione */}
              <h3 className="summary-page-title">{t('TitoloRiepilogoRichiesta')}</h3>
              
              <div className="summary-section">
                <h4>{t('DatiAnagrafici')}</h4>
                <p><strong>{t('Nome')}:</strong> {formData.name}</p>
                <p><strong>{t('Cognome')}:</strong> {formData.surname}</p>
                <p><strong>{t('Email')}:</strong> {formData.email}</p>
                <p><strong>{t('Telefono')}:</strong> {formData.phone}</p>
              </div>

              <div className="summary-section">
                <h4>{t('DettagliPrenotazione')}</h4>
                <p><strong>{t('Check-in')}:</strong> {formData.checkin?.toLocaleDateString('it-IT')}</p>
                <p><strong>{t('Check-out')}:</strong> {formData.checkout?.toLocaleDateString('it-IT')}</p>
                <p><strong>{t('Adulti')}:</strong> {formData.guests}</p>
                {formData.children > 0 && (
                  <p><strong>{t('Bambini e/o Ragazzi')}:</strong> {formData.children} ({formData.childrenAges.map(age => `${age} ${t('Anni')}`).join(', ')})</p>
                )}
                <p><strong>{t('ParcheggioLabel')}</strong> {formData.parkingOption === 'street' ? t('ParcheggioInStrada') : t('ParcheggioPrivatoCustodito')}</p>
              </div>

              <div className="summary-section cost-summary-section">
                <h4>{t('RiepilogoCosti')}</h4>
                <p><strong>{t('NumeroNotti')}</strong> {calculationResults.numberOfNights}</p>
                <p><strong>{t('SubtotaleSoggiornoTariffa')}</strong> €{calculationResults.subtotalNightlyRate.toFixed(2)}</p>
                {calculationResults.totalPayingGuests > 2 && (
                    <p className="discount-info">
                        ({t('Include sconto per ospiti aggiuntivi')}: <span className="original-price">€75</span> <span className="discounted-price">€30</span>/persona)
                    </p>
                )}
                <p><strong>{t('CostoPuliziaBiancheria')}</strong> €{calculationResults.cleaningFee.toFixed(2)}</p>
                {calculationResults.parkingCost > 0 && (
                  <p><strong>{t('CostoParcheggio')}</strong> €{calculationResults.parkingCost.toFixed(2)}</p>
                )}
                <hr style={{ margin: "0.5rem 0"}}/>
                <p>
                  <strong>{t('TassaDiSoggiorno')}</strong> €{calculationResults.touristTax.toFixed(2)}
                  <span className="tax-detail"> ({t('DettaglioTassaSoggiorno', { count: calculationResults.touristTaxEligibleGuests, nights: calculationResults.numberOfNights })})</span>
                </p>
                <p className="grand-total-final">
                  <strong>{t('TotaleComplessivoDovuto')}</strong> €{calculationResults.grandTotalWithTax.toFixed(2)}
                </p>
              </div>

              <div className="summary-section payment-details-section">
                <h4>{t('DettagliPagamento')}</h4>
                <p><strong>{t('DettaglioOpzionePagamento')}</strong> {paymentAmount === 'acconto' ? t('Acconto (caparra)') : t('Importo totale')}</p>
                <p><strong>{t('DettaglioMetodoPagamento')}</strong>
                  {paymentMethod === 'bonifico' && t('Bonifico Immediato')}
                  {paymentMethod === 'carta' && t('Carta di Credito / Bancomat')}
                  {paymentMethod === 'altro' && t('Altri metodi elettronici')}
                </p>

                {paymentAmount === 'acconto' && (
                  <p><strong>{t('AccontoDaVersare', { percent: (BOOKING_CONFIG.DEPOSIT_PERCENTAGE * 100).toFixed(0) })}</strong> €{calculationResults.depositAmount.toFixed(2)}</p>
                )}
                {paymentAmount === 'totale' && (
                  <p><strong>{t('ValoreImportoTotaleDaVersare')}</strong> €{calculationResults.grandTotalWithTax.toFixed(2)}</p>
                )}

                {paymentAmount === 'acconto' && (
                  <p className="summary-payment-info">{t('InfoPagamentoAcconto')}</p>
                )}
                {paymentAmount === 'totale' && (
                  <p className="summary-payment-info">{t('InfoPagamentoTotaleConTassa')}</p>
                )}
              </div>
              
              {error && <div className="error-message">{error}</div>}
              <div className="summary-actions">
                <button type="button" className="btn btn-secondary" onClick={handleBackToParkingSelection} disabled={sending}>
                  {t('IndietroSelezioneParcheggio')}
                </button>
                <button type="submit" className="btn btn-accent btn-submit-booking" disabled={sending}>
                  {sending ? t('Invio in corso...') : t('ConfermaEInviaRichiesta')}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
      {submitted && (
        <div className="success-modal-overlay" onClick={handleCloseSuccessMessage}>
          <div className="success-modal-content" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseSuccessMessage} className="close-modal-btn">&times;</button>
            <div className="modal-icon">🎉</div>
            <h2 className="modal-title">{t('Richiesta Inviata con Successo!')}</h2>
            <p className="modal-text">{t('IstruzioniPagamentoPostRiepilogo')}</p>
            <button onClick={handleCloseSuccessMessage} className="btn btn-accent modal-ok-button">OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

const Booking: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="booking" className="booking-section">
      <div className="container">
        <h2 className="section-title underline-title titolo-sezione">
          {t('Disponibilità & Prenotazione')}
        </h2>
        <p className="section-subtitle booking-subtitle">
          {t('Verifica la disponibilità e invia la tua richiesta di prenotazione in pochi click')}
        </p>
        <BookingForm />
      </div>
      <LemonDivider position="left" />
    </section>
  );
};

export default Booking;
