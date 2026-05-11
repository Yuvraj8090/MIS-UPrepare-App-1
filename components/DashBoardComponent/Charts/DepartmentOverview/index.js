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
import { width } from "@/services/helper"; // keep if you already use it
import Svg, { Text as SvgText } from "react-native-svg";

const screenWidth = Dimensions.get("window").width;

// small helpers
const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toFixedStr = (v, dp = 2) => safeNum(v).toFixed(dp);
const formatCR = (v) => `${toFixedStr(v, 2)} CR`;

const DepartmentOviewCharts = ({ data }) => {
  // if caller passes null / undefined
  if (!data) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // ------------------ build datasets from API ------------------
  const dept = data?.department_contract_overview?.[0] || {};
  const totalAllocated = safeNum(dept.total_amount_allocated_cr);

  const contractOverviewData = [
    {
      name: "Contract Signed (CR)",
      value: safeNum(dept.contract_signed_cr),
      color: "#3466CC",
    },
    {
      name: "Remaining Budget (CR)",
      value: safeNum(dept.contract_to_be_signed_cr),
      color: "#DC3913",
    },
  ];

  // Build the top table (department_contract_overview table) — mirrors screenshot layout.
  const deptTableRows = (data?.department_contract_overview || []).map((d) => {
    const signed = safeNum(d?.contract_signed_cr);
    const pending = safeNum(d?.contract_to_be_signed_cr);
    const allocated = safeNum(d?.total_amount_allocated_cr);
    const signedPct = allocated
      ? ((signed / allocated) * 100).toFixed(2)
      : "0.00";
    const pendingPct = allocated
      ? ((pending / allocated) * 100).toFixed(2)
      : "0.00";

    return {
      department: d?.department || "-",
      total_projects: safeNum(d?.total_projects),
      total_contracts_signed: safeNum(d?.total_contracts_signed),
      total_amount_allocated_cr: allocated,
      contract_signed_cr: signed,
      contract_signed_pct: signedPct,
      contract_to_be_signed_cr: pending,
      contract_to_be_signed_pct: pendingPct,
    };
  });

  const WIDTH = screenWidth - 200;
  const HEIGHT = 260;

  const total = contractOverviewData.reduce((sum, d) => sum + d.value, 0);

  // Center of chart
  const centerX = WIDTH / 2;
  const centerY = HEIGHT / 2;

  // Radius values (adjust these for better visuals)
  const outerR = 50; // pie outer radius
  const innerR = 50; // donut inner radius (if your chart is donut-like)
  const labelR = (outerR + innerR) / 2; // place text in middle thickness

  let startAngle = -90;

  return (
    <ScrollView style={styles.container}>
      {/* CONTRACT OVERVIEW card + table (top) */}
      <View style={styles.topCard}>
        <Text style={styles.topTitle}>Department Contract Overview</Text>

        <View style={styles.topContent}>
          {/* Pie */}
          <View style={{ flex: 1 }}>
            <PieChart
              data={contractOverviewData.map((d) => ({
                ...d,
                population: d?.value,
              }))}
              width={screenWidth - 40}
              height={260}
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              }}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={false}
            />

            {/* <Svg
              width={WIDTH}
              height={HEIGHT}
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              {contractOverviewData.map((slice, index) => {
                const value = slice.value;
                const percentage = ((value / total) * 100).toFixed(1);

                const sliceAngle = (value / total) * 360;
                const midAngle = startAngle + sliceAngle / 2;
                const rad = (midAngle * Math.PI) / 180;

                const x = centerX + labelR * Math.cos(rad);
                const y = centerY + labelR * Math.sin(rad);

                startAngle += sliceAngle;

                return (
                  <SvgText
                    key={index}
                    x={x}
                    y={y}
                    fill="#fff" // white text inside slices
                    fontSize="14"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontWeight="bold"
                  >
                    {percentage}%
                  </SvgText>
                );
              })}
            </Svg> */}
          </View>

          {/* small stats on right */}
          <View style={styles.topRight}>
            <View style={styles.statRow}>
              <View style={[styles.colorDot, { backgroundColor: "#2E86DE" }]} />
              <Text style={styles.statText}>
                Contract Signed: {formatCR(dept?.contract_signed_cr || 0)}
              </Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.colorDot, { backgroundColor: "#E74C3C" }]} />
              <Text style={styles.statText}>
                Remaining Budget:{" "}
                {formatCR(dept?.contract_to_be_signed_cr || 0)}
              </Text>
            </View>
          </View>
        </View>

        {/* department table */}
        <ScrollView horizontal>
          <ScrollView>
            <View style={styles.bigTable}>
              <View style={styles.bigThead}>
                <Text style={[styles.bigTh, { flex: 2 }]}>Department</Text>
                <Text style={styles.bigTh}>Total No. of Projects</Text>
                <Text style={styles.bigTh}>Total No. of Contracts Signed</Text>
                <Text style={styles.bigTh}>Total Amount Allocated (CR)</Text>
                <Text style={styles.bigTh}>Contract Signed Value (CR)</Text>
                <Text style={styles.bigTh}>Contract to be Signed (CR)</Text>
              </View>

              {deptTableRows?.map((r, i) => (
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
                      { flex: 2, color: "#10621E", fontWeight: "700" },
                    ]}
                  >
                    {r?.department}
                  </Text>
                  <Text style={styles.bigTd}>{r?.total_projects}</Text>
                  <Text style={styles.bigTd}>{r?.total_contracts_signed}</Text>
                  <Text style={styles.bigTd}>
                    {toFixedStr(r?.total_amount_allocated_cr, 0)}
                  </Text>
                  <View style={[styles.bigTd, styles.verticalCenter]}>
                    <Text>{toFixedStr(r?.contract_signed_cr, 2)}</Text>
                    <Text style={styles.smallPct}>
                      ({r?.contract_signed_pct}%)
                    </Text>
                  </View>
                  <View style={[styles.bigTd, styles.verticalCenter]}>
                    <Text>{toFixedStr(r?.contract_to_be_signed_cr, 2)}</Text>
                    <Text style={styles.smallPct}>
                      ({r?.contract_to_be_signed_pct}%)
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default DepartmentOviewCharts;

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
