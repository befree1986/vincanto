import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Booking from 'src/models/Booking';
import { CreateBookingRequestInput } from '@schemas/booking.schema';
import { sendBookingRequestEmails } from '@services/email.service';

export const createBookingRequest = asyncHandler(async (req: Request<{}, {}, CreateBookingRequestInput>, res: Response) => {
  console.log('Richiesta ricevuta a /api/booking-request con dati:', req.body);
  const { formData, paymentAmount, paymentMethod, costs } = req.body;

  const bookingData = {
    guest_name: formData.name,
    guest_surname: formData.surname,
    guest_email: formData.email,
    guest_phone: formData.phone,
    check_in_date: new Date(formData.checkin),
    check_out_date: new Date(formData.checkout),
    num_adults: formData.guests,
    num_children: formData.children,
    children_ages: formData.childrenAges,
    parking_option: formData.parkingOption || 'none',
    base_price: costs?.subtotalNightlyRate ?? 0,
    parking_cost: costs?.parkingCost ?? 0,
    cleaning_fee: costs?.cleaningFee ?? 0,
    tourist_tax: costs?.touristTax ?? 0,
    total_amount: costs?.grandTotalWithTax ?? 0,
    deposit_amount: costs?.depositAmount ?? 0,
    payment_amount: costs
      ? (paymentAmount === 'acconto' ? costs.depositAmount : costs.grandTotalWithTax)
      : 0,
    payment_method: paymentMethod || '',
    booking_status: 'PENDING',
    payment_choice: paymentAmount === 'acconto' ? 'acconto' : 'totale',
  };

  const newBooking = new Booking(bookingData);
  await newBooking.save();
  console.log(`✅ Prenotazione salvata con successo nel DB (ID: ${newBooking._id}).`);

  // Invio delle email gestito dal servizio dedicato.
  // Non usiamo 'await' qui per non bloccare la risposta al cliente.
  // L'invio email può avvenire in background.
  sendBookingRequestEmails(newBooking, req.body);

  res.status(201).json({ success: true, message: 'Richiesta di prenotazione ricevuta e email inviate!' });
});

// Qui in futuro potrai aggiungere altre funzioni per questo controller
// export const getBookingById = async (req: Request, res: Response) => { ... };