import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { ReaderScreen } from "../screens/ReaderScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import AccessibilitySettingsScreen from "../screens/AccessibilitySettingsScreen";
import { URLInputScreen } from "../screens/URLInputScreen";
import { usePreferences } from "../context/PreferencesContext";
import { getThemeColors } from "../utils/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { preferences } = usePreferences();
  const themeColors = getThemeColors(preferences);
  const commonOptions = {
    headerStyle: {
      backgroundColor: themeColors.background,
      borderBottomWidth: 1,
      borderBottomColor: themeColors.border,
    },
    headerTintColor: themeColors.text,
    headerTitleStyle: {
      color: themeColors.text,
    },
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarAccessibilityLabel: "Main navigation",
        tabBarActiveTintColor: themeColors.tint,
        tabBarStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Tab.Screen
        name="Unveil"
        component={URLInputScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons
              name="chrome-reader-mode"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={LibraryScreen}
        options={{
          ...commonOptions,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AccessibilitySettingsScreen}
        options={{
          ...commonOptions,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="accessibility-new" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppNavigator = () => {
  const { preferences } = usePreferences();
  const themeColors = getThemeColors(preferences);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: themeColors.background,
          },
          headerTintColor: themeColors.text,
          headerTitleStyle: {
            color: themeColors.text,
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AccessibilitySettings"
          component={AccessibilitySettingsScreen}
          options={{
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
