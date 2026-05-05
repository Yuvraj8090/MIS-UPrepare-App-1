import { StyleSheet } from "react-native";
import { height, width } from "../../../services/helper";

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    // marginVertical: "3%",
    paddingVertical: "2%",
    elevation: 2,
    backgroundColor: "#fff",
  },
  subContainer: {
    margin: "1%",
    width: width * 0.93,
    // backgroundColor: "green",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subView: {
    width: "45%",
  },
  labelText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
  },

  sublabelText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
  },

  subTextview: {
    backgroundColor: "#F1f1f1",
    padding: "2%",
    borderRadius: 4,
    marginVertical: "2%",
  },
  subText: { fontFamily: "Jost-Regular", fontSize: 15, marginHorizontal: "2%" },
});

export default styles;
