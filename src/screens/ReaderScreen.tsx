import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { AccessibleReader } from "../components/AccessibleReader";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Article, ExtractedImage } from "../types/content";
import { usePreferences } from "../context/PreferencesContext";
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
import { getThemeColors } from "../utils/theme";
// icons
import {
  saveArticle,
  getSavedArticles,
  removeArticle,
} from "../services/articleStorage";
import * as Speech from "expo-speech";

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
  const [isSaved, setIsSaved] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const { preferences } = usePreferences();
  const themeColors = getThemeColors(preferences);

  const checkIfSaved = async () => {
    const savedArticles = await getSavedArticles();
    return savedArticles.some(
      (savedArticle: Article) => savedArticle.id === article.id
    );
  };

  useEffect(() => {
    const loadSavedStatus = async () => {
      const alreadySaved = await checkIfSaved();
      setIsSaved(alreadySaved);
    };

    loadSavedStatus();
  }, [article.id]);

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

  const handleSaveArticle = async () => {
    if (isSaved) {
      // If already saved, remove the article
      await removeArticle(article.id);
      setIsSaved(false);
    } else {
      // If not saved, save the article
      await saveArticle(article);
      setIsSaved(true);
    }
  };

  const handleReadAloud = () => {
    const readableText = article.content
      .map((item) => {
        if (item.type === "heading") {
          return `${item.content}\n`;
        } else if (item.type === "paragraph") {
          return `${item.content}\n\n`;
        }
        return "";
      })
      .join("");

    if (isSpeaking) {
      Speech.stop();
    } else {
      Speech.speak(readableText, {
        rate: preferences.speech.rate || 1, // Use the updated speech rate from preferences
      });
    }
    setIsSpeaking(!isSpeaking);
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setExtractorUrl(null);
      Speech.stop();
    };
  }, []);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      {extractorUrl && (
        <ContentExtractor
          url={extractorUrl}
          onExtracted={handleExtracted}
          onError={handleError}
        />
      )}
      {!loading && (
        <>
          <View
            style={[
              styles.header,
              {
                backgroundColor: themeColors.background,
                borderBottomColor: themeColors.border,
              },
            ]}
          >
            <IconButton
              icon="arrow-left"
              size={24}
              iconColor={themeColors.text}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <View style={styles.headerContent}>
              <Text
                style={[styles.headerTitle, { color: themeColors.text }]}
                numberOfLines={1}
              >
                {article.title}
              </Text>
              <Text
                style={[styles.headerUrl, { color: themeColors.secondary }]}
                numberOfLines={1}
              >
                {article.domain}
              </Text>
            </View>
            <IconButton
              icon="magnify"
              size={24}
              iconColor={themeColors.text}
              onPress={() => navigation.popToTop()}
              style={styles.menuButton}
            />
          </View>
          <View
            style={[
              styles.fixedMenu,
              {
                backgroundColor: themeColors.surface,
                borderBottomColor: themeColors.border,
              },
            ]}
          >
            <IconButton
              icon={isSaved ? "bookmark" : "bookmark-outline"}
              size={24}
              iconColor={themeColors.text}
              onPress={handleSaveArticle}
            />
            <IconButton
              icon={isSpeaking ? "pause" : "play"}
              size={24}
              iconColor={themeColors.text}
              onPress={handleReadAloud}
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
            <ActivityIndicator size="large" color={themeColors.text} />
            <Text style={[styles.loadingText, { color: themeColors.text }]}>
              Loading content...
            </Text>
          </View>
        ) : (
          <>
            <AccessibleReader
              content={article.content}
              preferences={preferences}
              themeColors={themeColors}
            />

            {!preferences.removeImages && (
              <ImageGallery
                images={article.images}
                preferences={preferences}
                onImagePress={handleImagePress}
              />
            )}

            {article.relatedLinks.length > 0 && (
              <View style={styles.linksSection}>
                <Divider style={styles.divider} />
                <Text
                  style={[
                    styles.linksSectionTitle,
                    {
                      fontSize: preferences.fontSize + 4,
                      color: themeColors.text,
                    },
                  ]}
                >
                  Related Links
                </Text>
                {article.relatedLinks.map((link) => (
                  <List.Item
                    key={link.id}
                    title={link.title}
                    description={link.url}
                    titleStyle={{
                      fontSize: preferences.fontSize,
                      color: themeColors.text,
                      fontFamily: "AtkinsonHyperlegible-Regular",
                    }}
                    descriptionStyle={{
                      fontSize: preferences.fontSize - 2,
                      color: themeColors.secondary,
                      fontFamily: "AtkinsonHyperlegible-Regular",
                    }}
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
  },
  header: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  scrollView: {
    flex: 1,
    margin: 20,
    borderRadius: 10,
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
    fontFamily: "AtkinsonHyperlegible-Regular",
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
    fontFamily: "AtkinsonHyperlegible-Regular",
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
