import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#eef1f4",
    height: height,
  },
  container: {
    alignItems: "stretch",
    flexDirection: "column",
  },
});

export default styles;
