import { StyleSheet } from "react-native";

const RegisterCss = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backgroundImage: {
    opacity: 0.88,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(7, 17, 32, 0.78)",
  },
  container: {
    width: "100%",
    maxWidth: 430,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.96)",
    paddingHorizontal: 22,
    paddingVertical: 28,
    shadowColor: "#020617",
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eaf2ff",
    marginBottom: 16,
  },
  LogoTitle: {
    fontFamily: "Jost-Medium",
    fontSize: 26,
    color: "#0f172a",
    marginBottom: 10,
    textAlign: "center",
  },
  Subtitle: {
    fontFamily: "Jost-Medium",
    fontSize: 17,
    lineHeight: 26,
    textAlign: "center",
    color: "#14813d",
    marginBottom: 22,
  },
  loginButton: {
    minHeight: 48,
    minWidth: 180,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#bfdbfe",
  },
  loginText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    color: "#0b57a4",
    textAlign: "center",
  },
  title: {
    fontFamily: "Jost-Medium",
    fontSize: 26,
  },
  logo: {
    width: 96,
    height: 96,
  },
  Loginlogo: {
    width: 96,
    height: 96,
  },
  inpErr: {
    color: "red",
    fontSize: 12,
    fontFamily: "Jost-Medium",
    marginTop: -5,
    marginBottom: 1,
  },
});

export default RegisterCss;
