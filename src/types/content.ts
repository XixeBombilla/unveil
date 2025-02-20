import { UserPreferences } from "./preferences";

export interface ContentNode {
  id: string;
  type: "heading" | "paragraph";
  content: string;
  accessibility: {
    label: string;
  };
}

export interface ExtractedLink {
  id: string;
  url: string;
  title: string;
}

export interface Article {
  id: string;
  url: string;
  domain: string;
  title: string;
  content: ContentNode[];
  metadata: {
    author?: string;
    publishDate?: string;
    readingTime?: number;
  };
  accessibility: {
    hasImages: boolean;
    complexityScore: number;
    readingLevel: "simple" | "medium" | "complex";
  };
  userPreferences?: UserPreferences;
  savedAt: string;
  relatedLinks: ExtractedLink[];
}
