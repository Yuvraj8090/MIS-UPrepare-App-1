import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const authStyles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "#fff",
  },
  container: {
    width: width * 0.95,
    zIndex: 10,
    position: "relative",
    elevation: 5,
    marginTop: height * 0.3,
    alignItems: "center",
    borderRadius: width * 0.03,
    backgroundColor: "#fff",
    paddingVertical: "5%",
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-Regular",
    textAlign: "center",
    // marginTop: "10%",
    marginVertical: "2%",
    marginHorizontal:"2%"
  },
  LogoTitle: {
    fontSize: 22,
    fontFamily: "Jost-Medium",
    // marginTop: "15%",
    marginVertical: "2%",
    color: "#1f2937",
  },
  logo: {
    width: width * 0.25,
    zIndex: 5,
    height: height * 0.13,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: "2%",
    // position: "absolute",
    // top: 5,
  },
  Loginlogo: {
    width: width * 0.25,
    zIndex: 5,
    height: height * 0.13,
    alignSelf: "center",
    borderRadius: 20,
    marginVertical: "2%",
    // position: "absolute",
    // top: 105,
  },
  otpView: {
    height: "auto",
    maxHeight: 96,
    marginTop: 10,
  },
  otpicView: {
    alignItems: "center",
  },
  otpInput: {
    width: 40,
    color: "#06D001",
    margin: 5,
    padding: "1%",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Jost-Medium",
    borderWidth: 2,
    borderRadius: 5,
  },
  otpres: {
    color: "#06D001",
    fontSize: 16,
    fontFamily: "Jost-SemiBold",
  },
  flexRow: {
    flexDirection: "row",
  },
  ffJost: {
    fontFamily: "Jost-Medium",
    textAlign: "center",
    fontSize: 12,
  },
  ffPopSemi: {
    fontFamily: "Jost-SemiBold",
  },
  bnavLinks: {
    flexDirection: "row",
  },
  regLinkBox: {
    margin: "5%",
    alignSelf: "flex-start",
    marginRight: "8%",
  },
  errTxt: {
    color: "red",
    fontSize: 12,
    fontFamily: "Jost-Medium",
    marginVertical: "1%",
  },
  inpErr: {
    width: width * 0.7,
    color: "red",
    fontSize: 12,
    marginTop: -5,
    textAlign: "left",
    fontFamily: "Jost-Medium",
    marginBottom: 1,
  },
  otpErrView: {
    marginTop: 10,
  },
  bottomImg: {
    width: width,
    bottom: 0,
    height: height * 0.18,
    position: "absolute",
    alignSelf: "center",
  },
  match: {
    fontWeight: "bold",
    color: "red",
    fontSize: 12,
    marginVertical: 10,
  },
});

export default authStyles;
