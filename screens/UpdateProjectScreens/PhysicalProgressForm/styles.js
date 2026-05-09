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
    padding: 24,
    borderRadius: 8,
    marginVertical: 8,
  },
  nameView: {
    width: width * 0.8,
    //   alignItems: "center",
    borderRadius: 10,
    marginVertical: 12,
    backgroundColor: "#F3EEEA",
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  headerTitle: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
    margin: 8,
    color: "#777",
    textAlign: "justify",
  },
  labelText: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
  },
  buttonView: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 5,
  },
});

export default styles;
