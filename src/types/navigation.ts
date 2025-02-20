import { Article } from "./content";

export type RootStackParamList = {
  Library: undefined;
  Reader: { article: Article };
  URLInput: undefined;
  AccessibilitySettings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
