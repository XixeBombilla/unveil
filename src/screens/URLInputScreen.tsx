import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createArticle } from "../services/contentExtraction";
import { ContentExtractor } from "../components/ContentExtractor";
import { usePreferences } from "../context/PreferencesContext";
import { getThemeColors } from "../utils/theme";

export const URLInputScreen = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const themeColors = getThemeColors(preferences);

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
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        {showExtractor && (
          <ContentExtractor
            url={url}
            onExtracted={handleExtracted}
            onError={handleError}
          />
        )}
        <Text style={[styles.title, { color: themeColors.text }]}>Unveil</Text>
        <TextInput
          mode="outlined"
          label="Website URL"
          value={url}
          onChangeText={setUrl}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          textColor={themeColors.text}
          style={[
            styles.input,
            {
              borderColor: themeColors.border,
              backgroundColor: themeColors.inputBackground,
            },
          ]}
          placeholder="Enter the URL here"
          placeholderTextColor={themeColors.secondary}
          theme={{
            colors: {
              primary: themeColors.text,
            },
          }}
        />
        <Button
          mode="contained"
          onPress={handleUrlSubmit}
          loading={loading}
          disabled={loading || !url}
          style={[styles.button, { backgroundColor: themeColors.text }]}
          labelStyle={{ color: themeColors.background }}
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
  },
  container: {
    flex: 1,
    padding: 16,
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  input: {
    marginBottom: 16,
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  button: {
    marginTop: 8,
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
});
