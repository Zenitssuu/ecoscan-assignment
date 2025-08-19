import { Request, Response } from 'express';
import { calculateEcoScore } from '../logic';

export function ecoScoreController(req: Request, res: Response) {
  const { items } = req.body;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Invalid items array' });
  }
  try {
    const result = calculateEcoScore(items);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Eco-score calculation failed' });
  }
}
