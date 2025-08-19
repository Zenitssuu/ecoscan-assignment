import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  Animated,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getTotalEcoScore, addToTotalEcoScore } from "./utils/scoreStorage";
import {
  getRedeemedOffers,
  addRedeemedOffer,
} from "./utils/redeemedOffersStorage";
import { useFocusEffect } from "expo-router";

// Example offers
const OFFERS = [
  {
    id: 1,
    name: "10% Off Eco Store",
    points: 10,
    description: "Get 10% off your next purchase at our eco-friendly store.",
    image: require("../assets/images/icon.png"),
  },
  {
    id: 2,
    name: "Free Reusable Bag",
    points: 20,
    description: "Receive a stylish reusable bag to reduce plastic waste.",
    image: require("../assets/images/icon.png"),
  },
  {
    id: 3,
    name: "Tree Planted in Your Name",
    points: 30,
    description: "We’ll plant a tree in your name to help the planet.",
    image: require("../assets/images/icon.png"),
  },
];

export default function OffersScreen() {
  const [totalScore, setTotalScore] = useState(0);
  const [displayedScore, setDisplayedScore] = useState(0);
  const animValue = useRef(new Animated.Value(0)).current;
  const [redeemedHistory, setRedeemedHistory] = useState<any[]>([]);

  // Modal states
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [detailsOffer, setDetailsOffer] = useState<any>(null);

  const [redeemSuccessModalVisible, setRedeemSuccessModalVisible] =
    useState(false);
  const [redeemSuccessOffer, setRedeemSuccessOffer] = useState<any>(null);

  // Load score and redeemed offers whenever screen is focused
  useFocusEffect(
    React.useCallback(() => {
      getTotalEcoScore().then((score) => {
        setTotalScore(score);
        setDisplayedScore(score);
        animValue.setValue(score);
      });
      getRedeemedOffers().then((offers) => {
        setRedeemedHistory(offers);
      });
    }, [])
  );

  // Animate score change
  useEffect(() => {
    Animated.timing(animValue, {
      toValue: totalScore,
      duration: 800,
      useNativeDriver: false,
    }).start();

    const id = animValue.addListener(({ value }) => {
      setDisplayedScore(Math.round(value));
    });
    return () => animValue.removeListener(id);
  }, [totalScore]);

  const handleRedeem = async (offer: (typeof OFFERS)[0]) => {
    if (totalScore < offer.points) {
      Alert.alert(
        "Not enough points",
        "You need more eco points to redeem this offer."
      );
      return;
    }
    const newScore = await addToTotalEcoScore(-offer.points);
    setTotalScore(newScore);
    await addRedeemedOffer(offer);
    const updatedHistory = await getRedeemedOffers();
    setRedeemedHistory(updatedHistory);

    setRedeemSuccessOffer(offer);
    setRedeemSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f6fa" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={textStyles.title}>Available Offers</Text>
        <Text style={textStyles.points}>Your Eco Points: {displayedScore}</Text>

        {OFFERS.sort((a, b) => {
          const aCount = redeemedHistory.filter((o) => o.id === a.id).length;
          const bCount = redeemedHistory.filter((o) => o.id === b.id).length;
          const aCan = totalScore >= a.points && aCount === 0;
          const bCan = totalScore >= b.points && bCount === 0;
          if (aCan === bCan) return a.points - b.points;
          return aCan ? -1 : 1;
        }).map((offer) => {
          const count = redeemedHistory.filter((o) => o.id === offer.id).length;
          // No longer limit redemption count

          return (
            <TouchableOpacity
              key={offer.id}
              style={styles.offerCard}
              activeOpacity={0.85}
              onPress={() => {
                setDetailsOffer(offer);
                setDetailsModalVisible(true);
              }}
            >
              <View style={{ alignItems: "center", width: "100%" }}>
                <Image
                  source={offer.image}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                />
                <Text style={textStyles.offerName}>{offer.name}</Text>
                <Text style={textStyles.offerPoints}>
                  {offer.points} points
                </Text>
                <Text
                  style={{
                    color: "#666",
                    fontSize: 13,
                    marginBottom: 4,
                    textAlign: "center",
                  }}
                >
                  {offer.description}
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.redeemBtn,
                  totalScore < offer.points ? styles.redeemBtnDisabled : null,
                ]}
                disabled={totalScore < offer.points}
                onPress={() => handleRedeem(offer)}
              >
                <Text style={textStyles.redeemBtnText}>Redeem</Text>
              </TouchableOpacity>
              {count > 0 && (
                <Text
                  style={{ color: "#388e3c", marginTop: 6, fontWeight: "bold" }}
                >
                  Redeemed: {count} {count === 1 ? "time" : "times"}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}

        {redeemedHistory.length > 0 && (
          <View style={styles.historySection}>
            <Text style={textStyles.historyTitle}>Redeemed Offers History</Text>
            {OFFERS.map((offer) => {
              const redemptions = redeemedHistory.filter(
                (o) => o.id === offer.id
              );
              if (redemptions.length === 0) return null;
              return (
                <View key={offer.id} style={styles.historyCard}>
                  <View style={styles.historyCardHeader}>
                    <Text style={textStyles.historyOfferIcon}>🎁</Text>
                    <Text style={textStyles.historyOfferName}>
                      {offer.name}
                    </Text>
                    <View style={styles.historyBadge}>
                      <Text style={textStyles.historyBadgeText}>
                        {redemptions.length}
                      </Text>
                    </View>
                  </View>
                  <Text style={textStyles.historyOfferPoints}>
                    {offer.points} points
                  </Text>
                  <View style={styles.historyDatesContainer}>
                    {redemptions.map((r, i) => (
                      <Text key={i} style={textStyles.historyDate}>
                        {r.redeemedAt
                          ? new Date(r.redeemedAt).toLocaleString()
                          : ""}
                      </Text>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal
        visible={detailsModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDetailsModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 32,
              alignItems: "center",
              width: 320,
            }}
          >
            {detailsOffer && (
              <>
                <Image
                  source={detailsOffer.image}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 16,
                    marginBottom: 16,
                  }}
                />
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color: "#2e7d32",
                    marginBottom: 8,
                  }}
                >
                  {detailsOffer.name}
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#333",
                    marginBottom: 12,
                    textAlign: "center",
                  }}
                >
                  {detailsOffer.description}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: "#888",
                    marginBottom: 18,
                  }}
                >
                  {detailsOffer.points} points required
                </Text>
              </>
            )}
            <TouchableOpacity
              style={{
                backgroundColor: "#2e7d32",
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 32,
              }}
              onPress={() => setDetailsModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Redeem Success Modal */}
      <Modal
        visible={redeemSuccessModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setRedeemSuccessModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.25)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 18,
              padding: 32,
              alignItems: "center",
              width: 300,
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🎉</Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#2e7d32",
                marginBottom: 8,
              }}
            >
              Success!
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#333",
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {redeemSuccessOffer
                ? `You redeemed: ${redeemSuccessOffer.name}`
                : ""}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#388e3c",
                marginBottom: 16,
              }}
            >
              Use code:{" "}
              <Text
                style={{ fontWeight: "bold", color: "#2e7d32" }}
              >{`ECO${redeemSuccessOffer?.id}2025`}</Text>
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#2e7d32",
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 32,
              }}
              onPress={() => setRedeemSuccessModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f6fa",
    flexGrow: 1,
    alignItems: "center",
  },
  offerCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    alignItems: "center",
  },
  redeemBtn: {
    backgroundColor: "#2e7d32",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 8,
  },
  redeemBtnDisabled: {
    backgroundColor: "#bdbdbd",
  },
  historySection: {
    width: "100%",
    marginTop: 32,
    backgroundColor: "#e8f5e9",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  historyCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  historyBadge: {
    backgroundColor: "#43a047",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
    minWidth: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  historyDatesContainer: {
    marginLeft: 30,
  },
});

const textStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 16,
    textAlign: "center",
  },
  points: {
    fontSize: 18,
    color: "#388e3c",
    fontWeight: "bold",
    marginBottom: 24,
  },
  offerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",
  },
  offerPoints: {
    fontSize: 15,
    color: "#888",
    marginBottom: 12,
  },
  redeemBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  historyOfferIcon: {
    fontSize: 22,
    marginRight: 8,
  },
  historyOfferName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    flex: 1,
  },
  historyBadgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  historyOfferPoints: {
    fontSize: 14,
    color: "#388e3c",
    marginBottom: 6,
    marginLeft: 30,
  },
  historyDate: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
});
