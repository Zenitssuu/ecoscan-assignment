"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ecoScoreController = ecoScoreController;
const logic_1 = require("../logic");
function ecoScoreController(req, res) {
    const { items } = req.body;
    if (!Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid items array' });
    }
    try {
        const result = (0, logic_1.calculateEcoScore)(items);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: 'Eco-score calculation failed' });
    }
}
