import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { AccessibilityProvider } from "./src/contexts/AccessibilityContext";

export default function App() {
  return (
    <PaperProvider>
      <AccessibilityProvider>
        <AppNavigator />
      </AccessibilityProvider>
    </PaperProvider>
  );
}
