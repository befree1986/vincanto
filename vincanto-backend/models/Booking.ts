import { Schema, model, Document } from 'mongoose';

export interface IBooking extends Document {
    name: string;
    surname: string;
    email: string;
    phone: string;
    checkin: Date;
    checkout: Date;
    guests: number;
    children: number;
    parkingOption: 'street' | 'private';
    paymentMethod: string;
    paymentAmount: string;
    status: 'pending' | 'confirmed' | 'cancelled';
}

const bookingSchema = new Schema<IBooking>({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    guests: { type: Number, required: true },
    children: { type: Number, default: 0 },
    parkingOption: { type: String, enum: ['street', 'private'], required: true },
    paymentMethod: { type: String, required: true },
    paymentAmount: { type: String, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
}, { 
    timestamps: true // Aggiunge automaticamente createdAt e updatedAt
});

const BookingModel = model<IBooking>('Booking', bookingSchema);

export default BookingModel;