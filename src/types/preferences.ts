export interface UserPreferences {
  // Text Settings
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  letterSpacing: number;

  // Visual Settings
  useCustomColors: {
    enabled: boolean;
    backgroundColor: string;
    textColor: string;
  };
  theme: "light" | "dark" | "high-contrast";
  removeImages: boolean;

  // Content Settings
  simplifyText: boolean;
  readingLevel: "simple" | "medium" | "complex";

  // Speech Settings
  speech: {
    enabled: boolean;
    rate: number;
    pitch: number;
    autoplay: boolean;
  };

  // Focus Assistance
  focus: {
    highlightCurrentLine: boolean;
    readingGuide: boolean;
    paragraphSpacing: number;
  };

  // Motion Settings
  motion: {
    reduceMotion: boolean;
    autoScroll: {
      enabled: boolean;
      speed: number;
    };
  };
}

export const defaultPreferences: UserPreferences = {
  fontSize: 16,
  fontFamily: "System",
  lineHeight: 1.5,
  letterSpacing: 0,
  useCustomColors: {
    enabled: false,
    backgroundColor: "#FFFFFF",
    textColor: "#000000",
  },
  theme: "light",
  removeImages: false,
  simplifyText: false,
  readingLevel: "medium",
  speech: {
    enabled: false,
    rate: 1,
    pitch: 1,
    autoplay: false,
  },
  focus: {
    highlightCurrentLine: false,
    readingGuide: false,
    paragraphSpacing: 1.5,
  },
  motion: {
    reduceMotion: false,
    autoScroll: {
      enabled: false,
      speed: 1,
    },
  },
};
