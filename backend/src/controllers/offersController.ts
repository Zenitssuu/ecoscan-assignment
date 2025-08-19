import { Request, Response } from 'express';
import { getOffers } from '../logic';

export function offersController(req: Request, res: Response) {
  const points = Number(req.query.points);
  if (isNaN(points)) {
    return res.status(400).json({ error: 'Invalid points value' });
  }
  try {
    const offers = getOffers(points);
    res.json({ offers });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve offers' });
  }
}
