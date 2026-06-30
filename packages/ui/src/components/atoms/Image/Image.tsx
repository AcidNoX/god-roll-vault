import { Image as RNImage } from "react-native";

import type { ImageProps } from "./Image.types.js";

export function Image({ sourceUri, style, ...imageProps }: ImageProps) {
  return <RNImage {...imageProps} source={{ uri: sourceUri }} style={style} />;
}
