import React, { useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { EXTRACTION_SCRIPT } from "../services/contentExtraction";

interface Props {
  url: string;
  onExtracted: (data: any) => void;
  onError: () => void;
}

export const ContentExtractor: React.FC<Props> = ({
  url,
  onExtracted,
  onError,
}) => {
  const webViewRef = useRef<WebView>(null);

  const onLoadEnd = () => {
    webViewRef.current?.injectJavaScript(EXTRACTION_SCRIPT);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    onExtracted(JSON.parse(event.nativeEvent.data));
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: url }}
      style={{ height: 0 }}
      onMessage={handleMessage}
      onError={onError}
      onLoadEnd={onLoadEnd}
      injectedJavaScript={EXTRACTION_SCRIPT}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
    />
  );
};
