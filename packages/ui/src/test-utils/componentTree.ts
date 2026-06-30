import { isValidElement, type ReactNode } from "react";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

export function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join("");
  }

  if (isValidElement<TestElementProps>(node)) {
    return textContent(node.props.children);
  }

  return "";
}

export function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) {
    return {};
  }

  if (Array.isArray(style)) {
    const merged: Record<string, unknown> = {};

    for (const stylePart of style) {
      Object.assign(merged, flattenStyle(stylePart));
    }

    return merged;
  }

  if (typeof style === "object") {
    return style as Record<string, unknown>;
  }

  return {};
}
