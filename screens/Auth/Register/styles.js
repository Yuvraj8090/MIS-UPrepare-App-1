import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const RegisterCss = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  container: {
    width: width * 0.95,
    zIndex: 10,
    elevation: 5,
    alignItems: "center",
    shadowColor: "#000",
    borderRadius: width * 0.02,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    shadowOpacity: 0.5,
    backgroundColor: "#fff",
    paddingVertical: "5%",
  },
  title: {
    fontFamily: "Jost-Medium",
    fontSize: 26,
    // marginTop: "10%",
    marginVertical: "2%",
  },
  LogoTitle: {
    fontFamily: "Jost-Medium",
    fontSize: 26,
    // marginTop: "15%",
    marginVertical: "2%",
  },
  Subtitle: {
    fontFamily: "Jost-Medium",
    fontSize: 18,
    textAlign: "center",
    // marginTop: "10%",
    marginVertical: "5%",
    color: "green",
  },
  loginText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    textAlign: "center",
    // marginTop: "10%",
    marginVertical: "2%",
    textDecorationLine: "underline",
  },
  logo: {
    width: width * 0.25,
    height: height * 0.13,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: "2%",
    // position: "absolute",
    zIndex: 5,
    // top: 5,
  },
  Loginlogo: {
    width: width * 0.25,
    height: height * 0.13,
    borderRadius: 20,
    alignSelf: "center",
    marginVertical: "2%",
    // position: "absolute",
    zIndex: 5,
    // top: 105,
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
