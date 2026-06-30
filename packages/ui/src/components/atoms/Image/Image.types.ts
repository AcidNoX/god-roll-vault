import type { ImageProps as RNImageProps } from "react-native";

export type ImageProps = Omit<RNImageProps, "source"> & {
  sourceUri: string;
};
