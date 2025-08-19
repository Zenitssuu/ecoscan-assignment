import { analyzeImage, calculateEcoScore, getOffers } from '../logic';

describe('EcoScan Logic', () => {
  it('analyzes image and returns items', () => {
    const items = analyzeImage(Buffer.from([]));
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThan(0);
  });

  it('calculates eco-score correctly', () => {
    const result = calculateEcoScore(['t-shirt', 'jeans']);
    expect(result.totalCarbon).toBe(15);
    expect(result.points).toBe(3);
  });

  it('returns offers based on points', () => {
    const offers = getOffers(20);
    expect(offers.length).toBeGreaterThan(0);
    expect(offers.some(o => o.name === 'Free Reusable Bag')).toBe(true);
  });
});
