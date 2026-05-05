import { StyleSheet } from "react-native";
import { height, width } from "../../../services/helper";

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    // marginHorizontal: "2%",
    alignSelf: "center",
    backgroundColor: "#fff",
    elevation: 5,
    padding: "8%",
    borderRadius: 8,
    marginVertical: "2%",
  },
  nameView: {
    width: width * 0.8,
    //   alignItems: "center",
    borderRadius: 10,
    marginVertical: "3%",
    backgroundColor: "#F3EEEA",
    paddingVertical: "4.5%",
    paddingHorizontal: "6%",
  },
  headerTitle: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
    margin: "2%",
    color: "#777",
    textAlign: "justify",
  },
  labelText: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
  },
  buttonView: {
    paddingVertical: "2%",
    paddingHorizontal: "15%",
    borderRadius: 5,
  },
});

export default styles;
