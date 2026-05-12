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

const screenWidth = Dimensions.get("window").width;
const dropdownWidth = (screenHelperWidth || screenWidth) * 0.28;

// small helpers
const safeNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const toFixedStr = (v, dp = 2) => safeNum(v).toFixed(dp);
const formatCR = (v) => `${toFixedStr(v, 2)} CR`;

// Single card component (each card has its own dropdown state)
const ChartCard = ({ title, chartData = [] }) => {
  const [chartType, setChartType] = React.useState("Pie Chart");
  const chartOptions = ["Pie Chart", "Bar Chart", "Line Chart"];

  // percent helper for this dataset
  const getPercent = (value, dataset) => {
    const total = dataset.reduce((s, i) => s + safeNum(i.value), 0);
    if (total === 0) return "0.0";
    return ((safeNum(value) / total) * 100).toFixed(1);
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
    propsForLabels: {
      fontSize: 10,
      fill: "#333",
    },
  };

  // chart-kit expects numeric values; map accordingly
  const pieChartData = chartData.map((d) => ({
    name: d.name || "",
    value: safeNum(d.value),
    color: d.color || "#888",
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  const barLineData = {
    labels: chartData.map((d) => d.name || ""),
    datasets: [{ data: chartData.map((d) => safeNum(d.value)) }],
  };

  return (
    <View style={styles.card}>
      {/* header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>

        <SelectDropdown
          data={chartOptions}
          defaultValue={chartType}
          onSelect={(selected) => setChartType(selected)}
          renderDropdownIcon={(isOpened) => (
            <AntDesign name={isOpened ? "up" : "down"} size={14} color="#fff" />
          )}
          buttonStyle={[styles.dropdownBtn, { width: dropdownWidth }]}
          buttonTextStyle={styles.dropdownBtnText}
          rowTextStyle={styles.dropdownItemTxtStyle}
          dropdownStyle={styles.dropdownMenu}
        />
      </View>

      {/* chart area */}
      <View style={styles.chartWrap}>
        {chartType === "Pie Chart" && (
          <View style={styles.pieRow}>
            <PieChart
              data={pieChartData}
              width={screenWidth}
              height={200}
              chartConfig={chartConfig}
              accessor="value"
              backgroundColor="transparent"
              paddingLeft="15"
              hasLegend={false}
            />

            {/* overlay with percent labels */}
            <View style={styles.percentOverlay}>
              {pieChartData.map((d, i) => (
                <View key={i} style={styles.percentItem}>
                  <View
                    style={[styles.colorDot, { backgroundColor: d.color }]}
                  />
                  <Text style={styles.percentText}>
                    {d.name}: {getPercent(d.value, pieChartData)}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {chartType === "Bar Chart" && (
          <BarChart
            data={barLineData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            fromZero
            showValuesOnTopOfBars
          />
        )}

        {chartType === "Line Chart" && (
          <LineChart
            data={barLineData}
            width={screenWidth}
            height={200}
            chartConfig={chartConfig}
            bezier
            fromZero
          />
        )}
      </View>

      {/* table */}
      <View style={styles.table}>
        <View style={styles.tHead}>
          <Text style={[styles.th, styles.leftTh]}>Name</Text>
          <Text style={styles.th}>Value</Text>
          <Text style={styles.th}>%</Text>
        </View>

        {chartData.map((d, i) => {
          const pct = getPercent(d.value, chartData);
          return (
            <View
              key={i}
              style={[
                styles.tRow,
                i % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={[styles.tCell, styles.leftCell]}>{d.name}</Text>
              <Text style={styles.tCell}>{toFixedStr(d.value, 2)}</Text>
              <Text style={styles.tCell}>{pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const Charts = ({ data }) => {
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

  // Type of contracts distribution (labels + data arrays exist per API)
  const typeOfContracts =
    (data.type_of_contracts_distribution?.labels || []).map((label, idx) => ({
      name: label,
      value: safeNum(data.type_of_contracts_distribution?.data?.[idx]) || 0,
      color: idx % 2 === 0 ? "#3498DB" : "#F39C12",
    })) || [];

  // physical progress - might be single item
  const physical = data.department_wise_physical_progress?.[0] || {};
  const physicalData = [
    {
      name: physical?.name || "Physical",
      value: safeNum(physical?.avg_progress),
      color: "#2980B9",
    },
  ];

  // financial progress - show finance_cr vs pending_cr
  const finance = data.department_wise_financial_progress?.[0] || {};
  const financeData = [
    {
      name: "Finance (CR)",
      value: safeNum(finance?.finance_cr),
      color: "#2ECC71",
    },
    {
      name: "Pending (CR)",
      value: safeNum(finance?.pending_cr),
      color: "#E74C3C",
    },
  ];

  // Build the top table (department_contract_overview table) — mirrors screenshot layout.
  const deptTableRows = (data.department_contract_overview || []).map((d) => {
    const signed = safeNum(d.contract_signed_cr);
    const pending = safeNum(d.contract_to_be_signed_cr);
    const allocated = safeNum(d.total_amount_allocated_cr);
    const signedPct = allocated
      ? ((signed / allocated) * 100).toFixed(2)
      : "0.00";
    const pendingPct = allocated
      ? ((pending / allocated) * 100).toFixed(2)
      : "0.00";

    return {
      department: d.department || "-",
      total_projects: safeNum(d.total_projects),
      total_contracts_signed: safeNum(d.total_contracts_signed),
      total_amount_allocated_cr: allocated,
      contract_signed_cr: signed,
      contract_signed_pct: signedPct,
      contract_to_be_signed_cr: pending,
      contract_to_be_signed_pct: pendingPct,
    };
  });

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
                population: d.value,
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
          </View>

          {/* small stats on right */}
          <View style={styles.topRight}>
            <View style={styles.statRow}>
              <View style={[styles.colorDot, { backgroundColor: "#2E86DE" }]} />
              <Text style={styles.statText}>
                Contract Signed: {formatCR(dept.contract_signed_cr || 0)}
              </Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.colorDot, { backgroundColor: "#E74C3C" }]} />
              <Text style={styles.statText}>
                Remaining Budget: {formatCR(dept.contract_to_be_signed_cr || 0)}
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
                    {r.department}
                  </Text>
                  <Text style={styles.bigTd}>{r.total_projects}</Text>
                  <Text style={styles.bigTd}>{r.total_contracts_signed}</Text>
                  <Text style={styles.bigTd}>
                    {toFixedStr(r.total_amount_allocated_cr, 0)}
                  </Text>
                  <View style={[styles.bigTd, styles.verticalCenter]}>
                    <Text>{toFixedStr(r.contract_signed_cr, 2)}</Text>
                    <Text style={styles.smallPct}>
                      ({r.contract_signed_pct}%)
                    </Text>
                  </View>
                  <View style={[styles.bigTd, styles.verticalCenter]}>
                    <Text>{toFixedStr(r.contract_to_be_signed_cr, 2)}</Text>
                    <Text style={styles.smallPct}>
                      ({r.contract_to_be_signed_pct}%)
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      {/* small cards for other charts */}
      <ChartCard
        title="Type of Contracts Distribution"
        chartData={typeOfContracts}
      />
      <ChartCard
        title="Department-wise Physical Progress"
        chartData={physicalData}
      />
      <ChartCard
        title="Department-wise Financial Progress"
        chartData={financeData}
      />
    </ScrollView>
  );
};

export default Charts;

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
    minWidth: width,
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
    // paddingHorizontal: 8,
    minWidth: width,
  },
  bigTh: {
    // flex: 1,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost-Bold",
    fontSize: 13,
    width: width * 0.25,
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
    width: width * 0.25,
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
