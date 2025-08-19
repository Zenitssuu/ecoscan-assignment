"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const analyzeImage_1 = __importDefault(require("./routes/analyzeImage"));
const ecoScore_1 = __importDefault(require("./routes/ecoScore"));
const offers_1 = __importDefault(require("./routes/offers"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/analyze-image', analyzeImage_1.default);
app.use('/eco-score', ecoScore_1.default);
app.use('/offers', offers_1.default);
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`EcoScan backend running on port ${PORT}`);
});
