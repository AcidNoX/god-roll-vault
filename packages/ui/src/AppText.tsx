import type { ReactNode } from "react";
import { Text } from "react-native";

export type AppTextProps = {
  children: ReactNode;
  testID?: string;
};

export function AppText({ children, testID }: AppTextProps) {
  return (
    <Text testID={testID} style={{ color: "#f5f5f5", fontSize: 16 }}>
      {children}
    </Text>
  );
}
