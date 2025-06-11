import React, { useState } from 'react';
import './Booking.css';
import LemonDivider from '../components/LemonDivider';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface BookingFormData {
  name: string;
  surname: string;
  email: string;
  phone: string;
  guests: string;
  children: number;
  childrenAges: string[];
  checkin: string;
  checkout: string;
}

interface CalculationResults {
  numberOfNights: number;
  pricePerPersonPerNight: number;
  subtotal: number;
  touristTaxEligibleGuests: number;
  touristTax: number;
  grandTotal: number;
  depositAmount: number;
}

const MAX_CHILDREN = 5;
const MAX_CHILD_AGE = 16;

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
    checkin: '',
    checkout: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  // const [receiptFile, setReceiptFile] = useState<File | null>(null); // Rimosso stato per il file
  const [showSummary, setShowSummary] = useState(false);
  const [sending, setSending] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, guests: e.target.value }));
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const num = parseInt(e.target.value, 10);
    setFormData(prev => ({
      ...prev,
      children: num,
      childrenAges: Array(num).fill(''),
    }));
  };

  const handleChildAgeChange = (idx: number, value: string) => {
    setFormData(prev => {
      const newAges = [...prev.childrenAges];
      newAges[idx] = value;
      return { ...prev, childrenAges: newAges };
    });
  };

  const checkAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailability('checking');
    setTimeout(() => {
      if (formData.checkin && formData.checkout) {
        setAvailability('available');
      } else {
        setAvailability('unavailable');
      }
    }, 1200);
  };

  // Gestione cambio radio e file
  const handlePaymentAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAmount(e.target.value);
  };
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };
  // const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Rimosso handler per il file
  //   if (e.target.files && e.target.files[0]) {
  //     setReceiptFile(e.target.files[0]);
  //   }
  // };

  const calculateBookingCosts = (): CalculationResults | null => {
    const { checkin, checkout, guests, children, childrenAges } = formData;
    if (!checkin || !checkout || !guests) return null;

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    if (checkoutDate <= checkinDate) {
      setError(t("ErroreDateNonValide"));
      return null;
    }

    const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
    const numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (numberOfNights <= 0) return null;

    const numAdults = parseInt(guests, 10);
    const numChildren = children;
    const totalGuests = numAdults + numChildren;

    let pricePerPersonPerNight;
    if (totalGuests <= 0) pricePerPersonPerNight = 0;
    else if (totalGuests <= 2) pricePerPersonPerNight = 50;
    else if (totalGuests <= 4) pricePerPersonPerNight = 40;
    else pricePerPersonPerNight = 30; // Per 5 o più ospiti

    const subtotal = pricePerPersonPerNight * totalGuests * numberOfNights;

    let touristTaxEligibleGuests = numAdults;
    childrenAges.forEach(ageStr => {
      const age = parseInt(ageStr, 10);
      if (!isNaN(age) && age >= 14) {
        touristTaxEligibleGuests++;
      }
    });

    const touristTaxAmount = touristTaxEligibleGuests * 2 * numberOfNights; // Rinominiamo per chiarezza
    const grandTotal = subtotal; // Il grandTotal per il pagamento online ora è solo il subtotal
    const DEPOSIT_PERCENTAGE = 0.30; // 30% di acconto calcolato sul subtotal
    const depositAmount = grandTotal * DEPOSIT_PERCENTAGE;

    return {
      numberOfNights,
      pricePerPersonPerNight,
      subtotal,
      touristTaxEligibleGuests,
      touristTax: touristTaxAmount, // Usiamo il nome corretto della proprietà
      grandTotal,
      depositAmount,
    };
  };

  const handleProceedToSummary = () => {
    setError(null);
    const costs = calculateBookingCosts();
    if (costs) {
      setCalculationResults(costs);
      setShowSummary(true);
    } else if (!error) { // Se l'errore non è già stato impostato da calculateBookingCosts
      setError(t("ErroreControllaDateOspiti"));
    }
    // setShowSummary(true); // Spostato dentro if(costs) per mostrare il riepilogo solo se i costi sono validi
  };

  const handleBackToDetails = () => {
    setShowSummary(false);
    setError(null); // Resetta eventuali errori precedenti
  };

  // Invio dati a backend
  const handleActualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v, i) => data.append(`${key}[${i}]`, v));
        } else {
          data.append(key, value as string);
        }
      });
      data.append('paymentAmount', paymentAmount);
    data.append('paymentMethod', paymentMethod);
      
      // Chiama l'endpoint del CMS esistente
      await axios.post('http://localhost:5174/api/booking', data);
      
      // Chiama la nuova API per inviare l'email di conferma
      if (calculationResults) {
        await axios.post('http://localhost:5000/api/send-confirmation-email', { 
          formData, 
          calculationResults, 
          paymentAmount, 
          paymentMethod 
        });
      }
      // if (paymentMethod === 'bonifico' && receiptFile) { // Rimosso l'append del file
      //   data.append('receipt', receiptFile);
      // }
      // Chiamata API aggiornata per CMS su http://localhost:5174
      // await axios.post('http://localhost:5174/api/booking', data); // RIMOSSA CHIAMATA DUPLICATA
      
      setSubmitted(true);
      setFormData({
        name: '',
        surname: '',
        email: '',
        phone: '',
        guests: '',
        children: 0,
        childrenAges: [],
        checkin: '',
        checkout: '',
      });
      setPaymentAmount('');
      setPaymentMethod('');
      // setReceiptFile(null); // Rimosso reset stato file
      setCalculationResults(null);
      setShowSummary(false);
      setAvailability('idle');
    } catch (err: any) {
      setError(t('Si è verificato un errore durante l\'invio. Riprova più tardi.'));
    } finally {
      setSending(false);
    }
  };

  const isValidForSummary = 
    formData.checkin && 
    formData.checkout && 
    new Date(formData.checkout) > new Date(formData.checkin) &&
    formData.guests && parseInt(formData.guests, 10) > 0;

  return (
    <div className="booking-content">
      <form className="availability-form" onSubmit={checkAvailability}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="checkin">{t('Check-in')}</label>
            <input type="date" id="checkin" name="checkin" value={formData.checkin} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="checkout">{t('Check-out')}</label>
            <input type="date" id="checkout" name="checkout" value={formData.checkout} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="guests">{t('Adulti')}</label>
            <select id="guests" name="guests" value={formData.guests} onChange={handleGuestsChange} required>
              <option value="">{t('Seleziona')}</option>
              {[...Array(8)].map((_, idx) => (
                <option key={idx+1} value={String(idx+1)}>{idx+1}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="children">{t('Bambini')}</label>
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
                  {[...Array(MAX_CHILD_AGE + 1)].map((_, age) => (
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
        {availability==='unavailable' && <div className="availability-message unavailable">{t('Non disponibile per le date selezionate.')}</div>}
      </form>

      {availability === 'available' && !submitted && (
        <form className="booking-process-form" onSubmit={handleActualSubmit} style={{ marginTop: '2rem' }} encType="multipart/form-data">
          {!showSummary ? (
            <>
              {/* Vista Dettagli Prenotazione */}
              <div className="form-row user-details-row">
                <div className="form-group">
                  <label htmlFor="name">{t('Nome')}</label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="surname">{t('Cognome')}</label>
                  <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('Email')}</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t('Telefono')}</label>
                  <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
                </div>
              </div>
              {/* Sezione pagamento */}
              <div className="payment-section">
                <h3 className="payment-section-title">{t('Pagamento della Prenotazione')}</h3>
                <div className="form-group">
                  <label>{t('Scegli importo da pagare')}</label>
                  <div className="radio-group">
                    <label><input type="radio" name="paymentAmount" value="acconto" checked={paymentAmount === 'acconto'} onChange={handlePaymentAmountChange} required /> {t('Acconto (caparra)')}</label>
                    <label><input type="radio" name="paymentAmount" value="totale" checked={paymentAmount === 'totale'} onChange={handlePaymentAmountChange} required /> {t('Importo totale')}</label>
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
                {/* {paymentMethod === 'bonifico' && ( // Rimosso blocco caricamento file
                  // <div className="form-group file-upload-group">
                  //   <label htmlFor="receiptFile">{t('Carica la contabile del bonifico')}</label>
                  //   <input type="file" id="receiptFile" accept=".pdf,.jpg,.jpeg,.png" onChange={handleReceiptFileChange} required={paymentMethod === 'bonifico'} />
                  //   {receiptFile && <span className="file-name-display">{receiptFile.name}</span>}
                  //   {!receiptFile && <span className="file-name-display">{t('Nessun file scelto')}</span>}
                  // </div>
                )} */}
              </div>
              {error && <div className="error-message">{error}</div>}
              <button type="button" className="btn btn-accent" onClick={handleProceedToSummary} disabled={sending || !formData.name || !formData.surname || !formData.email || !formData.phone || !paymentAmount || !paymentMethod || !isValidForSummary}>
                {t('ProcediAlRiepilogo')}
              </button>
            </>
          ) : (
            // Vista Riepilogo Prenotazione
            <div className="booking-summary-page">
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
                <p><strong>{t('Check-in')}:</strong> {formData.checkin}</p>
                <p><strong>{t('Check-out')}:</strong> {formData.checkout}</p>
                <p><strong>{t('Adulti')}:</strong> {formData.guests}</p>
                {formData.children > 0 && (
                  <p><strong>{t('Bambini')}:</strong> {formData.children} ({formData.childrenAges.map(age => `${age} ${t('Anni')}`).join(', ')})</p>
                )}
              </div>

              {calculationResults && (
                <div className="summary-section cost-summary-section">
                  <h4>{t('RiepilogoCosti')}</h4>
                  <p><strong>{t('NumeroNotti')}</strong> {calculationResults.numberOfNights}</p>
                  <p>
                    <strong>{t('OspitiLabel')}</strong> {parseInt(formData.guests,10)} {t(parseInt(formData.guests,10) > 1 ? 'AdultiLabel' : 'AdultoLabel')}
                    {formData.children > 0 && `, ${formData.children} ${t(formData.children > 1 ? 'BambiniLabel' : 'BambinoLabel')}`}
                  </p>
                  <p><strong>{t('PrezzoBasePerPersonaNotte')}</strong> €{calculationResults.pricePerPersonPerNight.toFixed(2)}</p>
                  <hr />
                  <p><strong>{t('SubtotaleSoggiorno')}</strong> €{calculationResults.subtotal.toFixed(2)}</p>
                  <p>
                    <strong>{t('TassaDiSoggiorno')}</strong> €{calculationResults.touristTax.toFixed(2)}
                    <span className="tax-detail"> ({t('DettaglioTassaSoggiorno', { count: calculationResults.touristTaxEligibleGuests, nights: calculationResults.numberOfNights })})</span>
                  </p>
                  <p className="payable-total"><strong>{t('TotaleSoggiornoDaPagareOnline')}</strong> €{calculationResults.grandTotal.toFixed(2)}</p>
                  {calculationResults.touristTax > 0 && (
                    <p className="tourist-tax-note">{t('NotaTassaSoggiornoPagamento')}</p>
                  )}
                </div>
              )}

              <div className="summary-section payment-details-section">
                <h4>{t('DettagliPagamento')}</h4>
                <p><strong>{t('DettaglioOpzionePagamento')}</strong> {paymentAmount === 'acconto' ? t('Acconto (caparra)') : t('Importo totale')}</p>
                <p><strong>{t('DettaglioMetodoPagamento')}</strong>
                    {paymentMethod === 'bonifico' && t('Bonifico Immediato')}
                    {paymentMethod === 'carta' && t('Carta di Credito / Bancomat')}
                    {paymentMethod === 'altro' && t('Altri metodi elettronici')}
                </p>

                {calculationResults && paymentAmount === 'acconto' && (
                  <p><strong>{t('AccontoPercentuale', { percent: (0.30 * 100).toFixed(0) })}</strong> €{calculationResults.depositAmount.toFixed(2)}</p>
                )}
                {calculationResults && paymentAmount === 'totale' && (
                  <p><strong>{t('ValoreImportoTotaleDaVersare')}</strong> €{calculationResults.grandTotal.toFixed(2)}</p>
                )}

                <p className="summary-payment-info">{t('InfoTotaleDaPagare')}</p>
              </div>
              
              {error && <div className="error-message">{error}</div>}
              <div className="summary-actions">
                <button type="button" className="btn btn-secondary" onClick={handleBackToDetails} disabled={sending}>
                  {t('Indietro')}
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
        <div className="success-message">
          {t('IstruzioniPagamentoPostRiepilogo')}
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
