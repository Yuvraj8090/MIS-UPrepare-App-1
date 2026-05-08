import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#07112000",
  },
  backgroundImage: {
    opacity: 0.88,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 17, 32, 0.84)",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 28,
  },
  heroWrap: {
    alignItems: "center",
    marginBottom: 22,
  },
  topBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(11, 87, 164, 0.20)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    marginBottom: 20,
  },
  topBadgeText: {
    color: "#dbeafe",
    fontFamily: "Jost-Medium",
    fontSize: 12,
    letterSpacing: 0.2,
  },
  logo: {
    width: 200,
    height: 90,
    backgroundColor: "rgba(255,255,255,0.92)",
    
    paddingVertical: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    lineHeight: 36,
    fontFamily: "Jost-Bold",
    textAlign: "center",
  },
  heroSubtitle: {
    color: "#dbeafe",
    fontSize: 15,
    lineHeight: 22,
    fontFamily: "Jost-Regular",
    textAlign: "center",
    maxWidth: 340,
    marginTop: 10,
  },
  formCard: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 22,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 26,
    elevation: 10,
    gap: 2,
  },
  formHeader: {
    marginBottom: 16,
    alignItems: "center",
  },
  formTitle: {
    color: "#0f172a",
    fontSize: 25,
    fontFamily: "Jost-Bold",
  },
  formCaption: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
    fontFamily: "Jost-Regular",
  },
  feedbackCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
    gap: 10,
  },
  feedbackInfoCard: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  feedbackSuccessCard: {
    backgroundColor: "#effaf3",
    borderColor: "#bbf7d0",
  },
  feedbackErrorCard: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  feedbackText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Jost-Medium",
  },
  feedbackInfoText: {
    color: "#1d4ed8",
  },
  feedbackSuccessText: {
    color: "#15803d",
  },
  feedbackErrorText: {
    color: "#b91c1c",
  },
  label: {
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
    marginBottom: 8,
  },
  fieldBlock: {
    marginBottom: 2,
  },
  inputShell: {
    minHeight: 56,
    borderWidth: 1,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  leadingIconWrap: {
    width: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  inputContent: {
    flex: 1,
  },
  accessoryWrap: {
    marginLeft: 10,
  },
  input: {
    minHeight: 54,
    color: "#0f172a",
    fontSize: 16,
    fontFamily: "Jost-Medium",
    paddingVertical: 12,
  },
  fieldError: {
    color: "#b91c1c",
    fontSize: 12,
    fontFamily: "Jost-Medium",
    marginTop: 7,
    marginBottom: 14,
  },
  metaRow: {
    marginTop: 8,
    marginBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  metaText: {
    color: "#64748b",
    fontSize: 12,
    fontFamily: "Jost-Regular",
    flex: 1,
  },
  linkText: {
    color: "#0b57a4",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  button: {
    minHeight: 56,
    backgroundColor: "#0b57a4",
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0b57a4",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Jost-SemiBold",
  },
  footerNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginTop: 16,
  },
  footerText: {
    flex: 1,
    color: "#64748b",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Jost-Regular",
  },
});

export const feedbackVariants = {
  info: {
    card: styles.feedbackInfoCard,
    text: styles.feedbackInfoText,
    icon: "information-circle-outline",
    iconColor: "#1d4ed8",
  },
  success: {
    card: styles.feedbackSuccessCard,
    text: styles.feedbackSuccessText,
    icon: "checkmark-circle-outline",
    iconColor: "#15803d",
  },
  error: {
    card: styles.feedbackErrorCard,
    text: styles.feedbackErrorText,
    icon: "alert-circle-outline",
    iconColor: "#b91c1c",
  },
};

export default styles;
