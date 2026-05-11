import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // width: width,
    // height: height * 0.9,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: width * 0.95,
    zIndex: 10,
    position: "relative",
    elevation: 5,
    marginTop: "80%",
    alignItems: "center",
    // shadowColor: "#000",
    borderRadius: width * 0.02,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 2,
    // shadowOpacity: 0.5,
    backgroundColor: "#fff",
    paddingVertical: "5%",
    // marginTop: "30%",
  },
  title: {
    fontSize: 20,
    color: "#000",
    marginVertical: 10,
    fontFamily: "Jost-Medium",
  },
  subtitleview: {
    width: width * 0.7,
    // backgroundColor: '#ccc',
    marginVertical: 10,
  },
  subTitle: {
    fontSize: 12,
    color: "#000",
    fontFamily: "Jost-Medium",
    textAlign: "center",
    // margin: 20,
  },
  logo: {
    width: width * 0.4,
    height: height * 0.15,
    // backgroundColor: "green",
  },
  status: {
    fontSize: 14,
    // color: "#0099ff",
    color: "green",
    fontWeight: "bold",
    marginVertical: 10,
  },
  error: {
    fontSize: 14,
    // color: "#0099ff",
    color: "red",
    fontWeight: "bold",
    marginVertical: 10,
  },
  footertext: {
    fontSize: 10,
    marginVertical: 10,
    bottom: 0,
  },
  footer: {
    bottom: 50,
    position: "absolute",
  },
});

export default styles;
