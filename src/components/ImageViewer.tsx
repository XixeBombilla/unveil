import React from "react";
import {
  Modal,
  StyleSheet,
  View,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { IconButton, Text } from "react-native-paper";
import { ExtractedImage } from "../types/content";

interface ImageViewerProps {
  image: ExtractedImage | null;
  visible: boolean;
  onClose: () => void;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  image,
  visible,
  onClose,
}) => {
  if (!image) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.header}>
          <IconButton
            icon="close"
            iconColor="white"
            size={24}
            onPress={onClose}
          />
        </View>
        <Image
          source={{ uri: image.url }}
          style={styles.image}
          resizeMode="contain"
        />
        {image.alt && (
          <View style={styles.footer}>
            <Text style={styles.caption}>{image.alt}</Text>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    padding: 16,
  },
  image: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  caption: {
    color: "white",
    textAlign: "center",
  },
});
