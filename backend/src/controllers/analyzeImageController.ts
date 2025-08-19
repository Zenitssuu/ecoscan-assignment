import { Request, Response } from "express";
import { analyzeImage, calculateEcoScore } from "../logic";

export async function analyzeImageController(req: Request, res: Response) {
  const { images } = req.body; // ✅ now expects JSON

  if (!images || images.length === 0) {
    return res.status(400).json({ error: "No images provided" });
  }

  try {
    const results = await Promise.all(
      images.map(async (img: { base64: string }, index: number) => {
        const items = await analyzeImage(Buffer.from(img.base64, "base64"));
        const ecoScore = calculateEcoScore(items);
        return {
          filename: `image_${index + 1}.jpg`,
          items,
          ecoScore,
        };
      })
    );
    console.log(results);
    return res.json({ results });
  } catch (err) {
    console.error("Image analysis error:", err);
    return res.status(500).json({ error: "Image analysis failed" });
  }
}
