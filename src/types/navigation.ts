import { Article } from "./content";

export type RootStackParamList = {
  Library: undefined;
  Reader: { article: Article };
  Unveil: undefined;
  AccessibilitySettings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
