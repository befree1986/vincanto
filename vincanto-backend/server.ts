import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path'; // path è ancora utile per dotenv

//IMporta le rotte
import bookingRoutes from '@routes/booking.routes';
import adminRoutes from '@routes/admin.routes';
import errorHandler from '@middleware/error.middleware';

// --- 1. CONFIGURAZIONE INIZIALE ---
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// --- 2. CONFIGURAZIONE CORS (LA SOLUZIONE AL TUO PROBLEMA ORIGINALE) ---
const whitelist = ['http://localhost:5173', 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Permetti richieste dalla whitelist e richieste senza 'origin' (es. Postman)
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Non permesso da CORS'));
    }
  },
  credentials: true,
};

[{
	"resource": "/c:/Users/g_mar/Documents/lavoro/vincanto/vincanto-admin-frontend/Index.css",
	"owner": "_generated_diagnostic_collection_name_#0",
	"code": "unknownAtRules",
	"severity": 4,
	"message": "Unknown at rule @tailwind",
	"source": "css",
	"startLineNumber": 3,
	"startColumn": 1,
	"endLineNumber": 3,
	"endColumn": 10
}]

// Middleware per leggere il corpo delle richieste in formato JSON
app.use(express.json());

// --- DEBUG E CONFIGURAZIONE NODEMAILER ---
console.log('--- Variabili Ambiente Email ---');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL); // Email per le notifiche
console.log('--- Fine Variabili Ambiente ---');


// --- 3. CONNESSIONE A MONGODB ---
// Incolla qui la tua logica di connessione a MongoDB.
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('ERRORE: La variabile d\'ambiente MONGODB_URI non è definita nel file .env');
  process.exit(1); // Interrompe l'avvio se la URI non è presente
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connesso a MongoDB'))
  .catch(err => console.error('Errore di connessione a MongoDB:', err));

 // --- 4. ROUTING ---
// Rotte pubbliche per le richieste di prenotazione
app.use('/api/booking', bookingRoutes);
// Rotte private per il pannello di amministrazione
app.use('/api/admin', adminRoutes);

// --- 5. GESTIONE ERRORI ---
app.use(errorHandler);

// --- 5. AVVIO DEL SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Server backend in ascolto sulla porta ${PORT}`);
  // Questo messaggio è la prova che stai eseguendo il file corretto!
  console.log('✅ CORS è configurato per permettere richieste da:', whitelist.join(', '));
});
