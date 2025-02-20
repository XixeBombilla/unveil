import React, { useState } from "react";
import { View, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useAccessibilityInfo } from "@react-native-community/hooks";
import { Text, IconButton } from "react-native-paper";
import { UserPreferences } from "../types/preferences";
import { ContentNode } from "../types/content";

interface AccessibleReaderProps {
  content: ContentNode[];
  preferences: UserPreferences;
}

interface ImageContentProps {
  node: ContentNode;
  preferences: UserPreferences;
}

const ImageContent: React.FC<ImageContentProps> = ({ node, preferences }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { screenReaderEnabled } = useAccessibilityInfo();

  if (preferences.removeImages) return null;

  if (screenReaderEnabled) {
    return node.accessibility.alt ? (
      <Text style={styles.screenReaderImageText}>
        {node.isBackground ? "Background Image: " : "Image: "}
        {node.accessibility.alt}
      </Text>
    ) : null;
  }

  return (
    <View key={node.id} style={styles.imageContainer}>
      <View
        style={[
          styles.imageWrapper,
          node.isBackground && styles.backgroundImage,
        ]}
      >
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {hasError ? (
          <View style={styles.errorContainer}>
            <IconButton icon="alert" size={24} />
            <Text style={styles.errorText}>Failed to load image</Text>
          </View>
        ) : (
          <Image
            source={{ uri: node.imageUrl }}
            style={[
              styles.image,
              node.isBackground && styles.backgroundImageStyle,
            ]}
            accessibilityLabel={node.accessibility.label}
            accessible={true}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </View>
      {node.accessibility.alt && !node.isBackground && (
        <Text style={styles.imageCaption}>{node.accessibility.alt}</Text>
      )}
    </View>
  );
};

export const AccessibleReader: React.FC<AccessibleReaderProps> = ({
  content,
  preferences,
}) => {
  const { screenReaderEnabled } = useAccessibilityInfo();

  const renderContent = (node: ContentNode) => {
    // Skip image nodes - they'll be shown in ImageGallery
    if (node.type === "image") return null;

    switch (node.type) {
      case "heading":
        return (
          <Text
            key={node.id}
            style={[styles.heading, getTextStyles(preferences)]}
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
            style={[styles.paragraph, getTextStyles(preferences)]}
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
          backgroundColor: preferences.useCustomColors.enabled
            ? preferences.useCustomColors.backgroundColor
            : "#FFFFFF",
        },
      ]}
      accessibilityRole="text"
    >
      {content.map(renderContent)}
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
