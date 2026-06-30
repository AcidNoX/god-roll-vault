import type { Preview } from "@storybook/react";

import { ThemeProvider } from "../src/theme/ThemeProvider.js";
import { darkTheme } from "../src/theme/theme.js";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "destiny-dark",
      values: [{ name: "destiny-dark", value: darkTheme.colors.background }],
    },
    layout: "fullscreen",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider style={{ minHeight: "auto", padding: 24 }}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
