import { StyleSheet } from "react-native";
import { width, height } from "../../../services/helper";

const styles = StyleSheet.create({
  table: {
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "#000",
    marginHorizontal: "0.5%",
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
  },
  headerSnoCell: {
    width: width * 0.16,
    // flex: 1,
    paddingHorizontal: "1%",
    paddingVertical: "3%",
    fontFamily: "Jost-SemiBold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
  },
  headerCell: {
    // width: width * 0.26,
    flex: 1,
    // paddingHorizontal: "2%",
    // paddingLeft: "5%",
    paddingVertical: "3%",
    fontFamily: "Jost-SemiBold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: 13,
  },
  snocellView: {
    width: width * 0.15,
    paddingHorizontal: "1%",
    paddingVertical: "3%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  snocell: {
    textAlign: "center",
    fontFamily: "Jost-Medium",
  },
  cellNameView: {
    width: width * 0.18,
    // flex: 1,
    // alignItems: "center",
    justifyContent: "center",
    // paddingLeft: "5%",
    paddingHorizontal: "1.5%",
    paddingVertical: "2%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "red",
  },
  cellView: {
    flex: 1,
    // width: width * 0.18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "1%",
    paddingVertical: "2%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "green",
  },
  cell: {
    textAlign: "center",
    fontFamily: "Jost-Regular",
    fontSize: 12,
  },
  buttinView: {
    width: width * 0.18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007bff",
    // padding: "5%",
    // paddingHorizontal: "3%",
    paddingVertical: "10%",
    borderRadius: 4,
  },
});

export default styles;
