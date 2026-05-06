import React from "react";
import { StyleSheet, Text, View } from "react-native";

import SectionCard from "@/components/UI/SectionCard";

const safeNum = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const buildBarTone = (value) => {
  if (value >= 80) {
    return { track: "#dff7e7", fill: "#16a34a", badge: "#e8f8ee", text: "#0f8a4b" };
  }
  if (value >= 40) {
    return { track: "#fff4df", fill: "#f59e0b", badge: "#fff4df", text: "#b45309" };
  }
  return { track: "#fde7e7", fill: "#dc2626", badge: "#fde7e7", text: "#b91c1c" };
};

const formatCR = (value) => `${safeNum(value).toFixed(2)} CR`;

function ProgressRow({ label, value }) {
  const tone = buildBarTone(value);

  return (
    <View style={styles.progressSection}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={[styles.progressBadge, { backgroundColor: tone.badge }]}>
          <Text style={[styles.progressBadgeText, { color: tone.text }]}>
            {safeNum(value).toFixed(2)}%
          </Text>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: tone.track }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.max(0, Math.min(safeNum(value), 100))}%`,
              backgroundColor: tone.fill,
            },
          ]}
        />
      </View>
    </View>
  );
}

export default function DepartmentPortfolioBoard({ data }) {
  const overview = data?.department_contract_overview || [];
  const physical = data?.department_wise_physical_progress || [];
  const financial = data?.department_wise_financial_progress || [];

  if (!overview.length) {
    return null;
  }

  const physicalMap = new Map(
    physical.map((item) => [item?.name, safeNum(item?.avg_progress)])
  );
  const financialMap = new Map(
    financial.map((item) => [item?.name, safeNum(item?.finance_percentage)])
  );

  return (
    <SectionCard
      title="Department Portfolio Snapshot"
      contentStyle={styles.cardContent}
    >
      <Text style={styles.sectionCopy}>
        This matches the web dashboard’s department structure more closely by showing
        budget, contract, and progress values together for each department.
      </Text>

      {overview.map((department) => {
        const name = department?.department || "-";
        const allocated = safeNum(department?.total_amount_allocated_cr);
        const signed = safeNum(department?.contract_signed_cr);
        const pending = safeNum(department?.contract_to_be_signed_cr);
        const physicalValue = physicalMap.get(name) ?? 0;
        const financialValue = financialMap.get(name) ?? 0;

        return (
          <View key={`${department?.department_id}-${name}`} style={styles.departmentCard}>
            <View style={styles.departmentHeader}>
              <View style={styles.departmentIdentity}>
                <Text style={styles.departmentName}>{name}</Text>
                <Text style={styles.departmentMeta}>
                  {safeNum(department?.total_projects)} projects ·{" "}
                  {safeNum(department?.total_contracts_signed)} signed contracts
                </Text>
              </View>
            </View>

            <View style={styles.metricRow}>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Allocated</Text>
                <Text style={styles.metricValue}>{formatCR(allocated)}</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Signed</Text>
                <Text style={styles.metricValue}>{formatCR(signed)}</Text>
              </View>
              <View style={styles.metricTile}>
                <Text style={styles.metricLabel}>Pending</Text>
                <Text style={styles.metricValue}>{formatCR(pending)}</Text>
              </View>
            </View>

            <ProgressRow label="Physical progress" value={physicalValue} />
            <ProgressRow label="Financial progress" value={financialValue} />
          </View>
        );
      })}
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    gap: 14,
  },
  sectionCopy: {
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: "#64748b",
  },
  departmentCard: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#dbe5ef",
    backgroundColor: "#f8fbff",
    padding: 14,
    gap: 12,
  },
  departmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  departmentIdentity: {
    flex: 1,
  },
  departmentName: {
    fontFamily: "Jost-Bold",
    fontSize: 17,
    color: "#0f172a",
  },
  departmentMeta: {
    marginTop: 2,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#64748b",
  },
  metricRow: {
    flexDirection: "row",
    gap: 10,
  },
  metricTile: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  metricLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  metricValue: {
    marginTop: 6,
    fontFamily: "Jost-Bold",
    fontSize: 14,
    color: "#0f172a",
  },
  progressSection: {
    gap: 8,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#334155",
  },
  progressBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  progressBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
  },
  track: {
    height: 10,
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
