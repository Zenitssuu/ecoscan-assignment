import AsyncStorage from '@react-native-async-storage/async-storage';

const REDEEMED_OFFERS_KEY = 'REDEEMED_OFFERS';

export async function getRedeemedOffers() {
  try {
    const jsonValue = await AsyncStorage.getItem(REDEEMED_OFFERS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    return [];
  }
}

export async function addRedeemedOffer(offer: any) {
  try {
    const current = await getRedeemedOffers();
    const updated = [...current, { ...offer, redeemedAt: new Date().toISOString() }];
    await AsyncStorage.setItem(REDEEMED_OFFERS_KEY, JSON.stringify(updated));
  } catch (e) {
    // handle error
  }
}
