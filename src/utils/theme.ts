import { UserPreferences } from "../types/preferences";

export const getThemeColors = (preferences: UserPreferences) => ({
  background: preferences.theme === "dark" ? "#121212" : "#FFFFFF",
  text: preferences.theme === "dark" ? "#FFFFFF" : "#000000",
  surface: preferences.theme === "dark" ? "#1E1E1E" : "#F5F5F5",
  border: preferences.theme === "dark" ? "#333333" : "#EEEEEE",
  secondary: preferences.theme === "dark" ? "#999999" : "#666666",
  primary: preferences.theme === "dark" ? "#FFFFFF" : "#000000",
  inputBackground: preferences.theme === "dark" ? "#1E1E1E" : "#FFFFFF",
  inputText: preferences.theme === "dark" ? "#FFFFFF" : "#000000",
});
