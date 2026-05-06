import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef1f4",
  },
  headerArea: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    fontFamily: "Jost-Bold",
    fontSize: 22,
    color: "#0f172a",
  },
  headerSubtitle: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 19,
    color: "#64748b",
  },
  searchWrap: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#0f172a",
  },
  listContent: {
    paddingBottom: 28,
  },
  projectCardContent: {
    gap: 14,
  },
  projectTitleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  projectIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: "#e8f1ff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  projectTitleContent: {
    flex: 1,
  },
  projectName: {
    fontFamily: "Jost-Medium",
    fontSize: 17,
    lineHeight: 25,
    color: "#0f172a",
  },
  expandText: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#0b57a4",
    alignSelf: "flex-start",
  },
  metaBlock: {
    gap: 4,
  },
  metaText: {
    fontFamily: "Jost-Regular",
    fontSize: 15,
    color: "#334155",
  },
  metaLabel: {
    fontFamily: "Jost-SemiBold",
    color: "#0f172a",
  },
  metaHighlight: {
    fontFamily: "Jost-SemiBold",
    color: "#14813d",
  },
  progressBlock: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  progressLabel: {
    flex: 1,
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#0f172a",
  },
  progressValue: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: "#475569",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  actionButton: {
    minHeight: 44,
    minWidth: 96,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    flexGrow: 1,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Jost-Medium",
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
  },
  skeletonList: {
    paddingTop: 8,
  },
  skeletonCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
  },
  skeletonGap: {
    marginBottom: 8,
  },
  skeletonGapLg: {
    marginBottom: 12,
  },
  skeletonButtonRow: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
});

export default styles;
