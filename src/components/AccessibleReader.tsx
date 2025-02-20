import React from "react";
import { View, StyleSheet } from "react-native";
import { useAccessibilityInfo } from "@react-native-community/hooks";
import { Text } from "react-native-paper";
import { UserPreferences } from "../types/preferences";
import { ContentNode } from "../types/content";

interface AccessibleReaderProps {
  content: ContentNode[];
  preferences: UserPreferences;
}

export const AccessibleReader: React.FC<AccessibleReaderProps> = ({
  content,
  preferences,
}) => {
  const { screenReaderEnabled } = useAccessibilityInfo();

  const renderNode = (node: ContentNode) => {
    switch (node.type) {
      case "heading":
        return (
          <Text
            key={node.id}
            style={[styles.heading, getTextStyles(preferences)]}
            accessibilityRole="header"
            accessibilityLabel={node.accessibility.label}
          >
            {node.content}
          </Text>
        );
      case "paragraph":
        return (
          <Text
            key={node.id}
            style={[styles.paragraph, getTextStyles(preferences)]}
            accessibilityLabel={node.accessibility.label}
          >
            {node.content}
          </Text>
        );
      // Add other content types...
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: preferences.useCustomColors.enabled
            ? preferences.useCustomColors.backgroundColor
            : "#FFFFFF",
        },
      ]}
      accessibilityRole="text"
    >
      {content.map(renderNode)}
    </View>
  );
};

const getTextStyles = (preferences: UserPreferences) => ({
  fontSize: preferences.fontSize,
  fontFamily: preferences.fontFamily,
  lineHeight: preferences.lineHeight * preferences.fontSize,
  letterSpacing: preferences.letterSpacing,
  color: preferences.useCustomColors.enabled
    ? preferences.useCustomColors.textColor
    : "#000000",
});

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
});
