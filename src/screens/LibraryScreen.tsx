import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, SafeAreaView } from "react-native";
import { List, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../types/navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "../types/content";

export const LibraryScreen = () => {
  const [articles, setArticles] = useState<Article[]>([]);
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
      description={item.domain}
      onPress={() => navigation.navigate("Reader", { article: item })}
      left={(props) => <List.Icon {...props} icon="article" />}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {articles.length === 0 ? (
          <Text style={styles.emptyText}>No saved pages yet</Text>
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
    backgroundColor: "#fff",
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
