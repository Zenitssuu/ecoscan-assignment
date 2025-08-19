# EcoScan Backend

EcoScan Backend is a Node.js/Express REST API for analyzing clothing images, calculating eco scores, and serving eco-friendly offers. It integrates with Google Gemini Vision API for image analysis and provides endpoints for eco score calculation and offer retrieval.

## Features
- Analyze clothing images using Gemini Vision API
- Calculate eco scores based on detected items
- Serve eco-friendly offers based on user points
- Written in TypeScript, with modular controllers and services
- In-memory data for demo purposes

## Project Structure
```
backend/
  src/
    controllers/         # Route controllers (offers, image, ecoScore)
    routes/              # Express route definitions
    services/            # (Reserved for business logic, currently empty)
    logic.ts             # Core logic: AI, scoring, offers
    index.ts             # Express app entry point
  package.json           # Scripts and dependencies
  tsconfig.json          # TypeScript config
  .env                   # Environment variables (GEMINI_API_KEY)
```

## Setup
1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Configure environment:**
   - Create a `.env` file in `backend/`:
     ```env
     GEMINI_API_KEY=your_google_gemini_api_key
     ```
3. **Run in development:**
   ```bash
   npm run dev
   ```
   Or build and run:
   ```bash
   npm run build
   npm start
   ```
4. **Run tests:**
   ```bash
   npm test
   ```

## API Endpoints

### Analyze Image
- **POST** `/analyze-image`
- **Body:** `{ images: [{ base64: string }, ...] }`
- **Response:**
  ```json
  {
    "results": [
      {
        "filename": "image_1.jpg",
        "items": [ ... ],
        "ecoScore": { "totalCarbon": number, "points": number }
      },
      ...
    ]
  }
  ```

### Calculate Eco Score
- **POST** `/eco-score`
- **Body:** `{ items: [string, ...] }`
- **Response:** `{ totalCarbon: number, points: number }`

### Get Offers
- **GET** `/offers?points=NUMBER`
- **Response:** `{ offers: [ { id, name, points }, ... ] }`

## Development Notes
- Controllers are in `src/controllers/`, routes in `src/routes/`, core logic in `src/logic.ts`.
- All data (scores, offers) is in-memory for demo; adapt for production.
- Uses TypeScript, Jest for testing, and dotenv for config.

## License
MIT
