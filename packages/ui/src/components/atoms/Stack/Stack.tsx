import { Box } from "../Box/index.js";
import type { StackProps } from "./Stack.types.js";
import { createStackStyle } from "./Stack.utils.js";

export function Stack({
  align,
  direction = "vertical",
  gap = "md",
  justify,
  style,
  wrap = false,
  ...boxProps
}: StackProps) {
  const stackStyle = createStackStyle({ align, direction, gap, justify, wrap });

  return <Box {...boxProps} style={[stackStyle, style]} />;
}
