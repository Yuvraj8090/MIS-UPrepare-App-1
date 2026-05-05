import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    height: height,
  },
  container: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",

    // paddingVertical: "5%",
  },
});

export default styles;
