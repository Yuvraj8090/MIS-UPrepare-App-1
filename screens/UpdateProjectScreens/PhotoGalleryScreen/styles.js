import { StyleSheet } from "react-native";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { width, height } from "../../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  imageContainer: {
    width: "100%",
    height: height * 0.5,
    backgroundColor: colors.borderStrong,
    alignSelf: "center",
    borderRadius: radius.lg,
    overflow: "hidden",
    marginVertical: spacing.md,
    ...shadows.card,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  dismissButton: {
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 99,
    right: 12,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  imageMetaOverlay: {
    width: "100%",
    backgroundColor: "rgba(15, 23, 42, 0.48)",
    position: "absolute",
    bottom: 0,
    padding: spacing.md,
    gap: 4,
  },
  imageMetaText: {
    color: "#fff",
    fontFamily: "Jost-Medium",
    fontSize: 12,
    lineHeight: 18,
  },
  captureCard: {
    alignItems: "center",
    width: "100%",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignSelf: "center",
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.md,
    ...shadows.soft,
  },
  captureTitle: {
    marginTop: spacing.sm,
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: colors.text,
  },
  captureSubtitle: {
    marginTop: 6,
    textAlign: "center",
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 19,
    color: colors.textMuted,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  subView: {
    width: width * 0.3,
    height: height * 0.15,
    borderRadius: radius.md,
    margin: 6,
    overflow: "hidden",
    borderColor: colors.border,
    borderWidth: 0.5,
  },
  subimage: {
    width: width * 0.3,
    height: width * 0.4,
  },
  loader: {
    position: "absolute",
    left: "50%",
    top: "50%",
    alignSelf: "center",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default styles;
