import { width } from "@/services/helper";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  headingRow: {
    backgroundColor: "#eaeaeaff",
    // paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#E6E9EE",
    minHeight: 48,
    borderRadius: 8,
  },
  headingSLCol: {
    // backgroundColor: "#fff",
  },
  headingSLText: {
    fontWeight: "700",
    marginLeft: 8,
  },
  headingItemCol: {
    // paddingLeft: 12,
    flex: 4,
    // backgroundColor: "red",
  },
  headingItemText: {
    fontFamily: "Jost-SemiBold",
  },

  /* data row */
  dataRow: {
    backgroundColor: "#fff",
  },

  cell: { flex: 1, paddingHorizontal: 8, alignItems: "center" },
  dashCol: { justifyContent: "center" },
  dash: { color: "#888", fontSize: 14 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E6E9EE",
    shadowColor: "#00000005",
    marginBottom: 4,
  },
  row: { flexDirection: "row", alignItems: "flex-start" },

  colSL: {
    // flex: 0,
    paddingRight: 8,
    justifyContent: "center",
    // backgroundColor: "red",
  },
  slText: { fontFamily: "Jost-Bold", color: "#2B2B2B" },

  colItem: { flex: 3, backgroundColor: "gree" },
  itemText: { lineHeight: 20, fontFamily: "Jost-Medium" },

  colSmall: { flex: 0.5, paddingRight: 8 },
  colRemarks: { flex: 1, paddingRight: 8 },

  label: { fontSize: 11, color: "#6B7280", marginBottom: 6 },

  pickerWrap: {
    // borderWidth: 1,
    // borderColor: "#E6E9EE",
    borderRadius: 6,
    overflow: "hidden",
    height: 40,
    justifyContent: "center",
    // backgroundColor: "#ccc",
  },

  picker: { height: 40, width: "100%" },
  smallPicker: { height: 40, width: "100%" },

  input: {
    borderWidth: 1,
    borderColor: "#EAEFF5",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 9,
    fontSize: 13,
    minHeight: 30,
    // textAlign:"left"
    textAlignVertical: "top",
  },

  colDate: { flex: 1.2, paddingRight: 8 },
  dateBox: {
    borderWidth: 1,
    borderColor: "#E6E9EE",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
  },

  colActions: { flex: 1, alignItems: "flex-start" },
  saveBtn: {
    backgroundColor: "#28A745",
    // paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    // marginTop: 3,
    height: 33,
    justifyContent: "center",
  },
  saveBtnText: { color: "#fff", fontFamily: "Jost-SemiBold" },

  colFiles: { flex: 1, alignItems: "flex-start" },
  uploadBtn: {
    backgroundColor: "#007BFF",
    // paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    height: 34,
    justifyContent: "center",
    // marginTop: 6,
  },
  uploadBtnText: { color: "#fff", fontFamily: "Jost-SemiBold" },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.2,
    height: 35,
    paddingHorizontal: "10%",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 2,
    zIndex: 1000,
  },
  dropdownBtnText: {
    fontSize: 11,
    color: "#000",
    textAlign: "left",
  },
  dropdownMenu: {
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    zIndex: 2000,
    padding: "1%",
  },
  dropdownItemTxtStyle: {
    padding: "4%",
    fontSize: 11,
    fontFamily: "Jost-Medium",
  },
});

export default styles;
