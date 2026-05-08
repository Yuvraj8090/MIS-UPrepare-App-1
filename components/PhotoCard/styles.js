import { StyleSheet } from "react-native";
import { width, height } from "../../services/helper";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.45,
    height: height * 0.186,
    borderRadius: radius.lg,
    padding: spacing.sm,
    margin: spacing.xs,
    overflow: "hidden",
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  labelView: {
    width: width * 0.45,
    height: height * 0.06,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  labelText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    color: colors.text,
  },
  uploadBanner: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    ...shadows.soft,
  },
  uploadText: {
    fontFamily: "Jost-Regular",
    marginTop: spacing.sm,
    color: colors.textMuted,
    textAlign: "center",
  },
});

export default styles;
