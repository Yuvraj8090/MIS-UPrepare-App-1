import { getNestedPercentFilter, width } from "@/services/helper";
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Linking,
  Alert,
  Platform,
  LayoutAnimation,
  UIManager,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { layoutAnimationPresets } from "@/constants/animations";

// const data = [
//   {
//     id: 11,
//     contract_id: 5,
//     name: "24M Span Intermediate lane motor bridge & its approach in Km-2 of Ujjawalpur to Gwad Dungri Jaspur Motor Road in Block Karnprayag",
//     package_number: "09/BR/RFB-EPC/UGRIDP/2023",
//     contract_value: 37000000,
//     finance_percent: 34.28,
//     physical_percent: 23,
//     safeguards: [
//       {
//         id: 1,
//         compliance: "Environmental",
//         phases: [
//           { id: 1, phase: "Pre Construction", percent: 17.86 },
//           { id: 2, phase: "During Construction", percent: 3.65 },
//         ],
//       },
//       {
//         id: 2,
//         compliance: "Social",
//         phases: [
//           { id: 1, phase: "Pre Construction", percent: 0 },
//           { id: 2, phase: "During Construction", percent: 0.17 },
//         ],
//       },
//     ],
//   },
//   {
//     id: 12,
//     contract_id: 5,
//     name: "Construction of 48M Span intermediate lane Motor Bridge & its approach over Meeng Gadera in Km-1 of Gadhani Motor Road in Block Narayanbagar",
//     package_number: "09/BR/RFB-EPC/UGRIDP/2023",
//     contract_value: 37000000,
//     finance_percent: 37.83,
//     physical_percent: 0,
//     safeguards: [
//       {
//         id: 1,
//         compliance: "Environmental",
//         phases: [
//           { id: 1, phase: "Pre Construction", percent: 0 },
//           { id: 2, phase: "During Construction", percent: 0 },
//         ],
//       },
//       {
//         id: 2,
//         compliance: "Social",
//         phases: [
//           { id: 1, phase: "Pre Construction", percent: 0 },
//           { id: 2, phase: "During Construction", percent: 0.86 },
//         ],
//       },
//     ],
//   },
// ];

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
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

export default function ProjectList({ data }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // asc | desc
  const [filter, setFilter] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "desc",
  });

  const colorScale = (v) => {
    if (v >= 60) return "#1fa750"; // green
    if (v >= 30) return "#f0ad4e"; // yellow
    return "#d9534f"; // red
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "desc" }; // default direction
    });
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const valA = getNestedPercentFilter(a, sortConfig.key);
      const valB = getNestedPercentFilter(b, sortConfig.key);

      return sortConfig.direction === "asc" ? valA - valB : valB - valA;
    });
  }, [data, sortConfig]);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(layoutAnimationPresets.standard);
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderProgress = (label, value) => (
    <View key={label} style={styles.progressRow}>
      <Text style={{ flex: 1, fontFamily: "Jost-Medium" }}>{label}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${value}%`, backgroundColor: colorScale(value) },
          ]}
        />
      </View>
      <Text style={{ width: 55, textAlign: "right" }}>{value.toFixed(2)}%</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    const isOpen = expandedCards[item?.id];
    return (
      <View style={styles.card}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={styles.index}>#{index + 1} -</Text>
          <Text style={styles.package}>{item?.package_number}</Text>
        </View>
        <Text style={styles.name}>{item?.name}</Text>
        <Text style={styles.value}>
          Contract Value ₹ {item?.contract_value.toLocaleString()}
        </Text>

        {renderProgress("Physical Progress", item?.physical_percent || 0)}
        {renderProgress("Finance Progress", item?.finance_percent || 0)}

        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <Text style={styles.safeguardToggle}>
            Safeguards {isOpen ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>

        {isOpen &&
          item?.safeguards?.map((sg, i) => (
            <View key={i} style={styles.safeBox}>
              <View style={styles.safeTitleRow}>
                {sg.compliance === "Environmental" ? (
                  <MaterialCommunityIcons
                    name="leaf-circle-outline"
                    size={18}
                    color="#1fa750"
                  />
                ) : (
                  <Ionicons name="people-outline" size={18} color="#2563eb" />
                )}
                <Text style={styles.safeTitle}>{sg.compliance}</Text>
              </View>

              {sg?.phases?.map((p) => renderProgress(p.phase, p.percent || 0))}
            </View>
          ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={styles.headerBox}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={20}
            color="#ffffff"
          />
          <Text style={styles.headerTitle}>Package SubProject Progress</Text>
        </View>
      </View>

      {/* Search */}
      <TextInput
        style={styles.search}
        placeholder="Search by Package / Name"
        value={search}
        onChangeText={setSearch}
      />

      {/* Sorting Buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sortContainer}
      >
        {sortButtons?.map((btn, i) => {
          const isActive = sortConfig.key === btn.key;
          const arrow = isActive
            ? sortConfig.direction === "asc"
              ? "▲"
              : "▼"
            : "";

          return (
            <TouchableOpacity
              key={i}
              onPress={() => handleSort(btn.key)}
              style={[styles.sortBtn, isActive && styles.activeSortBtn]}
            >
              <Text
                style={[styles.sortText, isActive && styles.activeSortText]}
              >
                {btn.label} {arrow}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {sortConfig?.key && (
        <Text style={styles.sortStatus}>
          Sorting by: {sortButtons.find((o) => o.key === sortConfig.key)?.label}{" "}
          ({sortConfig.direction.toUpperCase()})
        </Text>
      )}

      <View
        style={{
          width: width,
          position: "relative",
          left: -10,
          height: 1,
          backgroundColor: "#ccc",
          marginVertical: 10,
        }}
      />

      {/* List */}
      <FlatList
        data={sortedData}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 14 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    backgroundColor: "#fff",
    margin: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "Jost-Medium",
  },

  headerBox: {
    backgroundColor: "#0275d8",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 10,

    // shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Jost-Bold",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  sortContainer: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  sortBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#E7E7E7",
    borderRadius: 20,
    marginRight: 8,
  },
  activeSortBtn: {
    backgroundColor: "#007bff",
  },
  sortText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 13,
  },
  activeSortText: {
    color: "#fff",
  },
  sortStatus: {
    margin: 6,
    color: "#007bff",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,

    // ANDROID shadow
    elevation: 5,

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    width: width * 0.95,
    alignSelf: "center",
  },
  index: { fontFamily: "Jost-SemiBold" },
  package: { fontFamily: "Jost-SemiBold", color: "#007bff", fontSize: 15 },
  name: { marginVertical: 4, fontSize: 13, fontFamily: "Jost-Medium" },
  value: { fontFamily: "Jost-SemiBold", marginBottom: 6 },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  progressBar: {
    height: 8,
    flex: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 6,
    borderRadius: 4,
  },
  progressFill: { height: "100%", borderRadius: 4 },

  safeguardToggle: {
    color: "#000",
    marginTop: 6,
    fontFamily: "Jost-SemiBold",
    paddingVertical: 4,
  },

  safeBox: {
    padding: 6,
    backgroundColor: "#f8f8f8",
    borderRadius: 6,
    marginTop: 6,
  },
  safeTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  safeTitle: { fontFamily: "Jost-Medium" },
});
