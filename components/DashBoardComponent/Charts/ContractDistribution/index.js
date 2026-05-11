import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

import SectionCard from "@/components/UI/SectionCard";

const screenWidth = Dimensions.get("window").width;
const chartWidth = Math.min(screenWidth - 56, 360);

const safeNum = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const ContractsDistributaionCharts = ({ data }) => {
  if (!data) {
    return null;
  }

  const palette = ["#3466CC", "#17A589", "#DC3913", "#2E86C1", "#C0392B"];
  const labels = data?.type_of_contracts_distribution?.labels || [];
  const values = data?.type_of_contracts_distribution?.data || [];

  const typeOfContracts = labels.map((label, index) => ({
    name: label,
    population: safeNum(values[index]),
    color: palette[index % palette.length],
    legendFontColor: "#334155",
    legendFontSize: 12,
  }));

  const rows = data?.type_of_contracts_distribution?.rows || [];

  return (
    <SectionCard title="Type of Contracts Distribution">
      <View style={styles.chartBlock}>
        <View style={styles.chartStage}>
          <BarChart
            data={{
              labels: typeOfContracts.map((item) => item.name),
              datasets: [
                {
                  data: typeOfContracts.map((item) => safeNum(item.population)),
                },
              ],
            }}
            width={chartWidth}
            height={240}
            fromZero
            showValuesOnTopOfBars
            withInnerLines={false}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              barPercentage: 0.65,
              color: (opacity = 1) => `rgba(11, 87, 164, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(51, 65, 85, ${opacity})`,
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
          {typeOfContracts.map((item) => (
            <View key={item.name} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>
                {item.name}: {item.population}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeadCell, styles.typeColumn]}>
              Procurement Type
            </Text>
            <Text style={styles.tableHeadCell}>No. of Packages</Text>
          </View>

          {rows.map((row, index) => (
            <View
              key={`${row?.[0]?.text || "row"}-${index}`}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}
            >
              <Text style={[styles.tableCell, styles.typeColumn, styles.typeText]}>
                {row?.[0]?.text || "-"}
              </Text>
              <Text style={styles.tableCell}>{safeNum(row?.[1])}</Text>
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
    width: 140,
    paddingHorizontal: 12,
    paddingVertical: 14,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Jost-Bold",
    fontSize: 13,
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.2)",
  },
  typeColumn: {
    width: 280,
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
    width: 140,
    paddingHorizontal: 12,
    paddingVertical: 14,
    textAlign: "center",
    color: "#0f172a",
    fontFamily: "Jost-Regular",
    fontSize: 13,
  },
  typeText: {
    color: "#10621E",
    fontFamily: "Jost-SemiBold",
    textAlign: "left",
  },
});

export default ContractsDistributaionCharts;
