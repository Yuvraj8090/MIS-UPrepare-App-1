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
import { PieChart } from "react-native-chart-kit";

import { width } from "@/services/helper";

const screenWidth = Dimensions.get("window").width;

// small helpers
const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toFixedStr = (v, dp = 2) => safeNum(v).toFixed(dp);
const formatCR = (v) => `${toFixedStr(v, 2)} CR`;

const DepartmentFinancialCharts = ({ data }) => {
  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const financialList = data.department_wise_financial_progress || [];

  const colors = [
    "#E67E22",
    "#27AE60",
    "#8E44AD",
    "#2980B9",
    "#C0392B",
    "#16A085",
    "#2C3E50",
    "#D35400",
  ];

  // Clean minimal data
  const financialData = financialList.map((item, index) => ({
    id: item.id,
    name: item.name,
    finance_cr: safeNum(item.finance_cr),
    finance_percentage: safeNum(item.finance_percentage),
    color: colors[index % colors.length],
  }));

  return (
    <ScrollView style={styles.container}>
      <View style={styles.topCard}>
        <Text style={styles.topTitle}>Department-wise Financial Progress</Text>

        <View style={styles.topContent}>
          {/* Pie Chart */}
          <View style={{ flex: 1 }}>
            <PieChart
              data={financialData.map((d) => ({
                name: d.name,
                population: d.finance_percentage, // only % for pie
                color: d.color,
                legendFontColor: "#000",
                legendFontSize: 12,
              }))}
              width={screenWidth - 40}
              height={260}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={false}
            />
          </View>

          {/* Right side mini stats */}
          <View style={styles.topRight}>
            {financialData.map((item, i) => (
              <View style={styles.statRow} key={i}>
                <View
                  style={[styles.colorDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.statText}>
                  {item.name}: {item.finance_percentage.toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Simple table */}
        <ScrollView horizontal>
          <View style={styles.bigTable}>
            <View style={styles.bigThead}>
              <Text style={[styles.bigTh, { flex: 1.6 }]}>Department</Text>
              <Text style={styles.bigTh}>Finance (CR)</Text>
              <Text style={styles.bigTh}>Finance %</Text>
            </View>

            {financialData.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.bigTrow,
                  i % 2 === 0 ? styles.rowEven : styles.rowOdd,
                ]}
              >
                <Text
                  style={[
                    styles.bigTd,
                    { flex: 1.6, color: "#0A5B92", fontWeight: "700" },
                  ]}
                >
                  {r.name}
                </Text>

                <Text style={styles.bigTd}>{r.finance_cr}</Text>
                <Text style={styles.bigTd}>
                  {r.finance_percentage.toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default DepartmentFinancialCharts;

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
