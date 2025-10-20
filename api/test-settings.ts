import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../db';

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const { rows } = await pool.query('SELECT key, value FROM settings');
    res.status(200).json({ settings: rows });
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : String(error) });
  }
}
