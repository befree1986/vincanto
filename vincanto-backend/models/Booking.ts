import { Schema, model, Document } from 'mongoose';
import validator from 'validator';

// Interfaccia che descrive le proprietà richieste per creare una nuova prenotazione
export interface IBooking extends Document {
  guest_name: string;
  guest_surname: string;
  guest_email: string;
  guest_phone: string;
  check_in_date: Date;
  check_out_date: Date;
  num_adults: number;
  num_children: number;
  children_ages: string[];
  parking_option: 'none' | 'private';
  base_price: number;
  parking_cost: number;
  cleaning_fee: number;
  tourist_tax: number;
  total_amount: number;
  deposit_amount: number;
  payment_amount: number;
  payment_method: string;
  booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  payment_choice: 'acconto' | 'totale';
}

// Schema Mongoose che definisce la struttura del documento nel database
const bookingSchema = new Schema<IBooking>({
  guest_name: { type: String, required: [true, 'Il nome è obbligatorio'] },
  guest_surname: { type: String, required: [true, 'Il cognome è obbligatorio'] },
  guest_email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    lowercase: true,
    validate: [validator.isEmail, 'Per favore, inserisci un\'email valida']
  },
  guest_phone: { type: String, required: [true, 'Il numero di telefono è obbligatorio'] },
  check_in_date: { type: Date, required: true },
  check_out_date: { type: Date, required: true },
  num_adults: { type: Number, required: true, min: 1 },
  num_children: { type: Number, required: true, min: 0 },
  children_ages: { type: [String], default: [] },
  parking_option: { type: String, enum: ['none', 'private'], required: true },
  base_price: { type: Number, required: true },
  parking_cost: { type: Number, required: true },
  cleaning_fee: { type: Number, required: true },
  tourist_tax: { type: Number, required: true },
  total_amount: { type: Number, required: true },
  deposit_amount: { type: Number, required: true },
  payment_amount: { type: Number, required: true },
  payment_method: { type: String, required: true },
  booking_status: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'PENDING' },
  payment_choice: { type: String, enum: ['acconto', 'totale'], required: true },
}, {
  timestamps: true // Aggiunge createdAt e updatedAt automaticamente
});

const Booking = model<IBooking>('Booking', bookingSchema);

export default Booking;