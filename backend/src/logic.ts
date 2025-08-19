import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// In-memory carbon scores for clothing items
const CARBON_SCORES: Record<string, number> = {
  // 👕 Clothing - Tops
  "t-shirt (cotton)": 5,
  "t-shirt (polyester)": 7,
  "polo shirt": 6,
  "shirt (cotton)": 8,
  "shirt (linen)": 6,
  hoodie: 12,
  "sweater (wool)": 14,
  "sweater (acrylic)": 10,
  "tank top": 4,
  blouse: 7,

  // 👖 Clothing - Bottoms
  jeans: 18,
  "shorts (cotton)": 6,
  "shorts (denim)": 9,
  skirt: 7,
  leggings: 6,
  trousers: 10,
  "formal pants": 12,
  "cargo pants": 11,

  // 🧥 Outerwear
  "jacket (denim)": 15,
  "jacket (leather)": 35,
  "jacket (synthetic)": 20,
  "winter coat": 30,
  blazer: 14,
  raincoat: 12,

  // 👟 Footwear
  sneakers: 14,
  "running shoes": 16,
  sandals: 6,
  "flip flops": 3,
  "formal shoes": 18,
  "leather boots": 28,
  "synthetic boots": 20,
  slippers: 4,

  // 🎒 Accessories
  cap: 3,
  "wool hat": 5,
  "scarf (cotton)": 4,
  "scarf (wool)": 7,
  "belt (leather)": 8,
  "belt (synthetic)": 5,
  sunglasses: 4,
  watch: 10,
  "handbag (leather)": 25,
  "handbag (fabric)": 12,
  "backpack (nylon)": 15,
  "backpack (canvas)": 12,
  "wallet (leather)": 8,
  "wallet (fabric)": 5,

  // 🧦 Small Clothing
  "socks (cotton)": 2,
  "socks (wool)": 3,
  stockings: 3,
  "gloves (cotton)": 3,
  "gloves (leather)": 10,

  // 👶 Kids
  "baby onesie": 3,
  "baby shoes": 2,
  "school uniform": 8,

  // 🛌 Lifestyle / Home Textile
  "towel (cotton)": 6,
  "towel (microfiber)": 5,
  "bedsheet (cotton)": 12,
  "bedsheet (silk)": 20,
  "blanket (wool)": 15,
  "blanket (synthetic)": 10,
  pillow: 8,
  curtains: 10,

  // 🎽 Sportswear
  "sports jersey": 7,
  "track pants": 8,
  "gym shorts": 6,
  swimsuit: 8,

  // 👰 Special
  "wedding dress": 50,
  suit: 30,
  sherwani: 35,
  lehenga: 40,
};

// In-memory offers
const OFFERS = [
  { id: 1, name: "10% Off Eco Store", points: 10 },
  { id: 2, name: "Free Reusable Bag", points: 15 },
  { id: 3, name: "Tree Planted in Your Name", points: 20 },
  { id: 4, name: "Carbon Neutral Delivery for 1 Order", points: 25 },
  { id: 5, name: "Discount on Eco-Friendly Footwear", points: 30 },
  { id: 6, name: "Free Bamboo Toothbrush", points: 10 },
  { id: 7, name: "Eco-friendly Laundry Detergent Sample", points: 15 },
  { id: 8, name: "Reusable Steel Water Bottle", points: 40 },
  { id: 9, name: "Eco Travel Voucher (Carbon Offset)", points: 50 },
  { id: 10, name: "One Month Sustainable Magazine Subscription", points: 35 },
];

// Gemini Vision API integration
export async function analyzeImage(imageBuffer: Buffer): Promise<string[]> {
  if (!process.env.GEMINI_API_KEY) throw new Error("Gemini API key not set");
  const base64Image = imageBuffer.toString("base64");

  const prompt = `
        You are an expert sustainability analyst. 
        Analyze the clothing items in this image and return a JSON object with the following fields:
        - item: Name of the detected clothing item
        - material: Likely material composition (e.g., cotton, polyester, wool)
        - productionImpact: Estimated CO2 emissions in kg per item based on material & manufacturing
        - transportImpact: Estimated CO2 emissions in kg (low/medium/high with reasoning)
        - usageImpact: Estimated CO2 emissions in kg (washing, drying, ironing, lifetime)
        - recyclingPotential: High/Medium/Low with explanation
        - totalCarbonScore: Sum of all above impacts in kg CO2

        Output strictly in JSON format (no explanation outside JSON).
`;

  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64Image,
      },
    },
    { text: prompt },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  console.log(response.text);
  const text = response.text || "";
  return text
    .split(",")
    .map((s: string) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function calculateEcoScore(items: string[]) {
  let totalCarbon = 0;
  for (const item of items) {
    totalCarbon += CARBON_SCORES[item.toLowerCase()] || 10;
  }
  // 1 point per 5kg CO2 saved
  const points = Math.floor(totalCarbon / 5);
  return { totalCarbon, points };
}

export function getOffers(points: number) {
  return OFFERS.filter((offer) => offer.points <= points);
}
