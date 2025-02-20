import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createArticle } from "../services/contentExtraction";
import { ContentExtractor } from "../components/ContentExtractor";

export const URLInputScreen = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const navigation = useNavigation();

  const handleUrlSubmit = () => {
    if (!url) return;
    setLoading(true);
    setShowExtractor(true);
  };

  const handleExtracted = (data: any) => {
    setShowExtractor(false);
    setLoading(false);
    const article = createArticle(data, url);
    navigation.navigate("Reader", { article });
  };

  const handleError = () => {
    setShowExtractor(false);
    setLoading(false);
    console.error("Failed to extract content");
    // TODO: Show error message
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {showExtractor && (
          <ContentExtractor
            url={url}
            onExtracted={handleExtracted}
            onError={handleError}
          />
        )}
        <Text style={styles.title}>Enter a URL to read</Text>
        <TextInput
          mode="outlined"
          label="Website URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleUrlSubmit}
          loading={loading}
          disabled={loading || !url}
          style={styles.button}
        >
          Unveil Page
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
});
