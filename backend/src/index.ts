import express from "express";
import analyzeImageRoutes from "./routes/analyzeImage";
import ecoScoreRoutes from "./routes/ecoScore";
import offersRoutes from "./routes/offers";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // Adjust this to your frontend URL in production
  })
);

app.use("/analyze-image", analyzeImageRoutes);
app.use("/eco-score", ecoScoreRoutes);
app.use("/offers", offersRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`EcoScan backend running on port ${PORT}`);
});
