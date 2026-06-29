import { createContext, type ReactNode, useContext, useEffect } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";

export const colors = {
  background: "#090613",
  surface: "#151022",
  surfaceRaised: "#1f1733",
  surfaceMuted: "#29213d",
  border: "#3a3154",
  borderStrong: "#6d5a99",
  text: "#f7f2ff",
  textMuted: "#c5bdd8",
  textSubtle: "#9188aa",
  accent: {
    void: "#8b5cf6",
    voidMuted: "#2b174f",
    gold: "#f5c542",
    silver: "#c7ccd8",
    red: "#ff5c6c",
  },
  badge: {
    perfect: {
      background: "#3b2c0c",
      border: "#f5c542",
      text: "#ffe8a3",
    },
    partial: {
      background: "#2b2f3a",
      border: "#c7ccd8",
      text: "#eef1f7",
    },
    missing: {
      background: "#3d151d",
      border: "#ff5c6c",
      text: "#ffc4ca",
    },
    unknown: {
      background: "#29213d",
      border: "#6d5a99",
      text: "#dcd6ea",
    },
  },
  element: {
    kinetic: {
      background: "#383835",
      border: "#d6d3c5",
      text: "#f0eee4",
    },
    arc: {
      background: "#12313b",
      border: "#79dfff",
      text: "#bdf1ff",
    },
    solar: {
      background: "#3d2412",
      border: "#ff9f43",
      text: "#ffd0a3",
    },
    void: {
      background: "#25183d",
      border: "#b084ff",
      text: "#ddccff",
    },
    stasis: {
      background: "#142d45",
      border: "#86c5ff",
      text: "#c4e4ff",
    },
    strand: {
      background: "#17331e",
      border: "#7cff8a",
      text: "#c8ffce",
    },
    unknown: {
      background: "#29213d",
      border: "#6d5a99",
      text: "#dcd6ea",
    },
  },
} as const;

export const spacing = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
} as const;

export const typography = {
  fontSize: {
    caption: 11,
    small: 13,
    body: 16,
    title: 20,
  },
  lineHeight: {
    caption: 14,
    small: 18,
    body: 21,
    title: 26,
  },
  fontWeight: {
    regular: "400",
    semibold: "600",
    bold: "700",
  },
  letterSpacing: {
    badge: 0.2,
  },
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
} as const;

export const designTokens = {
  colors,
  spacing,
  typography,
  borderRadius,
} as const;

type WidenTokenValues<T> = {
  readonly [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends number
      ? number
      : WidenTokenValues<T[Key]>;
};

export type DesignTokens = WidenTokenValues<typeof designTokens>;
export type Theme = DesignTokens & {
  readonly name: string;
};

export const darkTheme = {
  name: "destiny-dark",
  ...designTokens,
} as const satisfies Theme;

export type ThemeProviderProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: Theme;
};

const ThemeContext = createContext<Theme>(darkTheme);

const styles = {
  root: {
    flex: 1,
    minHeight: "100%",
  } satisfies ViewStyle,
};

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
        style={[styles.root, { backgroundColor: theme.colors.background }, style]}
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
