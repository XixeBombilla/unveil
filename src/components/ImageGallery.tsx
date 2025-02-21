import React from "react";
import { View, StyleSheet, ScrollView, Image, Pressable } from "react-native";
import { Text, IconButton } from "react-native-paper";
import { ExtractedImage } from "../types/content";
import { UserPreferences } from "../types/preferences";
import { getThemeColors } from "../utils/theme";

interface ImageGalleryProps {
  images: ExtractedImage[];
  preferences: UserPreferences;
  onImagePress?: (image: ExtractedImage) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  preferences,
  onImagePress,
}) => {
  if (preferences.removeImages || !images.length) return null;

  const themeColors = getThemeColors(preferences);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { fontSize: preferences.fontSize + 6, color: themeColors.text },
          ]}
        >
          Images ({images.length})
        </Text>
        <IconButton icon="grid" size={24} iconColor={themeColors.text} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image) => (
          <Pressable
            key={image.id}
            style={styles.imageContainer}
            onPress={() => onImagePress?.(image)}
          >
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              accessibilityLabel={image.alt}
            />
            <View style={styles.imageInfo}>
              {image.type === "background" && (
                <IconButton
                  icon="image-area"
                  size={16}
                  style={styles.typeIcon}
                />
              )}
              {image.title && (
                <Text
                  numberOfLines={2}
                  style={[
                    styles.imageTitle,
                    { fontSize: preferences.fontSize - 2 },
                  ]}
                >
                  {image.title}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  imageContainer: {
    width: 200,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  imageInfo: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  typeIcon: {
    margin: 0,
    marginRight: 4,
  },
  imageTitle: {
    flex: 1,
    fontSize: 14,
  },
});
