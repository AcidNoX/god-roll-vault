import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { Text } from "../components/atoms/Text/index.js";
import { ThemeProvider, useTheme } from "./ThemeProvider.js";

function TokenSwatch({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ alignItems: "center", gap: 8 }}>
      <View
        style={{
          backgroundColor: value,
          borderColor: "#6d5a99",
          borderRadius: 8,
          borderWidth: 1,
          height: 48,
          width: 72,
        }}
      />
      <Text color="textMuted" variant="caption">
        {label}
      </Text>
    </View>
  );
}

function ThemeShowcase() {
  const theme = useTheme();

  return (
    <View style={{ gap: 24 }}>
      <Text variant="heading">Design tokens</Text>

      <View style={{ gap: 12 }}>
        <Text variant="body">Colors</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16 }}>
          <TokenSwatch label="background" value={theme.colors.background} />
          <TokenSwatch label="surface" value={theme.colors.surface} />
          <TokenSwatch label="surfaceRaised" value={theme.colors.surfaceRaised} />
          <TokenSwatch label="accent.void" value={theme.colors.accent.void} />
          <TokenSwatch label="accent.gold" value={theme.colors.accent.gold} />
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text variant="body">Spacing</Text>
        <View style={{ gap: 8 }}>
          {(["xs", "sm", "md", "lg", "xl", "2xl"] as const).map((token) => (
            <View key={token} style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  backgroundColor: theme.colors.accent.void,
                  height: 12,
                  width: theme.spacing[token],
                }}
              />
              <Text color="textMuted" variant="caption">
                {token} ({theme.spacing[token]}px)
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        <Text variant="body">Typography</Text>
        <Text variant="heading">Heading / title</Text>
        <Text variant="body">Body copy for descriptions and inventory details.</Text>
        <Text color="textMuted" variant="caption">
          Caption labels for badges and metadata
        </Text>
      </View>
    </View>
  );
}

const meta = {
  title: "Theme/ThemeProvider",
  component: ThemeProvider,
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ThemeProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TokenShowcase: Story = {
  args: {
    children: null,
  },
  render: () => <ThemeShowcase />,
};
