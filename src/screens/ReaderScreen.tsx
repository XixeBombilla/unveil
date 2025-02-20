import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { AccessibleReader } from "../components/AccessibleReader";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { Article } from "../types/content";
import { defaultPreferences } from "../types/preferences";
import {
  IconButton,
  List,
  Text,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { ContentExtractor } from "../components/ContentExtractor";

export const ReaderScreen = () => {
  const route = useRoute();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { article } = route.params as { article: Article };
  const [loading, setLoading] = useState(false);
  const [extractorUrl, setExtractorUrl] = useState<string | null>(null);

  const handleLinkPress = (url: string) => {
    setLoading(true);
    setExtractorUrl(url);
  };

  const handleExtracted = (data: any) => {
    setLoading(false);
    setExtractorUrl(null);
    navigation.push("Reader", {
      article: {
        ...article,
        title: data.title,
        content: data.content,
        relatedLinks: data.links || [],
        url: extractorUrl!,
        domain: new URL(extractorUrl!).hostname,
        accessibility: {
          ...article.accessibility,
          hasImages: data.hasImages,
        },
      },
    });
  };

  const handleError = () => {
    setLoading(false);
    setExtractorUrl(null);
    // TODO: Show error message
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {extractorUrl && (
        <ContentExtractor
          url={extractorUrl}
          onExtracted={handleExtracted}
          onError={handleError}
        />
      )}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        />
      </View>
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
  },
  scrollView: {
    flex: 1,
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
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
  },
});
