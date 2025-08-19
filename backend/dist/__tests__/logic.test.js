"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logic_1 = require("../logic");
describe('EcoScan Logic', () => {
    it('analyzes image and returns items', () => {
        const items = (0, logic_1.analyzeImage)(Buffer.from([]));
        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBeGreaterThan(0);
    });
    it('calculates eco-score correctly', () => {
        const result = (0, logic_1.calculateEcoScore)(['t-shirt', 'jeans']);
        expect(result.totalCarbon).toBe(15);
        expect(result.points).toBe(3);
    });
    it('returns offers based on points', () => {
        const offers = (0, logic_1.getOffers)(20);
        expect(offers.length).toBeGreaterThan(0);
        expect(offers.some(o => o.name === 'Free Reusable Bag')).toBe(true);
    });
});
