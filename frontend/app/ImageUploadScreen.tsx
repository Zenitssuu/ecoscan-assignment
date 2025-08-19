import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ImageUploadScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload or Capture Clothing Image</Text>
      {/* TODO: Add camera/gallery picker and preview UI */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f7f7',
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
});

export default ImageUploadScreen;
