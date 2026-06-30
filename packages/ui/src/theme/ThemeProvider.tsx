import { createContext, useContext, useEffect } from "react";
import type { ViewStyle } from "react-native";
import { Platform, View } from "react-native";
import type { ThemeProviderProps } from "./ThemeProvider.types.js";
import { darkTheme } from "./theme.js";
import type { Theme } from "./theme.types.js";

const ThemeContext = createContext<Theme>(darkTheme);

const styles = {
  root: {
    flex: 1,
  } satisfies ViewStyle,
};

const fullViewportStyle = {
  minHeight: Platform.OS === "web" ? "100vh" : "100%",
} as ViewStyle;

type WebDocument = {
  body: {
    style: {
      backgroundColor: string;
      margin: string;
    };
  };
  documentElement: {
    style: {
      backgroundColor: string;
    };
  };
};

function getWebDocument() {
  return (globalThis as { document?: WebDocument }).document;
}

function WebDocumentTheme({ backgroundColor }: { backgroundColor: string }) {
  useEffect(() => {
    const webDocument = getWebDocument();

    if (!webDocument) {
      return;
    }

    const previousBodyBackground = webDocument.body.style.backgroundColor;
    const previousBodyMargin = webDocument.body.style.margin;
    const previousHtmlBackground = webDocument.documentElement.style.backgroundColor;

    webDocument.body.style.backgroundColor = backgroundColor;
    webDocument.body.style.margin = "0";
    webDocument.documentElement.style.backgroundColor = backgroundColor;

    return () => {
      webDocument.body.style.backgroundColor = previousBodyBackground;
      webDocument.body.style.margin = previousBodyMargin;
      webDocument.documentElement.style.backgroundColor = previousHtmlBackground;
    };
  }, [backgroundColor]);

  return null;
}

export function ThemeProvider({
  children,
  style,
  testID = "theme-provider",
  theme = darkTheme,
}: ThemeProviderProps) {
  return (
    <ThemeContext.Provider value={theme}>
      <View
        testID={testID}
        style={[
          styles.root,
          fullViewportStyle,
          { backgroundColor: theme.colors.background },
          style,
        ]}
      >
        <WebDocumentTheme backgroundColor={theme.colors.background} />
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
