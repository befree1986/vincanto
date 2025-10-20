import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { DayPicker, type DateRange } from 'react-day-picker';
import 'react-day-picker/dist/style.css'; // Stile di default per react-day-picker

interface BookingCalendarProps {
  onDateChange: (range: DateRange | undefined) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({ onDateChange }) => {
  const { t } = useTranslation();
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailabilityPartial, setIsAvailabilityPartial] = useState(false);

  const today = new Date();
  const nextYear = new Date();
  nextYear.setFullYear(today.getFullYear() + 1);

  useEffect(() => {
    const fetchUnavailableDates = async () => {
      setIsLoading(true);
      setIsAvailabilityPartial(false); // Resetta lo stato ad ogni fetch
      try {
        const response = await axios.get('/api/availability', {
          params: {
            startDate: format(today, 'yyyy-MM-dd'),
            endDate: format(nextYear, 'yyyy-MM-dd'),
          },
        });
        const { unavailableDates: disabledDates, partial } = response.data;
        setUnavailableDates(disabledDates.map((d: string) => new Date(d)));
        setIsAvailabilityPartial(partial);
      } catch (error) {
        console.error("Errore nel recupero della disponibilità:", error);
        // In caso di errore totale, potremmo voler mostrare un avviso più forte
        setIsAvailabilityPartial(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnavailableDates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Eseguito solo al mount

  const handleDateSelect = (selectedRange: DateRange | undefined) => {
    setRange(selectedRange);
    onDateChange(selectedRange);
  };

  return (
    <div className="booking-calendar-container">
      {isLoading && <p>{t('booking.calendar.loading')}</p>}
      {isAvailabilityPartial && !isLoading && (
        <div className="availability-warning">
          <p>{t('booking.calendar.partialAvailability')}</p>
        </div>
      )}
      <DayPicker
        mode="range"
        selected={range}
        onSelect={handleDateSelect}
        disabled={unavailableDates}
        numberOfMonths={2}
        fromMonth={today}
        toMonth={nextYear}
        pagedNavigation
        showOutsideDays
        fromDate={today} // Non si possono prenotare date passate
      />
    </div>
  );
};

export default BookingCalendar;
