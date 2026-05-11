import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

import SectionCard from "@/components/UI/SectionCard";

const screenWidth = Dimensions.get("window").width;
const chartSize = Math.min(screenWidth - 88, 260);

const safeNum = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const DepartmentFinancialCharts = ({ data }) => {
  if (!data) {
    return null;
  }

  const financialRows = data?.department_wise_financial_progress || [];
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

  const chartData = financialRows.map((item, index) => ({
    name: item?.name || "-",
    budgetCr: safeNum(item?.budget) / 10000000,
    contractCr: safeNum(item?.contract_cr),
    financeCr: safeNum(item?.finance_cr),
    pendingCr: safeNum(item?.pending_cr),
    financePercentage: safeNum(item?.finance_percentage),
    color: colors[index % colors.length],
  }));

  const totalFinanceCr = chartData.reduce(
    (sum, item) => sum + safeNum(item.financeCr),
    0
  );

  return (
    <SectionCard title="Department-wise Financial Progress">
      <View style={styles.chartBlock}>
        <View style={styles.chartStage}>
          <PieChart
            widthAndHeight={chartSize}
            series={chartData.map((item) => ({
              value: Math.max(safeNum(item.financeCr), 0.01),
              color: item.color,
            }))}
            cover={{ radius: 0.62, color: "#ffffff" }}
            style={styles.donutChart}
          />
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterLabel}>Spent CR</Text>
            <Text style={styles.donutCenterValue}>
              {totalFinanceCr.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={styles.legendList}>
          {chartData.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.financeCr.toFixed(2)} CR ({item.financePercentage.toFixed(2)}%)
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadCell, styles.departmentColumn]}>
              Department
            </Text>
            <Text style={styles.tableHeadCell}>Budget</Text>
            <Text style={styles.tableHeadCell}>Contract</Text>
            <Text style={styles.tableHeadCell}>Spent</Text>
            <Text style={styles.tableHeadCell}>Pending</Text>
            <Text style={styles.tableHeadCell}>Finance %</Text>
          </View>

          {chartData.map((row, index) => (
            <View
              key={`${row.name}-${index}`}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={[styles.tableCell, styles.departmentColumn, styles.departmentText]}>
                {row.name}
              </Text>
              <Text style={styles.tableCell}>{row.budgetCr.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{row.contractCr.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{row.financeCr.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{row.pendingCr.toFixed(2)}</Text>
              <Text style={styles.tableCell}>{row.financePercentage.toFixed(2)}%</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SectionCard>
  );
};

const styles = StyleSheet.create({
  chartBlock: {
    alignItems: "center",
    gap: 8,
  },
  chartStage: {
    width: "100%",
    minHeight: 248,
    alignItems: "center",
    justifyContent: "center",
  },
  donutChart: {
    alignSelf: "center",
  },
  donutCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenterLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#64748b",
  },
  donutCenterValue: {
    marginTop: 2,
    fontFamily: "Jost-Bold",
    fontSize: 22,
    color: "#0f172a",
  },
  legendList: {
    width: "100%",
    gap: 10,
    marginTop: -8,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
    marginTop: 4,
  },
  legendText: {
    flex: 1,
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    lineHeight: 20,
    color: "#334155",
  },
  table: {
    minWidth: 860,
    borderWidth: 1,
    borderColor: "#dbe7da",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#28A745",
  },
  tableHeadCell: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost-Bold",
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  departmentColumn: {
    width: 260,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowEven: {
    backgroundColor: "#f6fbf6",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
  tableCell: {
    width: 150,
    paddingHorizontal: 12,
    paddingVertical: 14,
    textAlign: "center",
    color: "#0f172a",
    fontFamily: "Jost-Regular",
    fontSize: 13,
  },
  departmentText: {
    color: "#0A5B92",
    fontFamily: "Jost-SemiBold",
    textAlign: "left",
  },
});

export default DepartmentFinancialCharts;
