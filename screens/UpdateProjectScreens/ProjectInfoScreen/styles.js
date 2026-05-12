import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { width } from "../../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    justifyContent: "space-between",
    gap: spacing.md,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  contentCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  subContainer: {
    marginTop: spacing.sm,
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  subView: {
    flex: 1,
  },
  labelText: {
    fontFamily: "Jost-Bold",
    fontSize: 20,
    color: colors.text,
  },

  sublabelText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: colors.text,
  },

  subTextview: {
    minHeight: 48,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: radius.md,
    marginTop: 8,
  },
  subText: {
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.text,
  },
});

export default styles;
