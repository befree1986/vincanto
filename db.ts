import { db } from '@vercel/postgres';

// Esportiamo direttamente l'oggetto `db` che gestisce il pool di connessioni
// in modo ottimale per l'ambiente serverless di Vercel.
// Non è più necessario usare `@neondatabase/serverless` o configurare `ws`.
export default db;
