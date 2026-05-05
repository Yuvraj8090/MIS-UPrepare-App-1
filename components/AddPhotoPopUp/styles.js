import { StyleSheet } from "react-native";
import { width, height } from "../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: width * 0.9,
    backgroundColor: "#fff",
    alignItems: "center",
    padding: "4%",
    borderRadius: 10,
  },
  label: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.3,
    // backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 10,
    overflow: "hidden",
    margin: "4%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadContainer: {
    width: width * 0.8,
    height: height * 0.3,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    zIndex: 99,
    // bottom: 10,
  },
});

export default styles;
