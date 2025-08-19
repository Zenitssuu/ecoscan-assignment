
# EcoScan Frontend

EcoScan Frontend is a React Native (Expo) mobile app for scanning clothing, tracking eco points, and redeeming eco-friendly offers. It features image upload, animated points, persistent storage, and a modern rewards UI.

## Features
- Scan/upload clothing images for eco analysis
- View and redeem eco-friendly offers
- Animated eco points counter
- Persistent storage of points and redemption history (AsyncStorage)
- Grouped/timeline redemption history
- Offer details modal, confirmation modal, and unlimited redemptions
- Modern, responsive UI with Expo Router navigation

## Project Structure
```
frontend/
   app/
      OffersScreen.tsx         # Offers, redemption, history UI
      ResultsScreen.tsx        # Shows scan results and adds points
      ImageUploadScreen.tsx    # Image picker and upload
      HomeScreen.tsx           # App landing page
      utils/
         scoreStorage.ts        # AsyncStorage for eco points
         redeemedOffersStorage.ts # AsyncStorage for redemptions
      (tabs)/                  # Tab navigation screens
   assets/                    # Images and icons
   package.json               # Scripts and dependencies
   tsconfig.json              # TypeScript config
   README.md                  # (This file)
```

## Setup
1. **Install dependencies:**
    ```bash
    cd frontend
    npm install
    ```
2. **Start the app:**
    ```bash
    npx expo start
    ```
    - Use Expo Go, Android/iOS emulator, or web browser as prompted.

## Key Screens & Components
- **OffersScreen.tsx**: List, redeem, and view history of offers. Animated points, modals, grouped history.
- **ResultsScreen.tsx**: Shows eco analysis results and adds points.
- **ImageUploadScreen.tsx**: Pick/upload images for analysis.
- **utils/scoreStorage.ts**: Handles persistent eco points.
- **utils/redeemedOffersStorage.ts**: Handles persistent redemption history.

## Persistent Storage
- Uses `@react-native-async-storage/async-storage` for points and redemptions.
- Data persists across app restarts.

## Development Notes
- Built with Expo, React Native, and TypeScript.
- Uses Expo Router for navigation and file-based routing.
- Modern UI with animated feedback and grouped history.
- Easily extensible for new features (see OffersScreen.tsx for advanced UI logic).

## License
MIT
