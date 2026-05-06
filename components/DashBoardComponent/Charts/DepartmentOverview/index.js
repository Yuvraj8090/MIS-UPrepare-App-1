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

const toFixedStr = (value, digits = 2) => safeNum(value).toFixed(digits);
const formatCR = (value) => `${toFixedStr(value, 2)} CR`;

const DepartmentOviewCharts = ({ data }) => {
  if (!data) {
    return null;
  }

  const overviewRows = data?.department_contract_overview || [];
  const totals = overviewRows.reduce(
    (acc, item) => ({
      allocated: acc.allocated + safeNum(item?.total_amount_allocated_cr),
      signed: acc.signed + safeNum(item?.contract_signed_cr),
      pending: acc.pending + safeNum(item?.contract_to_be_signed_cr),
    }),
    { allocated: 0, signed: 0, pending: 0 }
  );

  const contractOverviewData = [
    {
      name: "Contract Signed",
      population: totals.signed,
      color: "#3466CC",
      legendFontColor: "#334155",
      legendFontSize: 12,
    },
    {
      name: "Remaining Budget",
      population: totals.pending,
      color: "#DC3913",
      legendFontColor: "#334155",
      legendFontSize: 12,
    },
  ];

  const deptTableRows = overviewRows.map((item) => {
    const allocated = safeNum(item?.total_amount_allocated_cr);
    const signed = safeNum(item?.contract_signed_cr);
    const pending = safeNum(item?.contract_to_be_signed_cr);

    return {
      department: item?.department || "-",
      totalProjects: safeNum(item?.total_projects),
      totalContracts: safeNum(item?.total_contracts_signed),
      allocated,
      signed,
      pending,
      signedPct: allocated ? ((signed / allocated) * 100).toFixed(2) : "0.00",
      pendingPct: allocated ? ((pending / allocated) * 100).toFixed(2) : "0.00",
    };
  });

  return (
    <SectionCard title="Department Contract Overview">
      <View style={styles.chartBlock}>
        <View style={styles.chartStage}>
          <PieChart
            widthAndHeight={chartSize}
            series={contractOverviewData.map((item) => ({
              value: safeNum(item.population),
              color: item.color,
            }))}
            cover={{ radius: 0.58, color: "#ffffff" }}
            style={styles.donutChart}
          />
          <View style={styles.donutCenter}>
            <Text style={styles.donutCenterLabel}>Allocated CR</Text>
            <Text style={styles.donutCenterValue}>
              {toFixedStr(totals.allocated, 0)}
            </Text>
          </View>
        </View>

        <View style={styles.legendList}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#3466CC" }]} />
            <Text style={styles.legendText}>
              Contract Signed: {formatCR(totals.signed)}
            </Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: "#DC3913" }]} />
            <Text style={styles.legendText}>
              Remaining Budget: {formatCR(totals.pending)}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadCell, styles.departmentColumn]}>
              Department
            </Text>
            <Text style={styles.tableHeadCell}>Projects</Text>
            <Text style={styles.tableHeadCell}>Contracts</Text>
            <Text style={styles.tableHeadCell}>Allocated</Text>
            <Text style={styles.tableHeadCell}>Signed</Text>
            <Text style={styles.tableHeadCell}>Pending</Text>
          </View>

          {deptTableRows.map((row, index) => (
            <View
              key={`${row.department}-${index}`}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={[styles.tableCell, styles.departmentColumn, styles.departmentText]}>
                {row.department}
              </Text>
              <Text style={styles.tableCell}>{row.totalProjects}</Text>
              <Text style={styles.tableCell}>{row.totalContracts}</Text>
              <Text style={styles.tableCell}>{toFixedStr(row.allocated, 0)}</Text>
              <View style={styles.metricCell}>
                <Text style={styles.metricValue}>{toFixedStr(row.signed, 2)}</Text>
                <Text style={styles.metricPct}>({row.signedPct}%)</Text>
              </View>
              <View style={styles.metricCell}>
                <Text style={styles.metricValue}>{toFixedStr(row.pending, 2)}</Text>
                <Text style={styles.metricPct}>({row.pendingPct}%)</Text>
              </View>
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
    minWidth: 760,
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
    width: 120,
    paddingHorizontal: 10,
    paddingVertical: 14,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost-Bold",
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  departmentColumn: {
    width: 160,
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
    width: 120,
    paddingHorizontal: 10,
    paddingVertical: 14,
    textAlign: "center",
    color: "#0f172a",
    fontFamily: "Jost-Regular",
    fontSize: 13,
  },
  departmentText: {
    color: "#10621E",
    fontFamily: "Jost-SemiBold",
  },
  metricCell: {
    width: 120,
    paddingHorizontal: 8,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  metricValue: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#0f172a",
  },
  metricPct: {
    marginTop: 2,
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
});

export default DepartmentOviewCharts;
