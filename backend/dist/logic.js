"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImage = analyzeImage;
exports.calculateEcoScore = calculateEcoScore;
exports.getOffers = getOffers;
// In-memory carbon scores for clothing items
const CARBON_SCORES = {
    't-shirt': 5,
    jeans: 10,
    jacket: 15,
    shoes: 8,
};
// In-memory offers
const OFFERS = [
    { id: 1, name: '10% Off Eco Store', points: 10 },
    { id: 2, name: 'Free Reusable Bag', points: 20 },
    { id: 3, name: 'Tree Planted in Your Name', points: 30 },
];
// Mock image analysis (replace with real model/API as needed)
function analyzeImage(_imageBuffer) {
    // For demo, return a fixed set
    return ['t-shirt', 'jeans'];
}
function calculateEcoScore(items) {
    let totalCarbon = 0;
    for (const item of items) {
        totalCarbon += CARBON_SCORES[item.toLowerCase()] || 0;
    }
    // 1 point per 5kg CO2 saved
    const points = Math.floor(totalCarbon / 5);
    return { totalCarbon, points };
}
function getOffers(points) {
    return OFFERS.filter((offer) => offer.points <= points);
}
