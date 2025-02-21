import React from "react";
import { View, StyleSheet } from "react-native";
import { useAccessibilityInfo } from "@react-native-community/hooks";
import { Text } from "react-native-paper";
import { UserPreferences } from "../types/preferences";
import { ContentNode } from "../types/content";
import { getThemeColors } from "../utils/theme";
import { ThemeColors } from "../types/theme";

interface AccessibleReaderProps {
  content: ContentNode[];
  preferences: UserPreferences;
  themeColors: ThemeColors;
}

export const AccessibleReader: React.FC<AccessibleReaderProps> = ({
  content,
  preferences,
  themeColors,
}) => {
  const { screenReaderEnabled } = useAccessibilityInfo();

  const getTextStyles = (preferences: UserPreferences) => ({
    fontSize: preferences.fontSize,
    fontFamily: preferences.fontFamily,
    lineHeight: preferences.lineHeight * preferences.fontSize,
    letterSpacing: preferences.letterSpacing,
    color: themeColors.text,
  });

  const renderContent = (node: ContentNode) => {
    if (node.type === "image") return null;

    const themeColors = getThemeColors(preferences);
    const textStyle = {
      ...getTextStyles(preferences),
      color: themeColors.text,
    };

    switch (node.type) {
      case "heading":
        return (
          <Text
            key={node.id}
            style={[styles.heading, textStyle]}
            accessibilityLabel={node.accessibility.label}
            accessibilityRole={screenReaderEnabled ? "header" : undefined}
            accessible={screenReaderEnabled}
          >
            {node.content}
          </Text>
        );
      default:
        return (
          <Text
            key={node.id}
            style={[styles.paragraph, textStyle]}
            accessibilityLabel={node.accessibility.label}
          >
            {node.content}
          </Text>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: themeColors.background,
        },
      ]}
      accessibilityRole="text"
    >
      {content.map(renderContent)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  paragraph: {
    marginBottom: 12,
  },
  imageContainer: {
    marginVertical: 16,
  },
  imageWrapper: {
    width: "100%",
    height: 200,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#666",
    marginTop: 8,
  },
  imageCaption: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginTop: 8,
    textAlign: "center",
  },
  screenReaderImageText: {
    padding: 8,
    fontStyle: "italic",
  },
  backgroundImage: {
    position: "relative",
    backgroundColor: "transparent",
  },
  backgroundImageStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.15, // Make background images subtle
  },
});
