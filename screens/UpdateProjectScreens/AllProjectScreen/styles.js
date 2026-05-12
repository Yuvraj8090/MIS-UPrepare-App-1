import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
 contentContainer: {
    flex: 1,
    // REMOVE paddingHorizontal from here because we need the list to span the screen properly
    backgroundColor: colors.background,
  },
  heroCardContainer: {
    overflow: "hidden",
    marginHorizontal: spacing.md,
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: spacing.md, // Re-apply padding here
    gap: spacing.md,
  },
 heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  heroCopy: {
    flex: 1,
  },
  eyebrow: {
    fontFamily: "Jost-SemiBold",
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: colors.primary,
  },
  heroTitle: {
    marginTop: 8,
    fontFamily: "Jost-Bold",
    fontSize: 15,
    color: colors.text,
  },
  heroSubtitle: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
  },
  metricsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  metricCard: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: "space-between",
  },
  metricValue: {
    fontFamily: "Jost-Bold",
    fontSize: 13,
    color: colors.text,
  },
  metricLabel: {
    fontFamily: "Jost-Regular",

    fontSize: 7,
    color: colors.textGreen,
  },
  noticeCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...shadows.soft,
  },
  noticeContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  noticeText: {
    flex: 1,
    fontFamily: "Jost-Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  retryButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#fff",
  },
});

export default styles;
