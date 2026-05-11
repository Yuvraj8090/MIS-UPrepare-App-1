import React, { useMemo, useState } from "react";
import {
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { getNestedPercentFilter } from "@/services/helper";
import SectionCard from "@/components/UI/SectionCard";

const canEnableExperimentalLayoutAnimation =
  Platform.OS === "android" &&
  !global?.nativeFabricUIManager &&
  typeof UIManager.setLayoutAnimationEnabledExperimental === "function";

if (canEnableExperimentalLayoutAnimation) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const sortButtons = [
  { label: "Physical", key: "physical_percent" },
  { label: "Financial", key: "finance_percent" },
  { label: "Env Pre-Con", key: "environmental_pre" },
  { label: "Env During-Con", key: "environmental_during" },
  { label: "Social Pre-Con", key: "social_pre" },
  { label: "Social During-Con", key: "social_during" },
];

const formatCurrency = (value) =>
  `₹ ${(Number(value || 0) / 10000000).toFixed(2)} Cr`;

const getProgressTone = (value) => {
  if (value >= 80) {
    return {
      fill: "#16a34a",
      badgeBg: "#dcfce7",
      badgeText: "#166534",
    };
  }

  if (value >= 40) {
    return {
      fill: "#f59e0b",
      badgeBg: "#fef3c7",
      badgeText: "#92400e",
    };
  }

  return {
    fill: "#dc2626",
    badgeBg: "#fee2e2",
    badgeText: "#991b1b",
  };
};

const ProgressMetric = ({ label, value }) => {
  const tone = getProgressTone(value);

  return (
    <View style={styles.progressBlock}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>{label}</Text>
        <View style={[styles.progressBadge, { backgroundColor: tone.badgeBg }]}>
          <Text style={[styles.progressBadgeText, { color: tone.badgeText }]}>
            {value.toFixed(2)}%
          </Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.max(0, Math.min(value, 100))}%`,
              backgroundColor: tone.fill,
            },
          ]}
        />
      </View>
    </View>
  );
};

const SafeguardGroup = ({ safeguard }) => (
  <View style={styles.safeguardCard}>
    <View style={styles.safeguardHeader}>
      <Text style={styles.safeguardTitle}>{safeguard?.compliance || "Compliance"}</Text>
    </View>

    {safeguard?.phases?.map((phase, index) => (
      <ProgressMetric
        key={`${safeguard?.compliance || "phase"}-${phase?.phase || index}`}
        label={phase?.phase || "Phase"}
        value={Number(phase?.percent || 0)}
      />
    ))}
  </View>
);

export default function ProjectList({ data = [] }) {
  const [search, setSearch] = useState("");
  const [expandedCards, setExpandedCards] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: "physical_percent",
    direction: "desc",
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return data;
    }

    return [...data].sort((a, b) => {
      const valA = Number(getNestedPercentFilter(a, sortConfig.key) || 0);
      const valB = Number(getNestedPercentFilter(b, sortConfig.key) || 0);

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortConfig]);

  const visibleData = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sortedData;
    }

    return sortedData.filter((item) => {
      const packageNumber = item?.package_number?.toLowerCase?.() || "";
      const name = item?.name?.toLowerCase?.() || "";
      return packageNumber.includes(query) || name.includes(query);
    });
  }, [search, sortedData]);

  const averagePhysical =
    visibleData.length > 0
      ? visibleData.reduce((sum, item) => sum + Number(item?.physical_percent || 0), 0) /
        visibleData.length
      : 0;

  const averageFinancial =
    visibleData.length > 0
      ? visibleData.reduce((sum, item) => sum + Number(item?.finance_percent || 0), 0) /
        visibleData.length
      : 0;

  const totalContractCr =
    visibleData.reduce((sum, item) => sum + Number(item?.contract_value || 0), 0) / 10000000;

  const toggleExpand = (id) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }

      return {
        key,
        direction: "desc",
      };
    });
  };

  return (
    <SectionCard
      title="Sub-Project Progress"
      contentStyle={styles.sectionContent}
    >
      <View style={styles.summaryRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.summaryLabel}>Sub-Projects</Text>
          <Text style={styles.summaryValue}>{visibleData.length}</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryLabel}>Avg Physical</Text>
          <Text style={styles.summaryValue}>{averagePhysical.toFixed(1)}%</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryLabel}>Avg Financial</Text>
          <Text style={styles.summaryValue}>{averageFinancial.toFixed(1)}%</Text>
        </View>

        <View style={styles.summaryChip}>
          <Text style={styles.summaryLabel}>Contract Value</Text>
          <Text style={styles.summaryValue}>₹ {totalContractCr.toFixed(2)} Cr</Text>
        </View>
      </View>

      <View style={styles.searchShell}>
        <Ionicons name="search-outline" size={18} color="#64748b" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by package number or sub-project name"
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
        {search ? (
          <Pressable onPress={() => setSearch("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="#94a3b8" />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortRow}
      >
        {sortButtons.map((button) => {
          const isActive = sortConfig.key === button.key;
          const arrow = isActive
            ? sortConfig.direction === "asc"
              ? "↑"
              : "↓"
            : "";

          return (
            <Pressable
              key={button.key}
              onPress={() => handleSort(button.key)}
              style={[styles.sortChip, isActive && styles.sortChipActive]}
            >
              <Text style={[styles.sortChipText, isActive && styles.sortChipTextActive]}>
                {button.label} {arrow}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.listWrap}>
        {visibleData.map((item, index) => {
          const isOpen = expandedCards[item?.id];
          const physicalValue = Number(item?.physical_percent || 0);
          const financialValue = Number(item?.finance_percent || 0);

          return (
            <View key={item?.id?.toString() || `sub-project-${index}`} style={styles.projectCard}>
              <View style={styles.projectTopRow}>
                <View style={styles.projectMetaWrap}>
                  <Text style={styles.index}>#{index + 1}</Text>
                  <Text style={styles.package}>{item?.package_number || "N/A"}</Text>
                </View>

                <View style={[styles.statusPill, { backgroundColor: getProgressTone(physicalValue).badgeBg }]}>
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: getProgressTone(physicalValue).badgeText },
                    ]}
                  >
                    {physicalValue >= 80
                      ? "On Track"
                      : physicalValue >= 40
                        ? "Needs Push"
                        : "Critical"}
                  </Text>
                </View>
              </View>

              <Text style={styles.name}>{item?.name}</Text>

              <View style={styles.metricRow}>
                <View style={styles.metricTile}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={18}
                    color="#0b57a4"
                  />
                  <View style={styles.metricTextWrap}>
                    <Text style={styles.metricLabel}>Contract Value</Text>
                    <Text style={styles.metricValue}>
                      {formatCurrency(item?.contract_value)}
                    </Text>
                  </View>
                </View>

                <View style={styles.metricTile}>
                  <MaterialCommunityIcons
                    name="shield-check-outline"
                    size={18}
                    color="#14813d"
                  />
                  <View style={styles.metricTextWrap}>
                    <Text style={styles.metricLabel}>Safeguard Groups</Text>
                    <Text style={styles.metricValue}>
                      {item?.safeguards?.length || 0}
                    </Text>
                  </View>
                </View>
              </View>

              <ProgressMetric label="Physical Progress" value={physicalValue} />
              <ProgressMetric label="Financial Progress" value={financialValue} />

              <Pressable
                onPress={() => toggleExpand(item.id)}
                style={styles.expandRow}
              >
                <Text style={styles.expandText}>
                  {isOpen ? "Hide safeguards" : "View safeguards"}
                </Text>
                <Ionicons
                  name={isOpen ? "chevron-up" : "chevron-down"}
                  size={18}
                  color="#0b57a4"
                />
              </Pressable>

              {isOpen ? (
                <View style={styles.safeguardList}>
                  {item?.safeguards?.map((safeguard, safeguardIndex) => (
                    <SafeguardGroup
                      key={`${item?.id || index}-safeguard-${safeguardIndex}`}
                      safeguard={safeguard}
                    />
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}

        {visibleData.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sub-projects match your search.</Text>
          </View>
        ) : null}
      </View>
    </SectionCard>
  );
}

const styles = StyleSheet.create({
  sectionContent: {
    paddingTop: 14,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  summaryChip: {
    minWidth: 136,
    flexGrow: 1,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  summaryLabel: {
    color: "#64748b",
    fontSize: 12,
    fontFamily: "Jost-Regular",
  },
  summaryValue: {
    marginTop: 4,
    color: "#0f172a",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
  searchShell: {
    marginTop: 14,
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe3ec",
    backgroundColor: "#f8fafc",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: "#0f172a",
    fontSize: 15,
    fontFamily: "Jost-Regular",
    paddingVertical: 12,
  },
  sortRow: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  sortChip: {
    marginRight: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#edf2f7",
  },
  sortChipActive: {
    backgroundColor: "#0b57a4",
  },
  sortChipText: {
    color: "#334155",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  sortChipTextActive: {
    color: "#fff",
  },
  listWrap: {
    paddingTop: 8,
    gap: 14,
  },
  projectCard: {
    borderRadius: 18,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  projectTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  projectMetaWrap: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    flex: 1,
  },
  index: {
    fontFamily: "Jost-SemiBold",
    color: "#475569",
    fontSize: 12,
  },
  package: {
    fontFamily: "Jost-SemiBold",
    color: "#0b57a4",
    fontSize: 13,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillText: {
    fontSize: 11,
    fontFamily: "Jost-SemiBold",
  },
  name: {
    marginTop: 10,
    color: "#0f172a",
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Jost-SemiBold",
  },
  metricRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  metricTile: {
    minWidth: 140,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
  },
  metricTextWrap: {
    flex: 1,
  },
  metricLabel: {
    color: "#64748b",
    fontSize: 11,
    fontFamily: "Jost-Regular",
  },
  metricValue: {
    marginTop: 2,
    color: "#0f172a",
    fontSize: 14,
    fontFamily: "Jost-SemiBold",
  },
  progressBlock: {
    marginTop: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  progressLabel: {
    flex: 1,
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  progressBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  progressBadgeText: {
    fontSize: 11,
    fontFamily: "Jost-SemiBold",
  },
  progressTrack: {
    marginTop: 8,
    height: 10,
    width: "100%",
    borderRadius: 999,
    backgroundColor: "#e2e8f0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  expandRow: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#edf2f7",
  },
  expandText: {
    color: "#0b57a4",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  safeguardList: {
    marginTop: 12,
    gap: 10,
  },
  safeguardCard: {
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  safeguardHeader: {
    marginBottom: 4,
  },
  safeguardTitle: {
    color: "#0f172a",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
  },
  emptyState: {
    marginTop: 2,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#f8fafc",
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Jost-Medium",
    color: "#64748b",
    textAlign: "center",
  },
});
