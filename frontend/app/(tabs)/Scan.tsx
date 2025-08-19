import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");
const BACKEND_URL = "http://10.205.249.135:3000/analyze-image";

const Scan = () => {
  const [images, setImages] = useState<{ uri: string; base64?: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 0.3,
      base64: true, // ✅ get base64
      selectionLimit: 5,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newImages = result.assets
        .filter((a) => !images.find((img) => img.uri === a.uri))
        .map((a) => ({
          uri: a.uri,
          base64: a.base64 ?? undefined, // Ensure base64 is string or undefined
        }));
      setImages([...images, ...newImages]);
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Camera permission is needed to take a photo."
        );
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.3,
        base64: true, // ✅ get base64
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (!images.find((img) => img.uri === asset.uri)) {
          setImages([
            ...images,
            { uri: asset.uri, base64: asset.base64 ?? undefined },
          ]);
          Animated.sequence([
            Animated.timing(fadeAnim, {
              toValue: 0.7,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }
    } catch (err) {
      Alert.alert(
        "Camera Error",
        (err as Error).message || "Something went wrong while taking a photo."
      );
    }
  };

  const removeImage = (uri: string) => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 100,
      useNativeDriver: true,
    }).start(() => {
      setImages(images.filter((img) => img.uri !== uri));
      fadeAnim.setValue(1);
    });
  };

  const analyzeImage = async () => {
    if (images.length === 0) return;
    setLoading(true);
    try {
      const payload = {
        images: images.map((img) => ({
          uri: img.uri,
          base64: img.base64,
        })),
      };

      const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to analyze image");
      const data = await res.json();
      const items = data.results[0].items;
      const score = data.results[0].ecoScore;
      // console.log("scan data",data.results);
      setLoading(false);
      router.push({
        pathname: "/Results",
        params: {
          // result: JSON.stringify(data),
          items: JSON.stringify(items),
          // images: JSON.stringify(images.map((i) => i.uri)),
          score: JSON.stringify(score),
        },
      });
    } catch (err) {
      setLoading(false);
      console.log(err);
      Alert.alert(
        "Error",
        (err as Error).message || "Failed to analyze image."
      );
    }
  };

  return (
    <View style={styles.gradientBg}>
      <View style={styles.container}>
        <Text style={styles.title}>Scan Your Clothing</Text>
        <Text style={styles.subtitle}>
          Add up to 5 images of your clothing items to analyze their carbon
          footprint.
        </Text>
        <View style={styles.centerContent}>
          <TouchableOpacity style={styles.actionButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={28} color="#fff" />
            <Text style={styles.actionButtonText}>Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
            <MaterialIcons name="photo-camera" size={28} color="#fff" />
            <Text style={styles.actionButtonText}>Camera</Text>
          </TouchableOpacity>
        </View>
        <Animated.View style={{ opacity: fadeAnim, width: "100%" }}>
          {images.length > 0 && (
            <View style={styles.cardPreview}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.previewScroll}
              >
                {images.map((img) => (
                  <View key={img.uri} style={styles.previewWrapper}>
                    <Image source={{ uri: img.uri }} style={styles.preview} />
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeImage(img.uri)}
                    >
                      <MaterialIcons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </Animated.View>
        {images.length === 0 && (
          <Text style={styles.hint}>No images selected yet.</Text>
        )}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#388e3c"
            style={{ marginTop: 20 }}
          />
        )}
        <TouchableOpacity
          style={[
            styles.analyzeButton,
            (images.length === 0 || loading) && styles.analyzeButtonDisabled,
          ]}
          onPress={analyzeImage}
          disabled={images.length === 0 || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="insights" size={22} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    backgroundColor: "linear-gradient(180deg, #e8f5e9 0%, #f7f7f7 100%)",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 32,
    paddingHorizontal: 10,
  },
  centerContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#388e3c",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  cardPreview: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 12,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 2,
    width: width - 48,
    alignSelf: "center",
  },
  previewScroll: {
    maxHeight: 120,
  },
  previewWrapper: {
    marginRight: 16,
    position: "relative",
  },
  preview: {
    width: 100,
    height: 100,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#388e3c",
  },
  removeBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#e53935",
    borderRadius: 12,
    padding: 2,
    zIndex: 2,
  },
  hint: {
    color: "#888",
    fontSize: 15,
    marginTop: 24,
    textAlign: "center",
  },
  analyzeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2e7d32",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginTop: 24,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  analyzeButtonDisabled: {
    backgroundColor: "#bdbdbd",
  },
  analyzeButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 8,
    letterSpacing: 0.5,
  },
});

export default Scan;
