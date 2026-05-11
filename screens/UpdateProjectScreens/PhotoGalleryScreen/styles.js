import { StyleSheet } from "react-native";
import { width, height } from "../../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  imageContainer: {
    width: width * 0.95,
    height: height * 0.6,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    margin: 16,
  },
  image: {
    width: "100%",
    height: "100%",
  },

  uplodedContainer: {
    padding: 20,
  },
  subView: {
    width: width * 0.3,
    height: height * 0.15,
    borderRadius: 5,
    margin: 6,
    overflow: "hidden",
    borderColor: "#cccc",
    borderWidth: 0.5,
    // backgroundColor: "green",
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
