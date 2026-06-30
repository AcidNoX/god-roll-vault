import { Box } from "../../atoms/Box/index.js";
import type { ScreenProps } from "./Screen.types.js";

export function Screen({ children, testID }: ScreenProps) {
  return (
    <Box
      testID={testID}
      backgroundColor="background"
      padding="lg"
      style={{
        flex: 1,
        minHeight: "100%",
      }}
    >
      {children}
    </Box>
  );
}
