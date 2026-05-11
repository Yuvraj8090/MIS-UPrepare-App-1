// Charts.js
import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { PieChart, BarChart, LineChart } from "react-native-chart-kit";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { width as screenHelperWidth, width } from "@/services/helper"; // keep if you already use it
import Svg from "react-native-svg";

const screenWidth = Dimensions.get("window").width;
const dropdownWidth = (screenHelperWidth || screenWidth) * 0.28;

// small helpers
const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toFixedStr = (v, dp = 2) => safeNum(v).toFixed(dp);
const formatCR = (v) => `${toFixedStr(v, 2)} CR`;

const ContractsDistributaionCharts = ({ data }) => {
  // if caller passes null / undefined
  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const typeDist = data?.type_of_contracts_distribution;

  const palette = ["#3466CC", "#17A589", "#DC3913", "#2E86C1", "#C0392B"];
  const typeOfContracts =
    (data.type_of_contracts_distribution?.labels || []).map((label, idx) => ({
      name: label,
      value: safeNum(data.type_of_contracts_distribution?.data?.[idx]) || 0,
      color: palette[idx % palette.length],
    })) || [];

  console.log("TYPEPPE ;", typeOfContracts);

  const total = typeOfContracts.reduce((sum, d) => sum + d.value, 0);

  // Helper to convert angle to x,y position
  const getCoordinatesForAngle = (angle, radius) => {
    const x = radius * Math.cos(angle) + radius;
    const y = radius * Math.sin(angle) + radius;
    return { x, y };
  };

  let lastAngle = 0;
  const radius = 100; // adjust based on size

  const Labels = ({ slices }) =>
    slices.map((slice, index) => {
      const { pieCentroid, data } = slice;
      const percent = ((data.value / total) * 100).toFixed(1) + "%";

      return (
        <SvgText
          key={index}
          x={pieCentroid[0]}
          y={pieCentroid[1]}
          fill="white"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={12}
          fontWeight="bold"
        >
          {percent}
        </SvgText>
      );
    });

  return (
    <ScrollView style={styles.container}>
      {/* CONTRACT OVERVIEW card + table (top) */}
      <View style={styles.topCard}>
        <Text style={styles.topTitle}>Type of Contracts Distribution</Text>

        <View style={styles.topContent}>
          {/* Pie */}
          <View style={{ flex: 1 }}>
            <PieChart
              data={typeOfContracts.map((d) => ({
                ...d,
                population: d.value,
              }))}
              width={screenWidth - 40}
              height={260}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={false}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
            />
          </View>

          {/* small stats on right */}
          <View style={styles.topRight}>
            {typeOfContracts?.map((item, i) => (
              <View style={styles.statRow} key={i}>
                <View
                  style={[styles.colorDot, { backgroundColor: item?.color }]}
                />
                <Text style={styles.statText}>
                  {item?.name}: {item?.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* department table */}
        <ScrollView horizontal>
          <View style={styles.bigTable}>
            <View style={styles.bigThead}>
              <Text style={[styles.bigTh]}>Procurement Type</Text>
              <Text style={styles.bigTh}>No. of Packages</Text>
            </View>

            {typeDist?.rows?.map((r, i) => {
              const contract = r[0];
              const count = r[1];
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => Linking.openURL(contract?.url)}
                >
                  <View
                    style={[
                      styles.bigTrow,
                      i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                    ]}
                  >
                    <Text
                      style={[
                        styles.bigTd,
                        { flex: 2, color: "#0A4D68", fontWeight: "700" },
                      ]}
                    >
                      {contract?.text}
                    </Text>
                    <Text style={styles.bigTd}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default ContractsDistributaionCharts;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#eef1f4" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  // top big contract overview card
  topCard: {
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    // padding: 12,
    elevation: 4,
    overflow: "hidden",
  },
  topTitle: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#fff",
    backgroundColor: "#28A745",
    padding: 12,
    // borderRadius: 4,
    alignSelf: "stretch",
  },
  topContent: {
    flexDirection: "row",
    marginTop: 12,
    padding: 10,
    // alignItems: "center",
    // justifyContent: "space-between",
  },
  topRight: {
    width: 150,
    // marginLeft: 10,
    // justifyContent: "center",
    position: "relative",
    top: 10,
  },
  statRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  statText: {
    marginLeft: 8,
    fontFamily: "Jost-SemiBold",
    color: "#333",
    fontSize: 14,
  },

  // big table styles
  bigTable: {
    // minWidth: width,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#dfe7de",
    borderRadius: 6,
    overflow: "hidden",
  },
  bigThead: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    paddingVertical: 10,
    // justifyContent: "space-between",
    // paddingHorizontal: 8,
    // minWidth: width,
  },
  bigTh: {
    // flex: 1,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost-Bold",
    fontSize: 13,
    width: width * 0.45,
    marginHorizontal: 2,
    borderRightWidth: 1,
    borderColor: "#eef6ee",
  },
  bigTrow: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eef6ee",
    alignItems: "center",
    // width: width * 0.2,
  },
  bigTd: {
    width: width * 0.45,
    textAlign: "center",
    color: "#0b3b12",
  },
  smallPct: { fontSize: 12, color: "#6b6b6b" },

  // mini chart card
  card: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#28A745",
    padding: 10,
    alignItems: "center",
  },
  headerText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdownBtnText: { fontSize: 13, color: "#000" },
  dropdownMenu: { borderRadius: 6, elevation: 4 },

  chartWrap: { padding: 10, alignItems: "center" },

  pieRow: { width: "100%", alignItems: "center", justifyContent: "center" },
  percentOverlay: {
    position: "absolute",
    right: 18,
    top: 60,
    backgroundColor: "transparent",
    padding: 6,
    borderRadius: 6,
  },
  percentItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  percentText: { marginLeft: 6, color: "#222", fontSize: 12 },
  colorDot: { width: 10, height: 10, borderRadius: 4 },

  // small table inside card
  table: {
    margin: 10,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 6,
    overflow: "hidden",
  },
  tHead: {
    flexDirection: "row",
    backgroundColor: "#28A745",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  th: { flex: 1, color: "#fff", textAlign: "center", fontWeight: "700" },
  leftTh: { textAlign: "left", paddingLeft: 10 },

  tRow: { flexDirection: "row", paddingVertical: 10, paddingHorizontal: 6 },
  tCell: { flex: 1, textAlign: "center", color: "#333" },
  leftCell: { textAlign: "left", paddingLeft: 10 },

  rowEven: { backgroundColor: "#f7fff7" },
  rowOdd: { backgroundColor: "#fff" },

  // small helpers
  verticalCenter: { alignItems: "center" },
});
