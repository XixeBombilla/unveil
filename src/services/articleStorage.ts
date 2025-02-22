import AsyncStorage from "@react-native-async-storage/async-storage";
import { Article } from "../types/content";

const STORAGE_KEY = "@saved_articles";

export const saveArticle = async (article: Article) => {
  try {
    const existingArticles = await AsyncStorage.getItem(STORAGE_KEY);
    const articles = existingArticles ? JSON.parse(existingArticles) : [];

    // Set the saved property to true
    article.saved = true;
    articles.push(article);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error("Error saving article:", error);
  }
};

export const getSavedArticles = async () => {
  try {
    const existingArticles = await AsyncStorage.getItem(STORAGE_KEY);
    return existingArticles ? JSON.parse(existingArticles) : [];
  } catch (error) {
    console.error("Error retrieving articles:", error);
    return [];
  }
};

export const clearSavedArticles = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing articles:", error);
  }
};

export const removeArticle = async (articleId: string) => {
  try {
    const existingArticles = await AsyncStorage.getItem(STORAGE_KEY);
    const articles = existingArticles ? JSON.parse(existingArticles) : [];

    const updatedArticles = articles.filter(
      (article: Article) => article.id !== articleId
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedArticles));
  } catch (error) {
    console.error("Error removing article:", error);
  }
};
