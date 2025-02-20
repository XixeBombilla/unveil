import { UserPreferences } from "./preferences";

export interface ContentNode {
  id: string;
  type: "heading" | "paragraph" | "image";
  content: string;
  accessibility: {
    label: string;
    alt?: string;
  };
  imageUrl?: string;
  isBackground?: boolean;
  cssProperties?: {
    backgroundSize: string;
    backgroundPosition: string;
    backgroundRepeat: string;
  };
  dimensions?: {
    width: number;
    height: number;
  };
}

export interface ExtractedLink {
  id: string;
  url: string;
  title: string;
}

export interface ExtractedImage {
  id: string;
  url: string;
  alt: string;
  title: string;
  type: "regular" | "background";
  dimensions?: {
    width: number;
    height: number;
  };
  location: {
    inContent: boolean;
    isHeader: boolean;
    isFooter: boolean;
  };
  cssProperties?: {
    backgroundSize: string;
    backgroundPosition: string;
    backgroundRepeat: string;
  };
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
  images: ExtractedImage[];
}
