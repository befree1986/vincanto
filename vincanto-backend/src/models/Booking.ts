import { Schema, model, Document } from 'mongoose';

// Questa è l'interfaccia che rappresenta un singolo documento di prenotazione nel database.
// Estende Document di Mongoose per includere proprietà come _id, createdAt, ecc.
export interface IBooking extends Document {
    guest_name: string;
    guest_surname: string;
    guest_email: string;
    guest_phone: string;
    check_in_date: Date;
    check_out_date: Date;
    num_adults: number;
    num_children: number;
    children_ages?: number[];
    parking_option: 'none' | 'with_car' | 'with_van';
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

// Schema di Mongoose che corrisponde all'interfaccia IBooking
const bookingSchema = new Schema<IBooking>({
    guest_name: { type: String, required: true },
    guest_surname: { type: String, required: true },
    guest_email: { type: String, required: true },
    guest_phone: { type: String, required: true },
    check_in_date: { type: Date, required: true },
    check_out_date: { type: Date, required: true },
    num_adults: { type: Number, required: true },
    num_children: { type: Number, required: true, default: 0 },
    children_ages: { type: [Number], default: [] },
    parking_option: { type: String, enum: ['none', 'with_car', 'with_van'], default: 'none' },
    base_price: { type: Number, required: true },
    parking_cost: { type: Number, default: 0 },
    cleaning_fee: { type: Number, required: true },
    tourist_tax: { type: Number, required: true },
    total_amount: { type: Number, required: true },
    deposit_amount: { type: Number, required: true },
    payment_amount: { type: Number, required: true },
    payment_method: { type: String, required: true },
    booking_status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'PENDING',
    },
    payment_choice: {
        type: String,
        enum: ['acconto', 'totale'],
        required: true,
    },
}, {
    timestamps: true, // Aggiunge createdAt e updatedAt
});

const Booking = model<IBooking>('Booking', bookingSchema);

export default Booking;
