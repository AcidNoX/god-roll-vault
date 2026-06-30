import type { TextStyle, ViewStyle } from "react-native";

export const weaponCardStyles = {
  card: {
    alignItems: "center",
    backgroundColor: "#151520",
    borderColor: "#2a2a3a",
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
  } satisfies ViewStyle,
  pressableCard: {
    cursor: "pointer",
  } satisfies ViewStyle,
  pressedCard: {
    opacity: 0.82,
  } satisfies ViewStyle,
  elementIcon: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    height: 32,
    justifyContent: "center",
    marginRight: 12,
    width: 32,
  } satisfies ViewStyle,
  elementIconText: {
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 14,
  } satisfies TextStyle,
  weaponDetails: {
    flex: 1,
    minWidth: 0,
  } satisfies ViewStyle,
  weaponName: {
    color: "#f5f5f5",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 21,
  } satisfies TextStyle,
  metadataRow: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 4,
  } satisfies ViewStyle,
  powerText: {
    color: "#b9bbc9",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  } satisfies TextStyle,
  badge: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: "center",
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  } satisfies ViewStyle,
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
    lineHeight: 14,
    textTransform: "uppercase",
  } satisfies TextStyle,
};
