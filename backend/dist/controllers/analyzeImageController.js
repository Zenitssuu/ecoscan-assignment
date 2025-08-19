"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeImageController = analyzeImageController;
const logic_1 = require("../logic");
function analyzeImageController(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    try {
        const items = (0, logic_1.analyzeImage)(req.file.buffer);
        res.json({ items });
    }
    catch (err) {
        res.status(500).json({ error: 'Image analysis failed' });
    }
}
