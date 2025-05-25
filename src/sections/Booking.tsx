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
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
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
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0]);
    }
  };

  // Invio dati a backend
  const handleBooking = async (e: React.FormEvent) => {
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
      if (paymentMethod === 'bonifico' && receiptFile) {
        data.append('receipt', receiptFile);
      }
      // Chiamata API aggiornata per CMS su http://localhost:5174
      await axios.post('http://localhost:5174/api/booking', data);
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
      setReceiptFile(null);
      setAvailability('idle');
    } catch (err: any) {
      setError(t('Si è verificato un errore durante l\'invio. Riprova più tardi.'));
    } finally {
      setSending(false);
    }
  };

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
                  {[...Array(MAX_CHILD_AGE+1)].map((_, age) => (
                    <option key={age} value={String(age)}>{age} {t('anni')}</option>
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

      {availability==='available' && !submitted && (
        <>
          <form className="booking-form" onSubmit={handleBooking} style={{marginTop: '2rem'}} encType="multipart/form-data">
            <div className="form-row user-details-row">
              <div className="form-group">
                <label htmlFor="name">{t('Nome')}</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="surname">{t('Cognome')}</label>
                <input type="text" id="surname" name="surname" value={formData.surname} onChange={handleChange} required />
              </div>
            {/* </div L'originale aveva un div qui, ma sembra un errore di indentazione/struttura. Lo rimuovo per coerenza con gli altri campi email/phone>
            <div className="form-row"> */}
              <div className="form-group">
                <label htmlFor="email">{t('Email')}</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">{t('Telefono')}</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
            </div>
            {/* Sezione pagamento aggiornata con logica di stato */}
            <div className="payment-section">
              <h3 className="payment-section-title">{t('Pagamento della Prenotazione')}</h3>
              <div className="form-group">
                <label>{t('Scegli importo da pagare')}</label>
                <div className="radio-group">
                  <label><input type="radio" name="paymentAmount" value="acconto" checked={paymentAmount==='acconto'} onChange={handlePaymentAmountChange} required /> {t('Acconto (caparra)')}</label>
                  <label><input type="radio" name="paymentAmount" value="totale" checked={paymentAmount==='totale'} onChange={handlePaymentAmountChange} required /> {t('Importo totale')}</label>
                </div>
              </div>
              <div className="form-group payment-method-group">
                <label>{t('Metodo di pagamento')}</label>
                <div className="radio-group radio-group-wrap">
                  <label><input type="radio" name="paymentMethod" value="bonifico" checked={paymentMethod==='bonifico'} onChange={handlePaymentMethodChange} required /> {t('Bonifico Immediato')}</label>
                  <label><input type="radio" name="paymentMethod" value="carta" checked={paymentMethod==='carta'} onChange={handlePaymentMethodChange} required /> {t('Carta di Credito / Bancomat')}</label>
                  <label><input type="radio" name="paymentMethod" value="altro" checked={paymentMethod==='altro'} onChange={handlePaymentMethodChange} required /> {t('Altri metodi elettronici')}</label>
                </div>
              </div>
              {/* Upload contabile solo se bonifico */}
              {paymentMethod==='bonifico' && (
                <div className="form-group file-upload-group">
                  <label>{t('Carica la contabile del bonifico')}</label>
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleReceiptFileChange} required />
                </div>
              )}
              {/* Info placeholder per altri metodi */}
              {paymentMethod && paymentMethod!=='bonifico' && (
                <div className="form-group payment-gateway-info">
                  <p>{t('Verrai reindirizzato al gateway di pagamento elettronico per completare la transazione.')}</p>
                </div>
              )}
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="btn btn-accent btn-submit-booking" disabled={sending}>
              {sending ? t('Invio in corso...') : t('Prenota ora')}
            </button>
          </form>
        </>
      )}
      {submitted && (
        <div className="success-message">
          {t('Grazie per la tua richiesta di prenotazione! Ti ricontatteremo al più presto.')}
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
        <h2 className="section-title underline-title">
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
