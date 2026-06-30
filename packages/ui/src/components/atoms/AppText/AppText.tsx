import { Text } from "../Text/index.js";
import type { AppTextProps } from "./AppText.types.js";

export function AppText({ children, testID }: AppTextProps) {
  return <Text testID={testID}>{children}</Text>;
}
