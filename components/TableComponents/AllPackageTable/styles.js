import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  table: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
  },
  headerWrap: {
    gap: 14,
  },
  searchCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 14,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#dbe5ef",
    minHeight: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    color: "#0f172a",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
    flexWrap: "wrap",
  },
  summaryChip: {
    flex: 1,
    minWidth: 92,
    borderRadius: 14,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  summaryValue: {
    fontFamily: "Jost-Bold",
    fontSize: 14,
    color: "#0b57a4",
  },
  summaryLabel: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#64748b",
  },
  banner: {
    flexDirection: "row",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  bannerWarning: {
    backgroundColor: "#fff6e5",
  },
  bannerInfo: {
    backgroundColor: "#eef4ff",
  },
  bannerIconWrap: {
    marginRight: 10,
    paddingTop: 1,
  },
  bannerCopy: {
    flex: 1,
    gap: 2,
  },
  bannerTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#8a4b08",
  },
  bannerText: {
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#475569",
  },
  filterBlock: {
    gap: 8,
  },
  filterHeading: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#334155",
  },
  filterRow: {
    paddingRight: 12,
    gap: 10,
  },
  filterChip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#d6e1eb",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  filterChipActive: {
    backgroundColor: "#0b57a4",
    borderColor: "#0b57a4",
  },
  filterChipText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#475569",
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  contractRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
  },
  contractChip: {
    flex: 1,
    minWidth: 96,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6e1eb",
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  contractChipCompact: {
    flexBasis: "48%",
  },
  contractChipActive: {
    backgroundColor: "#eef4ff",
    borderColor: "#0b57a4",
  },
  contractChipText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#475569",
  },
  contractChipTextActive: {
    color: "#0b57a4",
  },
  packageCard: {
    marginTop: 14,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    padding: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  serialBadge: {
    borderRadius: 999,
    backgroundColor: "#ecf3ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  serialBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#0b57a4",
  },
  packageIdBadge: {
    borderRadius: 999,
    backgroundColor: "#effaf2",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  packageIdBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#13803d",
  },
  packageName: {
    marginTop: 14,
    fontFamily: "Jost-SemiBold",
    fontSize: 17,
    lineHeight: 24,
    color: "#0f172a",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  metaChip: {
    flex: 1,
    minWidth: 130,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  metaLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  metaValue: {
    marginTop: 4,
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    lineHeight: 18,
    color: "#1e293b",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 14,
  },
  statTile: {
    flex: 1,
  },
  statLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  statValue: {
    marginTop: 6,
    fontFamily: "Jost-Bold",
    fontSize: 15,
    color: "#0f8a4b",
  },
  contractPill: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contractPillActive: {
    backgroundColor: "#e8f8ee",
  },
  contractPillMuted: {
    backgroundColor: "#f1f5f9",
  },
  contractPillText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
  },
  contractPillTextActive: {
    color: "#0f8a4b",
  },
  contractPillTextMuted: {
    color: "#64748b",
  },
  actionRow: {
    marginTop: 16,
    alignItems: "stretch",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "#0b57a4",
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  primaryButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },
  skeletonWrap: {
    gap: 14,
    marginTop: 14,
  },
  skeletonCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    padding: 16,
    gap: 12,
  },
  skeletonBody: {
    gap: 8,
  },
  skeletonLine: {
    marginBottom: 0,
  },
  emptyState: {
    marginTop: 28,
    marginHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontFamily: "Jost-Bold",
    fontSize: 17,
    textAlign: "center",
    color: "#0f172a",
  },
  emptyBody: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    color: "#64748b",
  },
  retryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "#0b57a4",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  retryButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#ffffff",
  },
  footerSpace: {
    height: 24,
  },
});

export default styles;
