import { StyleSheet } from "react-native";
import { width, height } from "../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
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
    backgroundColor: "#fff",
    // opacity: 0
  },
  labelView: {
    width: width * 0.45,
    height: height * 0.06,
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: "4.5%",
  },
  labelText: {
    fontFamily: "Jost-Medium",
    fontSize: 20,
  },
});

export default styles;
