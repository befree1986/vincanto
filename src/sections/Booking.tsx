import React, { useEffect, useState } from 'react';
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
  parkingOption: 'street' | 'private' | '';
}

interface CalculationResults {
  numberOfNights: number;
  // pricePerPersonPerNight: number; // Sostituito da subtotalNightlyRate per maggiore chiarezza con prezzi scaglionati
  subtotalNightlyRate: number;
  cleaningFee: number;
  parkingCost: number;
  parkingOption: string;
  totalPayableOnline: number; // subtotalNightlyRate + cleaningFee + parkingCost
  touristTaxEligibleGuests: number;
  touristTax: number;
  grandTotalWithTax: number; // totalPayableOnline + touristTax
  depositAmount: number; // Calcolato su totalPayableOnline
}

const MAX_CHILDREN = 5;
const MAX_CHILD_AGE = 17;

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
    parkingOption: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showParkingSelectionStep, setShowParkingSelectionStep] = useState(false);
  // const [receiptFile, setReceiptFile] = useState<File | null>(null); // Rimosso stato per il file
  const [showSummary, setShowSummary] = useState(false);
  const [sending, setSending] = useState(false);
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentNumberOfNights, setCurrentNumberOfNights] = useState<number | null>(null);

  const CLEANING_LINEN_FEE = 30;
  const DEPOSIT_PERCENTAGE = 0.50; // Acconto aggiornato al 50%

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (formData.checkin && formData.checkout) {
      const checkinDate = new Date(formData.checkin);
      const checkoutDate = new Date(formData.checkout);
      if (checkoutDate > checkinDate) {
        const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
        const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        setCurrentNumberOfNights(nights);
      } else {
        setCurrentNumberOfNights(null);
      }
    } else {
      setCurrentNumberOfNights(null);
    }
  }, [formData.checkin, formData.checkout]);

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

  const handleParkingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, parkingOption: e.target.value as 'street' | 'private' | '' }));
  };

  const checkAvailability = (e: React.FormEvent) => {
    e.preventDefault();
    setAvailability('checking');
    setTimeout(() => {
      if (formData.checkin && formData.checkout) {
        // Resetta gli step successivi quando si riverifica la disponibilità
        setAvailability('available');
        setShowParkingSelectionStep(false);
        setShowSummary(false);
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

  const isHighSeason = (checkinDate: Date): boolean => {
    const month = checkinDate.getMonth(); // 0 (Gen) - 11 (Dic)
    // Giugno, Luglio, Agosto sono alta stagione
    return month >= 6 && month <= 7; // 5: Giugno, 6: Luglio, 7: Agosto
  };

  const calculateBookingCosts = (): CalculationResults | null => {
    const { checkin, checkout, guests, children, childrenAges, parkingOption } = formData;
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

    if (totalGuests <= 0) return null;

    let subtotalNightlyRate = 0;

    if (numberOfNights === 1) {
      subtotalNightlyRate = totalGuests * 50; // 50€ a persona per 1 notte
    } else {
      let costPerNight = 0;
      if (totalGuests >= 1) {
        costPerNight += Math.min(totalGuests, 2) * 50; // Prime 2 persone
      }
      if (totalGuests >= 3) {
        costPerNight += Math.min(totalGuests - 2, 2) * 40; // 3ª e 4ª persona
      }
      if (totalGuests >= 5) {
        costPerNight += (totalGuests - 4) * 30; // Dalla 5ª persona in su
      }
      subtotalNightlyRate = costPerNight * numberOfNights;
    }

    let touristTaxEligibleGuests = numAdults;
    childrenAges.forEach(ageStr => {
      const age = parseInt(ageStr, 10);
      if (!isNaN(age) && age >= 14) {
        touristTaxEligibleGuests++;
      }
    });
    const touristTax = touristTaxEligibleGuests * 2 * numberOfNights;

    let parkingCost = 0;
    if (parkingOption === 'private') {
      const rate = isHighSeason(checkinDate) ? 20 : 15;
      parkingCost = rate * numberOfNights;
    }

    const cleaningFee = CLEANING_LINEN_FEE;
    const totalPayableOnline = subtotalNightlyRate + cleaningFee + parkingCost;
    const grandTotalWithTax = totalPayableOnline + touristTax;
    const depositAmount = grandTotalWithTax * DEPOSIT_PERCENTAGE; // Modificato per calcolare l'acconto sul totale complessivo

    return {
      numberOfNights,
      subtotalNightlyRate,
      cleaningFee,
      parkingCost,
      parkingOption: parkingOption || 'street', // Assicura che ci sia un valore
      totalPayableOnline,
      touristTaxEligibleGuests,
      touristTax,
      grandTotalWithTax,
      depositAmount,
    };
  };

  const handleProceedToParkingSelection = () => {
    // Validazione dei campi utente e pagamento prima di mostrare la selezione parcheggio
    if (!formData.name || !formData.surname || !formData.email || !formData.phone || !paymentAmount || !paymentMethod) {
      setError(t("ErroreCompilaCampiUtentePagamento")); // Nuova chiave di traduzione
      return;
    }
    setError(null);
    setShowParkingSelectionStep(true);
  };

  const handleProceedToSummaryFromParking = () => {
    if (!formData.parkingOption) {
      setError(t("ErroreSelezionaParcheggio")); // Nuova chiave di traduzione
      return;
    }
    setError(null);
    const costs = calculateBookingCosts();
    if (costs) {
      setCalculationResults(costs);
      setShowSummary(true);
      setShowParkingSelectionStep(false); // Nasconde la selezione parcheggio, mostra il riepilogo
    } else if (!error) { // Se l'errore non è già stato impostato da calculateBookingCosts
      setError(t("ErroreControllaDateOspitiParcheggio"));
    }
  };

  const handleBackToParkingSelection = () => { // Dal riepilogo torna alla selezione parcheggio
    setShowSummary(false);
    setShowParkingSelectionStep(true);
    setError(null);
  };
  const handleBackToUserDetails = () => { // Dalla selezione parcheggio torna ai dettagli utente
    setShowParkingSelectionStep(false);
    setError(null); // Resetta eventuali errori precedenti
  };

  // Funzione per chiudere il modale di successo e resettare lo stato
  const handleCloseSuccessMessage = () => {
    setSubmitted(false);
    // Lo stato del form è già stato resettato in handleActualSubmit,
    // quindi nascondere il modale mostrerà di nuovo il form iniziale.
  };

  // Invio dati a backend
const handleActualSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSending(true);
  setError(null);
  try {
    // Invia i dati come JSON (non FormData)
    await axios.post('http://localhost:3001/api/booking-request', {
      formData: { ...formData }, // Raggruppa tutti i dati del form sotto la chiave 'formData'
      paymentAmount,
      paymentMethod,
    });

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
      parkingOption: '',
    });
    setPaymentAmount('');
    setPaymentMethod('');
    setCalculationResults(null);
    setShowSummary(false);
    setAvailability('idle');
  } catch (err: any) {
    setError(t('Si è verificato un errore durante l\'invio. Riprova più tardi.'));
  } finally {
    setSending(false);
  }
};

  useEffect(() => {
    const guests = formData.guests ? parseInt(formData.guests, 10) : 0;
    // currentNumberOfNights è già disponibile dallo stato
    if (guests === 1 && currentNumberOfNights === 1 && paymentAmount === 'acconto') {
      setPaymentAmount('totale');
      // Opzionale: potresti voler informare l'utente di questa modifica automatica
      // ad esempio con un messaggio non invasivo o un tooltip.
    }
  }, [formData.guests, currentNumberOfNights, paymentAmount]);

  const areCoreDetailsValid = // Per abilitare il form dopo il check disponibilità
    formData.checkin && 
    formData.checkout && 
    new Date(formData.checkout) > new Date(formData.checkin) &&
    formData.guests && parseInt(formData.guests, 10) > 0;

  const canProceedToParking =
    areCoreDetailsValid &&
    formData.name && formData.surname && formData.email && formData.phone && paymentAmount && paymentMethod;

  const canProceedToSummaryFromParking =
    canProceedToParking && formData.parkingOption !== '';


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
                  {/* Opzioni da 0 a 13 anni */}
                  {[...Array(14)].map((_, age) => (
                    <option key={age} value={String(age)}>{age} {t('Anni')}</option>
                  ))}
                  {/* Opzione 14+ */}
                  <option value="14+">14+ {t('Anni')}</option>
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
          {!showParkingSelectionStep && !showSummary && areCoreDetailsValid && (
            <> {/* Step 1: Dati Utente e Pagamento */}
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
                    <label>
                      <input type="radio" name="paymentAmount" value="acconto" checked={paymentAmount === 'acconto'} onChange={handlePaymentAmountChange} required 
                      disabled={(formData.guests ? parseInt(formData.guests, 10) === 1 : false) && currentNumberOfNights === 1} /> {t('Acconto (caparra)')}
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
                <p><strong>{t('Check-in')}:</strong> {formData.checkin}</p>
                <p><strong>{t('Check-out')}:</strong> {formData.checkout}</p>
                <p><strong>{t('Adulti')}:</strong> {formData.guests}</p>
                {formData.children > 0 && (
                  <p><strong>{t('Bambini e/o Ragazzi')}:</strong> {formData.children} ({formData.childrenAges.map(age => `${age} ${t('Anni')}`).join(', ')})</p>
                )}
                <p><strong>{t('ParcheggioLabel')}</strong> {formData.parkingOption === 'street' ? t('ParcheggioInStrada') : t('ParcheggioPrivatoCustodito')}</p>
              </div>

              <div className="summary-section cost-summary-section">
                <h4>{t('RiepilogoCosti')}</h4>
                <p><strong>{t('NumeroNotti')}</strong> {calculationResults.numberOfNights}</p>
                {/* <p>
                  <strong>{t('OspitiLabel')}</strong> {parseInt(formData.guests,10)} {t(parseInt(formData.guests,10) > 1 ? 'AdultiLabel' : 'AdultoLabel')}
                  {formData.children > 0 && `, ${formData.children} ${t(formData.children > 1 ? 'BambiniLabel' : 'BambinoLabel')}`}
                </p> */}
                {/* <p><strong>{t('PrezzoBasePerPersonaNotte')}</strong> €{calculationResults.pricePerPersonPerNight.toFixed(2)}</p> */}
                <p><strong>{t('SubtotaleSoggiornoTariffa')}</strong> €{calculationResults.subtotalNightlyRate.toFixed(2)}</p>
                <p><strong>{t('CostoPuliziaBiancheria')}</strong> €{calculationResults.cleaningFee.toFixed(2)}</p>
                {calculationResults.parkingCost > 0 && (
                  <p><strong>{t('CostoParcheggio')}</strong> €{calculationResults.parkingCost.toFixed(2)}</p>
                )}
                <hr />
                <p className="payable-total"><strong>{t('TotaleDaPagareOnline')}</strong> €{calculationResults.totalPayableOnline.toFixed(2)}</p>
                <hr style={{ margin: "0.5rem 0"}}/>
                <p>
                  <strong>{t('TassaDiSoggiorno')}</strong> €{calculationResults.touristTax.toFixed(2)}
                  <span className="tax-detail"> ({t('DettaglioTassaSoggiorno', { count: calculationResults.touristTaxEligibleGuests, nights: calculationResults.numberOfNights })})</span>
                </p>
                <p className="grand-total-final">
                  <strong>{t('TotaleComplessivoDovuto')}</strong> €{calculationResults.grandTotalWithTax.toFixed(2)}
                </p>
                {/* La NotaTassaSoggiornoPagamento specifica per l'acconto è stata rimossa 
                    perché l'acconto ora è calcolato sul grandTotalWithTax, includendo quindi la tassa.
                    Le informazioni aggiornate sono in InfoPagamentoAcconto. */}
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
                  <p><strong>{t('AccontoDaVersare', { percent: (DEPOSIT_PERCENTAGE * 100).toFixed(0) })}</strong> €{calculationResults.depositAmount.toFixed(2)}</p>
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
      {/* Modale di successo che sostituisce il vecchio messaggio */}
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

/*
TODO: Aggiungere queste chiavi al file di traduzione i18n (es. public/locales/it/translation.json)

"ErroreCompilaCampiUtentePagamento": "Errore: compila tutti i campi relativi ai tuoi dati e al metodo di pagamento.",
"ErroreSelezionaParcheggio": "Errore: seleziona un'opzione di parcheggio per procedere.",
"ProcediSceltaParcheggio": "Procedi alla Scelta Parcheggio",
"IndietroDatiUtente": "Modifica Dati Utente/Pagamento",
"IndietroSelezioneParcheggio": "Modifica Scelta Parcheggio",

"ErroreControllaDateOspitiParcheggio": "Errore: controlla le date, il numero di ospiti o seleziona un'opzione di parcheggio.",
"Richiesta Inviata con Successo!": "Richiesta Inviata con Successo!",
"OpzioniParcheggio": "Scegli un'opzione per il parcheggio:",
"ParcheggioInStrada": "Parcheggio in strada (gratuito, non custodito)",
"ParcheggioPrivatoCustodito": "Parcheggio Privato Custodito",
"CostoParcheggioPrivatoInfo": "Il parcheggio privato ha un costo di €15/notte (bassa/media stagione) o €20/notte (alta stagione: Giu-Ago). Il costo verrà aggiunto al totale.",
"ParcheggioLabel": "Parcheggio:",
"SubtotaleSoggiornoTariffa": "Subtotale soggiorno (tariffa notti):",
"CostoPuliziaBiancheria": "Costo Pulizia e Biancheria:",
"CostoParcheggio": "Costo Parcheggio:",
"TotaleDaPagareOnline": "Totale da pagare online:",
"TotaleComplessivoDovuto": "Totale complessivo dovuto (tasse incluse):",
"AccontoDaVersare": "Acconto da versare ({{percent}}% del totale complessivo, tasse incl.):",
// NotaTassaSoggiornoPagamento (vecchia): "La Tassa di Soggiorno (€{{taxAmount}}) non è inclusa nell'acconto e verrà saldata in struttura insieme al saldo del soggiorno."
// Questa nota non è più mostrata per l'acconto con la nuova logica. Se necessario, può essere riutilizzata o adattata per altri contesti.
"InfoPagamentoAcconto": "L'acconto selezionato ({{percent}}% del totale complessivo, tasse incluse) sarà quello da versare. Il saldo rimanente (il restante {{saldoPercent}}% del totale complessivo) sarà da pagare in struttura.",
"InfoPagamentoTotaleConTassa": "L'importo totale selezionato, comprensivo di Tassa di Soggiorno, sarà quello da versare tramite il metodo scelto."

Modificare/verificare anche le chiavi esistenti se necessario per coerenza.
*/
