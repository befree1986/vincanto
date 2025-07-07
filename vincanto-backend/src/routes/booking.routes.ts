import { Router } from 'express';
import { createBookingRequest } from '@controllers/booking.controller';
import validate from '@middleware/validateResource';
import { createBookingRequestSchema } from '@schemas/booking.schema';

const router = Router();

// Definiamo la rotta per la richiesta di prenotazione
// Prima esegue la validazione con il middleware, poi se è tutto ok passa al controller
router.post('/booking-request', validate(createBookingRequestSchema), createBookingRequest);

export default router;