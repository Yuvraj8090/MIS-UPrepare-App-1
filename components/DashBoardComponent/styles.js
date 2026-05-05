import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    width: width * 0.95,
    height: height * 0.186,
    // backgroundColor: "#65B741",
    borderRadius: 20,
    padding: "3%",
    margin: "2.5%",
    // Add shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // Add elevation for Android
    elevation: 5,
    overflow: "hidden",
  },
  title: { fontFamily: "Jost-Medium", fontSize: 40 },
  titleText: {
    fontFamily: "Jost-Medium",
    fontSize: 18,
    color: "#fff",
  },
  smallContainer: {
    width: width * 0.45,
    height: height * 0.186,
    // backgroundColor: "#65B741",
    borderRadius: 20,
    padding: "3%",
    margin: "2.5%",
    // Add shadow properties for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // // Add elevation for Android
    elevation: 5,
    overflow: "hidden",
  },
  // smallTitleText: {
  //   fontFamily: "Jost-Medium",
  //   fontSize: 16,
  //   color: "#777",
  //   marginHorizontal: "2%",
  // },
  // smallTitle: {
  //   fontFamily: "Jost-Medium",
  //   fontSize: 22,
  //   marginHorizontal: "2%",
  // },
});

export default styles;
