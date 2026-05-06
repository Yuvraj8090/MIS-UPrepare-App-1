import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const safeNum = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatCR = (value) => `${safeNum(value).toFixed(2)} CR`;

export default function ExecutiveSummary({ data }) {
  const overview = data?.department_contract_overview || [];
  const physical = data?.department_wise_physical_progress || [];
  const financial = data?.department_wise_financial_progress || [];

  if (!overview.length && !physical.length && !financial.length) {
    return null;
  }

  const totalDepartments = overview.length;
  const totalSignedContracts = overview.reduce(
    (sum, item) => sum + safeNum(item?.total_contracts_signed),
    0
  );
  const totalAllocated = overview.reduce(
    (sum, item) => sum + safeNum(item?.total_amount_allocated_cr),
    0
  );
  const totalSignedValue = overview.reduce(
    (sum, item) => sum + safeNum(item?.contract_signed_cr),
    0
  );
  const totalPendingValue = overview.reduce(
    (sum, item) => sum + safeNum(item?.contract_to_be_signed_cr),
    0
  );
  const avgPhysical =
    physical.length > 0
      ? physical.reduce((sum, item) => sum + safeNum(item?.avg_progress), 0) /
        physical.length
      : 0;
  const avgFinancial =
    financial.length > 0
      ? financial.reduce(
          (sum, item) => sum + safeNum(item?.finance_percentage),
          0
        ) / financial.length
      : 0;

  const cards = [
    {
      key: "departments",
      label: "Departments",
      value: `${totalDepartments}`,
      icon: "business-outline",
      tint: "#0b57a4",
      bg: "#e8f1fb",
    },
    {
      key: "contracts",
      label: "Signed Contracts",
      value: `${totalSignedContracts}`,
      icon: "document-text-outline",
      tint: "#0f8a4b",
      bg: "#e8f8ee",
    },
    {
      key: "allocated",
      label: "Allocated Budget",
      value: formatCR(totalAllocated),
      icon: "wallet-outline",
      tint: "#8b5cf6",
      bg: "#f1ebff",
    },
    {
      key: "signedValue",
      label: "Signed Value",
      value: formatCR(totalSignedValue),
      icon: "checkmark-done-circle-outline",
      tint: "#f97316",
      bg: "#fff1e8",
    },
    {
      key: "pendingValue",
      label: "Pending Value",
      value: formatCR(totalPendingValue),
      icon: "time-outline",
      tint: "#dc2626",
      bg: "#fdecec",
    },
    {
      key: "avgPhysical",
      label: "Avg Physical Progress",
      value: `${avgPhysical.toFixed(2)}%`,
      icon: "trending-up-outline",
      tint: "#16a34a",
      bg: "#ebfaef",
    },
    {
      key: "avgFinancial",
      label: "Avg Financial Progress",
      value: `${avgFinancial.toFixed(2)}%`,
      icon: "stats-chart-outline",
      tint: "#0891b2",
      bg: "#e8f8fb",
    },
    {
      key: "subProjects",
      label: "Sub-Projects",
      value: `${safeNum(data?.sub_projects_count)}`,
      icon: "git-branch-outline",
      tint: "#475569",
      bg: "#eef2f7",
    },
  ];

  return (
    <View style={styles.grid}>
      {cards.map((card) => (
        <View key={card.key} style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: card.bg }]}>
            <Ionicons name={card.icon} size={20} color={card.tint} />
          </View>
          <Text style={styles.value} numberOfLines={1}>
            {card.value}
          </Text>
          <Text style={styles.label}>{card.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    marginTop: 6,
    paddingHorizontal: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    borderRadius: 18,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 16,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    marginTop: 14,
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: "#0f172a",
  },
  label: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 17,
    color: "#64748b",
  },
});
