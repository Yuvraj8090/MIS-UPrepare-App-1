import { StyleSheet } from "react-native";
import { colors, spacing } from "@/constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  loaderText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: colors.textMuted,
  },
});

export default styles;
