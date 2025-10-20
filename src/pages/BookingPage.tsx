import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import BookingCalendar from '../components/BookingCalendar';
import './BookingPage.css';
import axios from 'axios';
import type { CalculationOutput } from '../utils/priceCalculator';
import type { DateRange } from 'react-day-picker';

type BookingStep = 'selection' | 'confirmation' | 'error';

interface CustomerData {
  name: string;
  email: string;
  phone: string;
}

const BookingPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null]);
  const [numAdults, setNumAdults] = useState(2);
  const [numChildren, setNumChildren] = useState(0);
  const [parking, setParking] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [costs, setCosts] = useState<CalculationOutput | null>(null);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [availabilityPartial, setAvailabilityPartial] = useState(false);

  const [customerData, setCustomerData] = useState<CustomerData>({
    name: '',
    email: '',
    phone: '',
  });

  const [bookingStep, setBookingStep] = useState<BookingStep>('selection');
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleDateChange = (range: DateRange | undefined) => {
    setSelectedDates([range?.from ?? null, range?.to ?? null]);
  };
  const handleCustomerDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({ ...prev, [name]: value }));
  };

  const calculatePrice = useCallback(async () => {
    const [checkin, checkout] = selectedDates;
    if (!checkin || !checkout) {
      setCosts(null);
      return;
    }

    setIsLoadingPrice(true);
    setPriceError(null);
    try {
      // La verifica disponibilità è già gestita dal calendario.
      // Qui calcoliamo direttamente il prezzo. Il backend farà il controllo finale.
      const availRes = await axios.get('/api/availability', {
        params: {
          startDate: format(checkin, 'yyyy-MM-dd'),
          endDate: format(checkout, 'yyyy-MM-dd'),
        }
      });
      if (availRes.data.partial) {
        setPriceError(t('booking.errors.availabilityPartial'));
        setCosts(null);
        return;
      }
      // Poi calcola il prezzo
      const response = await axios.post('/api/calculate-price', {
        checkin: format(checkin, 'yyyy-MM-dd'),
        checkout: format(checkout, 'yyyy-MM-dd'),
        numAdults,
        numChildren,
        parking,
        couponCode,
      });
      setCosts(response.data);
    } catch (error) {
      console.error("Errore nel calcolo del prezzo:", error);
      setPriceError(t('booking.errors.priceCalculation'));
      setCosts(null);
    } finally {
      setIsLoadingPrice(false);
    }
  }, [selectedDates, numAdults, numChildren, parking, couponCode, t]);

  useEffect(() => {
    calculatePrice();
  }, [calculatePrice]);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const [checkin, checkout] = selectedDates;

    if (!checkin || !checkout || !costs) {
      setBookingError(t('booking.errors.generic'));
      return;
    }

    setIsLoadingPrice(true); // Riutilizziamo lo stato di caricamento
    setBookingError(null);

    try {
      await axios.post('/api/create-booking', {
        checkin: format(checkin, 'yyyy-MM-dd'),
        checkout: format(checkout, 'yyyy-MM-dd'),
        num_adults: numAdults,
        num_children: numChildren,
        parking: parking, // Assicurati che questo sia inviato per il ricalcolo
        customer_name: customerData.name,
        customer_email: customerData.email,
        customer_phone: customerData.phone,
        language: i18n.language, // Passato correttamente
      });
      setBookingStep('confirmation');
    } catch (error: any) {
      console.error("Errore nella creazione della prenotazione:", error);
      if (error.response?.status === 409) {
        setBookingError(t('booking.errors.unavailable'));
      } else {
        setBookingError(t('booking.errors.generic'));
      }
      setBookingStep('error');
    } finally {
      setIsLoadingPrice(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('booking.seo.title')}</title>
        <meta name="description" content={t('booking.seo.description')} />
      </Helmet>
      <main className="booking-page-container">
        {bookingStep === 'selection' && (
          <div className="container">
            <h1 className="section-title">{t('booking.title')}</h1>
            <div className="booking-flow-container">
              <div className="booking-step">
                <h2>{t('booking.steps.step1')}</h2>
                <BookingCalendar onDateChange={handleDateChange} />
              </div>

              <div className="booking-step">
                <h2>{t('booking.steps.step2')}</h2>
                <div className="guests-form">
                  <div className="form-group">
                    <label htmlFor="numAdults">{t('booking.form.adults')}</label>
                    <input type="number" id="numAdults" value={numAdults} min={1} max={8} onChange={(e) => setNumAdults(parseInt(e.target.value, 10))} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="numChildren">{t('booking.form.children')}</label>
                    <input type="number" id="numChildren" value={numChildren} min={0} max={4} onChange={(e) => setNumChildren(parseInt(e.target.value, 10))} />
                  </div>
                  <div className="form-group-checkbox">
                    <input type="checkbox" id="parking" checked={parking} onChange={(e) => setParking(e.target.checked)} />
                    <label htmlFor="parking">{t('booking.form.parking')}</label>
                  </div>
                </div>

                {/* --- Campo Codice Sconto --- */}
                <div className="coupon-form">
                  <div className="form-group">
                    <label htmlFor="couponCode">{t('booking.form.coupon')}</label>
                    <input
                      type="text"
                      id="couponCode"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder={t('booking.form.couponPlaceholder')}
                    />
                  </div>
                </div>

                {isLoadingPrice && (
                  <div className="price-summary">
                    <p>{t('booking.calendar.loading')}</p>
                  </div>
                )}
                {priceError === t('booking.errors.availabilityPartial') && (
                  <div className="error-message">
                    <p>{t('booking.errors.availabilityPartial')}</p>
                    <button className="btn btn-accent" onClick={() => window.location.href = '/contact'}>
                      {t('booking.errors.contactButton')}
                    </button>
                  </div>
                )}
                {costs && !isLoadingPrice && (
                  <div className="price-summary">
                    <h3>{t('booking.summary.title')}</h3>
                    <ul>
                      <li><span>{t('booking.summary.nights', { count: costs.nights })}</span> <span>{costs.basePrice.toFixed(2)} €</span></li>
                      <li><span>{t('booking.summary.cleaning')}</span> <span>{costs.cleaningFee.toFixed(2)} €</span></li>
                      {costs.parkingCost > 0 && (
                        <li><span>{t('booking.summary.parking')}</span> <span>{costs.parkingCost.toFixed(2)} €</span></li>
                      )}
                      <li><span>{t('booking.summary.touristTax')}</span> <span>{costs.touristTax.toFixed(2)} €</span></li>
                      {costs.discountAmount > 0 && (
                        <li className="discount-item">
                          <span>{t('booking.summary.discount')}</span>
                          <span>- {costs.discountAmount.toFixed(2)} €</span>
                        </li>
                      )}
                    </ul>
                    {costs.discountAmount > 0 && (
                      <div className="original-price-container">
                        <span>{t('booking.summary.originalPrice')}</span>
                        <span className="original-price">{(costs.totalAmount + costs.discountAmount).toFixed(2)} €</span>
                      </div>
                    )}
                    <div className="total-price">
                      <strong>{t('booking.summary.total')}</strong>
                      <strong>{costs.totalAmount.toFixed(2)} €</strong>
                    </div>
                    <div className="deposit-info">
                      <span>{t('booking.summary.deposit')}</span>
                      <span>{costs.depositAmount.toFixed(2)} €</span>
                    </div>
                  </div>
                )}
                {priceError && priceError !== t('booking.errors.availabilityPartial') && (
                  <div className="error-message">
                    <p>{priceError}</p>
                    <button className="btn btn-accent" onClick={() => window.location.href = '/contact'}>
                      {t('booking.errors.contactButton')}
                    </button>
                  </div>
                )}

                {costs && !priceError && (
                  <form className="customer-details-form" onSubmit={handleBookingSubmit}>
                    <h2>{t('booking.steps.step3')}</h2>
                    <div className="form-group">
                      <label htmlFor="name">{t('booking.form.name')}</label>
                      <input type="text" id="name" name="name" value={customerData.name} onChange={handleCustomerDataChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">{t('booking.form.email')}</label>
                      <input type="email" id="email" name="email" value={customerData.email} onChange={handleCustomerDataChange} required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">{t('booking.form.phone')}</label>
                      <input type="tel" id="phone" name="phone" value={customerData.phone} onChange={handleCustomerDataChange} />
                    </div>
                    <button type="submit" className="btn btn-accent" disabled={isLoadingPrice}>
                      {isLoadingPrice ? t('contact.form.sending') : t('booking.form.bookNow')}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        )}

        {bookingStep === 'confirmation' && (
          <div className="container booking-confirmation">
            <h2>{t('booking.confirmation.title')}</h2>
            <p>{t('booking.confirmation.message')}</p>
          </div>
        )}

        {bookingStep === 'error' && (
          <div className="container booking-error">
            <h2>{t('booking.errors.title')}</h2>
            <p>{bookingError}</p>
            <button className="btn" onClick={() => setBookingStep('selection')}>
              {t('booking.errors.retry')}
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default BookingPage;