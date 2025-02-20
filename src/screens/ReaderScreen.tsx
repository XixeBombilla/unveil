import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { AccessibleReader } from "../components/AccessibleReader";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Article, ExtractedImage } from "../types/content";
import { defaultPreferences } from "../types/preferences";
import {
  IconButton,
  List,
  Text,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { ContentExtractor } from "../components/ContentExtractor";
import { ImageGallery } from "../components/ImageGallery";
import { ImageViewer } from "../components/ImageViewer";

export const ReaderScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { article } = route.params as { article: Article };
  const [loading, setLoading] = useState(false);
  const [extractorUrl, setExtractorUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ExtractedImage | null>(
    null
  );

  const handleLinkPress = (url: string) => {
    setLoading(true);
    setExtractorUrl(url);
  };

  const handleExtracted = (data: any) => {
    setLoading(false);
    setExtractorUrl(null);

    if (!data || !extractorUrl) {
      console.error("Invalid extraction data or URL");
      return;
    }

    const newArticle = {
      ...article,
      title: data.title || "Untitled",
      content: data.content || [],
      relatedLinks: data.links || [],
      images: data.images || [],
      url: extractorUrl,
      domain: new URL(extractorUrl).hostname,
      accessibility: {
        ...article.accessibility,
        hasImages: Boolean(data.hasImages),
      },
    };

    navigation.push("Reader", { article: newArticle });
  };

  const handleError = () => {
    setLoading(false);
    setExtractorUrl(null);
    console.error("Content extraction failed");
  };

  const handleImagePress = (image: ExtractedImage) => {
    setSelectedImage(image);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setExtractorUrl(null);
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {extractorUrl && (
        <ContentExtractor
          url={extractorUrl}
          onExtracted={handleExtracted}
          onError={handleError}
        />
      )}
      {!loading && (
        <>
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {article.title}
              </Text>
              <Text style={styles.headerUrl} numberOfLines={1}>
                {article.domain}
              </Text>
            </View>
            <IconButton
              icon="home"
              size={24}
              onPress={() => navigation.popToTop()}
              style={styles.menuButton}
            />
          </View>
          <View style={styles.fixedMenu}>
            <IconButton
              icon="magnify"
              size={24}
              onPress={() => navigation.popToTop()}
              style={styles.menuButton}
            />
          </View>
        </>
      )}
      <ScrollView
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={true}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Loading content...</Text>
          </View>
        ) : (
          <>
            <AccessibleReader
              content={article.content}
              preferences={article.userPreferences || defaultPreferences}
            />

            <ImageGallery
              images={article.images}
              preferences={article.userPreferences || defaultPreferences}
              onImagePress={handleImagePress}
            />

            {article.relatedLinks.length > 0 && (
              <View style={styles.linksSection}>
                <Divider style={styles.divider} />
                <Text style={styles.linksSectionTitle}>Related Links</Text>
                {article.relatedLinks.map((link) => (
                  <List.Item
                    key={link.id}
                    title={link.title}
                    description={link.url}
                    onPress={() => handleLinkPress(link.url)}
                    left={(props) => <List.Icon {...props} icon="link" />}
                  />
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
      <ImageViewer
        image={selectedImage}
        visible={selectedImage !== null}
        onClose={handleCloseViewer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  backButton: {
    margin: -8,
  },
  linksSection: {
    padding: 16,
  },
  linksSectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  headerContent: {
    flex: 1,
    marginLeft: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  headerUrl: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  menuButton: {
    margin: -8,
    marginRight: 10,
  },
  fixedMenu: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
