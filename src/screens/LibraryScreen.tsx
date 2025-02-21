import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { List, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "../types/content";
import { UserPreferences, defaultPreferences } from "../types/preferences";
import { getThemeColors } from "../utils/theme";
import { usePreferences } from "../context/PreferencesContext";

export const LibraryScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { preferences } = usePreferences();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const savedArticles = await AsyncStorage.getItem("saved_articles");
      if (savedArticles) {
        setArticles(JSON.parse(savedArticles));
      }
    } catch (error) {
      console.error("Failed to load articles:", error);
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <List.Item
      title={item.title}
      titleStyle={{ color: themeColors.text }}
      description={item.domain}
      descriptionStyle={{ color: themeColors.secondary }}
      onPress={() => navigation.navigate("Reader", { article: item })}
      left={(props) => (
        <List.Icon {...props} icon="article" color={themeColors.text} />
      )}
    />
  );

  const themeColors = getThemeColors(preferences);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <View
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        {articles.length === 0 ? (
          <Text style={[styles.emptyText, { color: themeColors.secondary }]}>
            No saved pages yet
          </Text>
        ) : (
          <FlatList
            data={articles}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
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
    marginTop: 20,
    opacity: 0.5,
  },
});
