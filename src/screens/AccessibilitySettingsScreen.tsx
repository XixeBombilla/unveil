import React, { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";
import { List, Switch, Text, Divider } from "react-native-paper";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserPreferences, defaultPreferences } from "../types/preferences";
import { getThemeColors } from "../utils/theme";
import { usePreferences } from "../context/PreferencesContext";

export const AccessibilitySettingsScreen = () => {
  const { preferences, updatePreferences } = usePreferences();
  const themeColors = getThemeColors(preferences);

  const savePreferences = async (newPreferences: UserPreferences) => {
    await updatePreferences(newPreferences);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: themeColors.background }]}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: themeColors.background }]}
      >
        {/* Text Settings */}
        <List.Section>
          <List.Subheader
            style={[styles.subheader, { color: themeColors.text }]}
          >
            Text Settings
          </List.Subheader>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={{ color: themeColors.text }}>Font Size</Text>
              <Text style={{ color: themeColors.secondary }}>
                {Math.round(preferences.fontSize)}px
              </Text>
            </View>
            <Slider
              value={preferences.fontSize}
              onValueChange={(value) =>
                savePreferences({ ...preferences, fontSize: value })
              }
              minimumValue={12}
              maximumValue={32}
              minimumTrackTintColor={themeColors.tint}
              maximumTrackTintColor={themeColors.border}
            />
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={{ color: themeColors.text }}>Line Height</Text>
              <Text style={{ color: themeColors.secondary }}>
                {Math.round(preferences.lineHeight)}px
              </Text>
            </View>
            <Slider
              value={preferences.lineHeight}
              onValueChange={(value) =>
                savePreferences({ ...preferences, lineHeight: value })
              }
              minimumValue={1}
              maximumValue={2}
              step={0.1}
              minimumTrackTintColor={themeColors.tint}
              maximumTrackTintColor={themeColors.border}
            />
          </View>
          <View style={styles.sliderContainer}>
            <View style={styles.sliderHeader}>
              <Text style={{ color: themeColors.text }}>Letter Spacing</Text>
              <Text style={{ color: themeColors.secondary }}>
                {Math.round(preferences.letterSpacing)}px
              </Text>
            </View>
            <Slider
              value={preferences.letterSpacing}
              onValueChange={(value) =>
                savePreferences({ ...preferences, letterSpacing: value })
              }
              minimumValue={0}
              maximumValue={5}
              step={0.5}
              minimumTrackTintColor="#00796B"
              maximumTrackTintColor={themeColors.border}
            />
          </View>
        </List.Section>

        <Divider style={{ backgroundColor: themeColors.border }} />

        {/* Visual Settings */}
        <List.Section>
          <List.Subheader
            style={[styles.subheader, { color: themeColors.text }]}
          >
            Visual Settings
          </List.Subheader>
          <List.Item
            title="Dark Theme"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.theme === "dark"}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    theme: value ? "dark" : "light",
                  })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
          <List.Item
            title="Remove Images"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.removeImages}
                onValueChange={(value) =>
                  savePreferences({ ...preferences, removeImages: value })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
        </List.Section>

        <Divider style={{ backgroundColor: themeColors.border }} />

        {/* Content Settings */}
        {/* <List.Section>
          <List.Subheader style={{ color: themeColors.text }}>
            Content Settings
          </List.Subheader>
          <List.Item
            title="Simplify Text"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.simplifyText}
                onValueChange={(value) =>
                  savePreferences({ ...preferences, simplifyText: value })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
          <List.Item
            title="Reading Level"
            titleStyle={{ color: themeColors.text }}
            description={preferences.readingLevel}
            descriptionStyle={{ color: themeColors.secondary }}
            onPress={() => {
              // TODO: Add reading level picker dialog
            }}
          />
        </List.Section> */}

        {/* <Divider style={{ backgroundColor: themeColors.border }} /> */}

        {/* Speech Settings */}
        {/* <List.Section>
          <List.Subheader style={{ color: themeColors.text }}>
            Speech Settings
          </List.Subheader>
          <List.Item
            title="Enable Text-to-Speech"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.speech.enabled}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    speech: { ...preferences.speech, enabled: value },
                  })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
          <View style={styles.sliderContainer}>
            <Text style={{ color: themeColors.text }}>Speech Rate</Text>
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

        <Divider style={{ backgroundColor: themeColors.border }} /> */}

        {/* Focus Settings */}
        {/* <List.Section>
          <List.Subheader style={{ color: themeColors.text }}>
            Focus Assistance
          </List.Subheader>
          <List.Item
            title="Highlight Current Line"
            titleStyle={{ color: themeColors.text }}
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
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
          <List.Item
            title="Reading Guide"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.focus.readingGuide}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    focus: { ...preferences.focus, readingGuide: value },
                  })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
        </List.Section> */}

        {/* <Divider style={{ backgroundColor: themeColors.border }} /> */}

        {/* Motion Settings */}
        {/* <List.Section>
          <List.Subheader style={{ color: themeColors.text }}>
            Motion Settings
          </List.Subheader>
          <List.Item
            title="Reduce Motion"
            titleStyle={{ color: themeColors.text }}
            right={() => (
              <Switch
                value={preferences.motion.reduceMotion}
                onValueChange={(value) =>
                  savePreferences({
                    ...preferences,
                    motion: { ...preferences.motion, reduceMotion: value },
                  })
                }
                trackColor={{
                  false: themeColors.border,
                  true: themeColors.tint,
                }}
              />
            )}
          />
          <List.Item
            title="Auto-Scroll"
            titleStyle={{ color: themeColors.text }}
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
              <Text style={{ color: themeColors.text }}>Scroll Speed</Text>
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
        </List.Section> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    fontFamily: "AtkinsonHyperlegible-Regular",
  },
  sliderContainer: {
    padding: 16,
  },
  sliderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subheader: {
    fontWeight: "bold",
  },
});

export default AccessibilitySettingsScreen;
