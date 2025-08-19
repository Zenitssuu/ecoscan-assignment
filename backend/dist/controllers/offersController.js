"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.offersController = offersController;
const logic_1 = require("../logic");
function offersController(req, res) {
    const points = Number(req.query.points);
    if (isNaN(points)) {
        return res.status(400).json({ error: 'Invalid points value' });
    }
    try {
        const offers = (0, logic_1.getOffers)(points);
        res.json({ offers });
    }
    catch (err) {
        res.status(500).json({ error: 'Failed to retrieve offers' });
    }
}
