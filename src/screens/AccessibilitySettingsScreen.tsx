import React, { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { List, Switch, Text, Divider } from "react-native-paper";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../types/preferences";

export const AccessibilitySettingsScreen = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    ...defaultPreferences,
  });

  const savePreferences = async (newPreferences: UserPreferences) => {
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Text Settings */}
        <List.Section>
          <List.Subheader>Text Settings</List.Subheader>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Font Size</Text>
              <Text>{Math.round(preferences.fontSize)}px</Text>
            </View>
            <Slider
              value={preferences.fontSize}
              onValueChange={(value) =>
                savePreferences({ ...preferences, fontSize: value })
              }
              minimumValue={12}
              maximumValue={32}
            />
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Line Height</Text>
              <Text>{Math.round(preferences.lineHeight)}px</Text>
            </View>
            <Slider
              value={preferences.lineHeight}
              onValueChange={(value) =>
                savePreferences({ ...preferences, lineHeight: value })
              }
              minimumValue={1}
              maximumValue={2}
              step={0.1}
            />
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text>Letter Spacing</Text>
              <Text>{Math.round(preferences.letterSpacing)}px</Text>
            </View>
            <Slider
              value={preferences.letterSpacing}
              onValueChange={(value) =>
                savePreferences({ ...preferences, letterSpacing: value })
              }
              minimumValue={0}
              maximumValue={5}
              step={0.5}
            />
          </View>
        </List.Section>

        <Divider />

        {/* Visual Settings */}
        <List.Section>
          <List.Subheader>Visual Settings</List.Subheader>
          <List.Item
            title="Theme"
            description={preferences.theme}
            onPress={() => {
              // TODO: Add theme picker dialog
            }}
          />
          <List.Item
            title="Remove Images"
            right={() => (
              <Switch
                value={preferences.removeImages}
                onValueChange={(value) =>
                  savePreferences({ ...preferences, removeImages: value })
                }
              />
            )}
          />
          <List.Item
            title="Use Custom Colors"
            right={() => (
              <Switch
                value={preferences.useCustomColors.enabled}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    useCustomColors: {
                      ...preferences.useCustomColors,
                      enabled: value,
                    },
                  })
                }
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Content Settings */}
        <List.Section>
          <List.Subheader>Content Settings</List.Subheader>
          <List.Item
            title="Simplify Text"
            right={() => (
              <Switch
                value={preferences.simplifyText}
                onValueChange={(value) =>
                  savePreferences({ ...preferences, simplifyText: value })
                }
              />
            )}
          />
          <List.Item
            title="Reading Level"
            description={preferences.readingLevel}
            onPress={() => {
              // TODO: Add reading level picker dialog
            }}
          />
        </List.Section>

        <Divider />

        {/* Speech Settings */}
        <List.Section>
          <List.Subheader>Speech Settings</List.Subheader>
          <List.Item
            title="Enable Text-to-Speech"
            right={() => (
              <Switch
                value={preferences.speech.enabled}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    speech: { ...preferences.speech, enabled: value },
                  })
                }
              />
            )}
          />
          <View style={styles.sliderContainer}>
            <Text>Speech Rate</Text>
            <Slider
              value={preferences.speech.rate}
              onValueChange={(value) =>
                savePreferences({
                  ...preferences,
                  speech: { ...preferences.speech, rate: value },
                })
              }
              minimumValue={0.5}
              maximumValue={2}
              step={0.1}
            />
          </View>
        </List.Section>

        <Divider />

        {/* Focus Settings */}
        <List.Section>
          <List.Subheader>Focus Assistance</List.Subheader>
          <List.Item
            title="Highlight Current Line"
            right={() => (
              <Switch
                value={preferences.focus.highlightCurrentLine}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    focus: {
                      ...preferences.focus,
                      highlightCurrentLine: value,
                    },
                  })
                }
              />
            )}
          />
          <List.Item
            title="Reading Guide"
            right={() => (
              <Switch
                value={preferences.focus.readingGuide}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    focus: { ...preferences.focus, readingGuide: value },
                  })
                }
              />
            )}
          />
        </List.Section>

        <Divider />

        {/* Motion Settings */}
        <List.Section>
          <List.Subheader>Motion Settings</List.Subheader>
          <List.Item
            title="Reduce Motion"
            right={() => (
              <Switch
                value={preferences.motion.reduceMotion}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    motion: { ...preferences.motion, reduceMotion: value },
                  })
                }
              />
            )}
          />
          <List.Item
            title="Auto-Scroll"
            right={() => (
              <Switch
                value={preferences.motion.autoScroll.enabled}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    motion: {
                      ...preferences.motion,
                      autoScroll: {
                        ...preferences.motion.autoScroll,
                        enabled: value,
                      },
                    },
                  })
                }
              />
            )}
          />
          {preferences.motion.autoScroll.enabled && (
            <View style={styles.sliderContainer}>
              <Text>Scroll Speed</Text>
              <Slider
                value={preferences.motion.autoScroll.speed}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    motion: {
                      ...preferences.motion,
                      autoScroll: {
                        ...preferences.motion.autoScroll,
                        speed: value,
                      },
                    },
                  })
                }
                minimumValue={0.5}
                maximumValue={2}
                step={0.1}
              />
            </View>
          )}
        </List.Section>
      </ScrollView>
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
  sliderContainer: {
    padding: 16,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
