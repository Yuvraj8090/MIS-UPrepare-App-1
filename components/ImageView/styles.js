import { StyleSheet } from "react-native";
import { width, height } from "../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  subView: {
    width: width * 0.3,
    height: height * 0.15,
    borderRadius: 5,
    margin: "1.5%",
    overflow: "hidden",
    borderColor: "#cccc",
    borderWidth: 0.5,
    alignItems: "center",
    // backgroundColor: "green",
  },
  subimage: {
    width: width * 0.3,
    height: width * 0.4,
  },
  loader: {
    position: "absolute",
    left: "40%",
    top: "35%",
    // alignSelf: "center",
    // transform: [{ translateX: -25 }, { translateY: -25 }],
  },
});

export default styles;
