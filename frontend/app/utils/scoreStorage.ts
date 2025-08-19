import AsyncStorage from '@react-native-async-storage/async-storage';

const TOTAL_SCORE_KEY = 'TOTAL_ECO_SCORE';

export async function getTotalEcoScore(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem(TOTAL_SCORE_KEY);
    return value ? parseInt(value, 10) : 0;
  } catch {
    return 0;
  }
}

export async function addToTotalEcoScore(points: number): Promise<number> {
  const current = await getTotalEcoScore();
  console.log(points)
  const updated = current + points;
  await AsyncStorage.setItem(TOTAL_SCORE_KEY, updated.toString());
  return updated;
}

export async function resetTotalEcoScore() {
  await AsyncStorage.setItem(TOTAL_SCORE_KEY, '0');
}
