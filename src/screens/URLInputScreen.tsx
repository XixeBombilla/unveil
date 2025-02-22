import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, Image, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { createArticle } from "../services/contentExtraction";
import { ContentExtractor } from "../components/ContentExtractor";
import { usePreferences } from "../context/PreferencesContext";
import { getThemeColors } from "../utils/theme";
// Import the logo image
import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
// utils
import { isValidURL } from "../utils/isValidURL";

export const URLInputScreen = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExtractor, setShowExtractor] = useState(false);
  const navigation = useNavigation();
  const { preferences } = usePreferences();
  const themeColors = getThemeColors(preferences);

  const handleUrlSubmit = () => {
    if (!url) {
      Alert.alert("Error", "Please enter a URL.");
      return;
    }

    if (!isValidURL(url)) {
      Alert.alert("Invalid URL", "Please enter a valid URL.");
      return;
    }

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
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: themeColors.safeAreaBackground },
      ]}
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
        {!loading && (
          <>
            <Image
              source={preferences.theme == "dark" ? logoDark : logoLight}
              style={styles.logo}
              resizeMode="contain"
            />
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
              multiline={false}
              numberOfLines={1}
            />
          </>
        )}
        <Button
          mode="contained"
          onPress={handleUrlSubmit}
          loading={loading}
          disabled={loading || !url}
          style={[styles.button, { backgroundColor: themeColors.text }]}
          labelStyle={{ color: themeColors.background, fontWeight: "bold" }}
        >
          {loading ? "Simplifying..." : "Simplify Page"}
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
    padding: 30,
    flexDirection: "column",
    justifyContent: "center",
    margin: 20,
    borderRadius: 10,
  },
  logo: {
    width: 200, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    alignSelf: "center", // Center the logo
    marginBottom: 20, // Space below the logo
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
