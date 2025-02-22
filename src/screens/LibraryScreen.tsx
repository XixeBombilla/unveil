import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { List, Text, Button } from "react-native-paper";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import { getThemeColors } from "../utils/theme";
import { usePreferences } from "../context/PreferencesContext";
import {
  getSavedArticles,
  clearSavedArticles,
  removeArticle,
} from "../services/articleStorage";
import { Article } from "../types/content";
import { MaterialIcons } from "@expo/vector-icons";

export const LibraryScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { preferences } = usePreferences();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const themeColors = getThemeColors(preferences);

  useFocusEffect(
    React.useCallback(() => {
      const loadArticles = async () => {
        const savedArticles = await getSavedArticles();
        setArticles(savedArticles);
      };

      loadArticles();
    }, [])
  );

  const handleClearArticles = async () => {
    await clearSavedArticles();
    setArticles([]);
  };

  const handleDeleteArticle = async (articleId: string) => {
    await removeArticle(articleId);
    setArticles((prevArticles) =>
      prevArticles.filter((article) => article.id !== articleId)
    );
  };

  const renderItem = ({ item }: { item: Article }) => (
    <List.Item
      title={item.title}
      titleStyle={{ color: themeColors.text }}
      description={item.domain}
      descriptionStyle={{ color: themeColors.secondary }}
      onPress={() => navigation.navigate("Reader", { article: item })}
      right={() => (
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="delete"
            size={24}
            color={themeColors.text}
            onPress={() => handleDeleteArticle(item.id)}
          />
        </View>
      )}
    />
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={themeColors.background}
      />
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        {articles.length === 0 ? (
          <Text style={[styles.emptyText, { color: themeColors.secondary }]}>
            No saved pages yet
          </Text>
        ) : (
          <>
            <FlatList
              data={articles}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
            <Button
              mode="contained"
              icon="delete"
              onPress={handleClearArticles}
              style={[
                styles.clearButton,
                { backgroundColor: themeColors.text },
              ]}
              labelStyle={{ color: themeColors.background, fontWeight: "bold" }}
            >
              Clear All Articles
            </Button>
          </>
        )}
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
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    opacity: 0.5,
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  clearButton: {
    margin: 16,
  },
});
