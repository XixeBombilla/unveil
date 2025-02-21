import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigator from "./src/navigation/AppNavigator";
import { AccessibilityProvider } from "./src/contexts/AccessibilityContext";
import { PreferencesProvider } from "./src/context/PreferencesContext";

export default function App() {
  return (
    <PaperProvider>
      <PreferencesProvider>
        <AccessibilityProvider>
          <AppNavigator />
        </AccessibilityProvider>
      </PreferencesProvider>
    </PaperProvider>
  );
}
