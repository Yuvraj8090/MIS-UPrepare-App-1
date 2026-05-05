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
    alignItems: "center",
    gap: 3,
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
    marginHorizontal: 8,
    marginVertical: 4,
    padding: 8,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
  value: {
    fontSize: 12,
    color: "#222",
    fontFamily: "Jost-SemiBold",
    textAlign: "right",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4a90e2",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    elevation: 2,
  },
  imageButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "80%",
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  // previewImage: {
  //   width: 200,
  //   height: 150,
  //   borderRadius: 10,
  //   marginVertical: 10,
  // },
  previewLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  imgcontainer: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  loader: {
    position: "absolute",
    zIndex: 1,
  },
});

export default styles;
