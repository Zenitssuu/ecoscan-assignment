import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { addToTotalEcoScore, getTotalEcoScore } from "./utils/scoreStorage";

export default function ResultsScreen() {
  const params = useLocalSearchParams();
  // console.log(params);

  let resultItems: any = {};
  // let images: string[] = [];
  let score: any = {};

  // Parse result JSON safely
  if (params.items) {
    try {
      resultItems = JSON.parse(params.items as string);
    } catch (e) {
      console.warn("Invalid result JSON:", e);
      resultItems = {};
    }
  }

  // Parse images JSON safely
  // if (params.images) {
  //   try {
  //     images = JSON.parse(params.images as string);
  //   } catch (e) {
  //     console.warn("Invalid images JSON:", e);
  //     images = [];
  //   }
  // }

  if (params.score) {
    try {
      score = JSON.parse(params.score as string);
    } catch (e) {
      console.warn("Invalid score JSON:", e);
      score = {};
    }
  }
  // console.log(resultItems);
  // console.log(images);

  const [totalScore, setTotalScore] = useState<number>(0);

  const [scoreAdded, setScoreAdded] = useState(false);

  // Reset scoreAdded when a new score object arrives
  useEffect(() => {
    setScoreAdded(false);
  }, [params.score]);

  useEffect(() => {
    if (!scoreAdded && score && typeof score.points === 'number' && score.points > 0) {
      addToTotalEcoScore(score.points).then((newTotal) => {
        setTotalScore(newTotal);
        setScoreAdded(true);
      });
    } else if (!score || typeof score.points !== 'number' || score.points <= 0) {
      getTotalEcoScore().then((currentTotal) => {
        setTotalScore(currentTotal);
      });
    }
    // setScoreAdded(false);
  }, [score, scoreAdded]);

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.resultCard}>
          <Text style={styles.title}>Analysis Results</Text>
          {/* Items section */}
          <View style={styles.resultDetails}>
            {resultItems?.length > 0 ? (
              resultItems.map((item: String, idx: Number) => {
                // console.log(item);
                return (
                  <View key={`item-${idx}`} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {item}
                      {/* <Text style={styles.score}>
                    Score: {item.carbonScore ?? "N/A"}
                  </Text> */}
                    </Text>
                  </View>
                );
              })
            ) : (
              <Text style={styles.noData}>No items detected.</Text>
            )}

            {score && (
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>
                  Total Score: {score.totalCarbon ?? "N/A"}
                </Text>

                <Text style={styles.itemText}>
                  Eco points: {score.points ?? "N/A"}
                </Text>
              </View>
            )}
          </View>
          <Text
            style={{
              fontSize: 18,
              color: "#388e3c",
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            Your Total Eco Points: {totalScore}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f6fa",
    flexGrow: 1,
  },
  resultCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#2d3436",
    textAlign: "center",
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
    justifyContent: "center",
  },
  resultImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  resultDetails: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
  },
  itemRow: {
    marginBottom: 10,
    backgroundColor: "#f1f2f6",
    padding: 10,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    color: "#2d3436",
  },
  score: {
    fontWeight: "600",
    color: "#0984e3",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#636e72",
    marginTop: 10,
  },
});
