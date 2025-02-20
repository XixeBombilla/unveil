import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../types/preferences";

interface AccessibilityContextType {
  preferences: UserPreferences;
  updatePreferences: (newPreferences: UserPreferences) => Promise<void>;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const saved = await AsyncStorage.getItem("user_preferences");
      if (saved) {
        setPreferences(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
    }
  };

  const updatePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem(
        "user_preferences",
        JSON.stringify(newPreferences)
      );
      setPreferences(newPreferences);
    } catch (error) {
      console.error("Failed to save preferences:", error);
    }
  };

  return (
    <AccessibilityContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility must be used within an AccessibilityProvider"
    );
  }
  return context;
};
