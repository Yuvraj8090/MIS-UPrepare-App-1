import { width } from "@/services/helper";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F6F8FA" },
  container: { padding: "1%", backgroundColor: "#f1f1f1" },

  title: { fontSize: 12, fontWeight: "600", marginBottom: 12 },

  projectCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    // marginBottom: 12,
    shadowColor: "#00000011",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  projectTitle: {
    fontSize: 13,
    fontFamily: "Jost-Medium",
    marginBottom: 8,
  },
  filterRow: {
    // backgroundColor: "red",
    flexDirection: "row",
    // alignItems: "center",
    gap: 8,
  },

  filterItem: {
    // marginRight: 8,
    minWidth: width * 0.3,
    // backgroundColor: "green",
  },
  filterLabel: {
    fontFamily: "Jost-Medium",
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  filterValue: {
    backgroundColor: "#F0F4F8",
    padding: 6,
    borderRadius: 6,
    minHeight: 34,
    justifyContent: "center",
  },
  filterDateInput: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E6E9EE",
  },

  headerRow: {
    backgroundColor: "#28A745",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  headerCell: { color: "#fff", fontWeight: "700", fontSize: 12 },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.3,
    height: 35,
    paddingHorizontal: "5%",
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

  colSL: { flex: 0.6, paddingRight: 8, justifyContent: "center" },
  slText: { fontWeight: "700", color: "#2B2B2B" },

  colItem: { flex: 3 },
  itemText: { color: "#333", lineHeight: 20 },

  colSmall: { flex: 1.5, paddingRight: 8 },
  colRemarks: { flex: 2, paddingRight: 8 },

  label: { fontSize: 11, color: "#6B7280", marginBottom: 6 },

  pickerWrap: {
    borderWidth: 1,
    borderColor: "#E6E9EE",
    borderRadius: 6,
    overflow: "hidden",
    height: 40,
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  picker: { height: 40, width: "100%" },
  smallPicker: { height: 40, width: "100%" },

  input: {
    borderWidth: 1,
    borderColor: "#EAEFF5",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    minHeight: 40,
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
    backgroundColor: "#0F9D58",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    marginTop: 6,
  },
  saveBtnText: { color: "#fff", fontWeight: "700" },

  colFiles: { flex: 1, alignItems: "flex-start" },
  uploadBtn: {
    backgroundColor: "#FE6B8B",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginTop: 6,
  },
  uploadBtnText: { color: "#fff", fontWeight: "700" },

  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#F3F4F6",
  },
  pillText: { fontSize: 12, color: "#333" },
});

export default styles;
