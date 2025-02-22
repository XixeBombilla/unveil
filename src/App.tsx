import React from "react";
import { PreferencesProvider } from "./context/PreferencesContext";
import AppNavigator from "./navigation/AppNavigator";

const App = () => {
  return (
    <>
      <PreferencesProvider>
        <AppNavigator />
      </PreferencesProvider>
    </>
  );
};

export default App;
