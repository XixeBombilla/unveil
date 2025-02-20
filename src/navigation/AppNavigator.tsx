import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";

import { ReaderScreen } from "../screens/ReaderScreen";
import { LibraryScreen } from "../screens/LibraryScreen";
import { AccessibilitySettingsScreen } from "../screens/AccessibilitySettingsScreen";
import { URLInputScreen } from "../screens/URLInputScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarAccessibilityLabel: "Main navigation",
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tab.Screen
        name="Unveil"
        component={URLInputScreen}
        options={{
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
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="library-books" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AccessibilitySettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="accessibility-new" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Reader"
          component={ReaderScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
