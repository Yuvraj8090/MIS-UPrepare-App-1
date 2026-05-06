import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";

import SectionCard from "@/components/UI/SectionCard";

const screenWidth = Dimensions.get("window").width;
const chartWidth = Math.min(screenWidth - 56, 360);

const safeNum = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const DepartmentPhysicalCharts = ({ data }) => {
  if (!data) {
    return null;
  }

  const departmentRows = data?.department_wise_physical_progress || [];
  const colors = [
    "#2980B9",
    "#27AE60",
    "#8E44AD",
    "#E67E22",
    "#C0392B",
    "#16A085",
    "#2C3E50",
    "#D35400",
  ];

  const chartData = departmentRows.map((item, index) => ({
    name: item?.name || "-",
    population: safeNum(item?.avg_progress),
    color: colors[index % colors.length],
  }));

  return (
    <SectionCard title="Department-wise Physical Progress">
      <View style={styles.chartBlock}>
        <View style={styles.chartStage}>
          <LineChart
            data={{
              labels: chartData.map((item) => item.name),
              datasets: [
                {
                  data: chartData.map((item) => safeNum(item.population)),
                  color: () => "#16a34a",
                  strokeWidth: 3,
                },
              ],
            }}
            width={chartWidth}
            height={240}
            fromZero
            bezier
            withInnerLines={false}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(22, 163, 74, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
              propsForDots: {
                r: "4",
                strokeWidth: "2",
                stroke: "#16a34a",
                fill: "#ffffff",
              },
              propsForBackgroundLines: {
                stroke: "#e2e8f0",
              },
              propsForLabels: {
                fontSize: 11,
              },
            }}
            style={styles.chartCanvas}
          />
        </View>

        <View style={styles.legendList}>
          {chartData.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {safeNum(item.population).toFixed(2)}%
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
            <Text style={styles.tableHeadCell}>Avg Physical Progress %</Text>
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
              <Text style={styles.tableCell}>{safeNum(row.population).toFixed(2)}%</Text>
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
  chartCanvas: {
    borderRadius: 12,
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
    minWidth: 420,
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
    width: 160,
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
    width: 160,
    paddingHorizontal: 12,
    paddingVertical: 14,
    textAlign: "center",
    color: "#0f172a",
    fontFamily: "Jost-Regular",
    fontSize: 13,
  },
  departmentText: {
    color: "#10621E",
    fontFamily: "Jost-SemiBold",
    textAlign: "left",
  },
});

export default DepartmentPhysicalCharts;
