import CustomHeader from "@/components/AppHeader/CustomHeader";
import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import { convertToCr } from "@/services/helper";

// ----- SAMPLE DATA (the API payload you provided) -----
const SAMPLE_PROJECT = {
  id: 1,
  package_name:
    "Construction of 50 M Intermediate Lane Steel Truss Motor Bridge in Uttarkashi- Lambgaon Ghansali- Tilwara Motor Road KM-98 near Hanuman Temple, Block-Bhilangna, District Tehri",
  status: null,
  estimated_budget_incl_gst: "65468476.00",
  department: "PIU-PWD",
  category: "Works",
  sub_category: "Bridge",
  contracts: [
    {
      id: 23,
      contract_number: "18/UPREPARE/01/BR/RFB/UGRIDP/2023",
      contract_value: "72041848.00",
      contractor: "M/S DOON INFRASTRUCTURE",
      signing_date: "2025-08-29",
      commencement_date: "2025-09-07",
      initial_completion_date: "2026-12-06",
      revised_completion_date: "2026-12-06",
      actual_completion_date: "2026-12-06",
      sub_projects: [
        {
          id: 37,
          name: "Construction of 50 M Intermediate Lane Steel Truss Motor Bridge in Uttarkashi- Lambgaon Ghansali- Tilwara Motor Road KM-98 near Hanuman Temple, Block-Bhilangna, District Tehri",
          contract_value: "72041848.00",
          lat: null,
          long: null,
          physical_progress: 0,
          financial_progress: 0,
          total_finance_amount: 0,
        },
      ],
    },
  ],
};

// ----- Small reusable UI pieces -----
const Label = ({ label, value }) => (
  <View style={styles.labelRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value ?? "-"}</Text>
  </View>
);

const StatPill = ({ title, value }) => (
  <View style={styles.pill}>
    <Text style={styles.pillTitle}>{title}</Text>
    <Text style={styles.pillValue}>{value}</Text>
  </View>
);

const ProgressBar = ({ percent = 0 }) => {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  return (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${clamped}%` }]} />
      <Text style={styles.progressText}>{clamped}%</Text>
    </View>
  );
};

const ContractCard = ({ contract }) => {
  // derive combined progress from sub_projects (average)
  const { sub_projects = [] } = contract;
  const { physical_progress, financial_progress } = useMemo(() => {
    if (!sub_projects?.length)
      return { physical_progress: 0, financial_progress: 0 };
    const phys =
      sub_projects?.reduce((s, sp) => s + (sp?.physical_progress || 0), 0) /
      sub_projects?.length;
    const fin =
      sub_projects?.reduce((s, sp) => s + (sp?.financial_progress || 0), 0) /
      sub_projects?.length;
    return { physical_progress: phys, financial_progress: fin };
  }, [sub_projects]);

  return (
    <View style={styles.contractCard}>
      <View style={styles.contractHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.contractTitle}>{contract?.contractor}</Text>
          <Text style={styles.contractSub}>{contract?.contract_number}</Text>
        </View>
        <Text style={styles.contractValue}>
          {convertToCr(contract?.contract_value)}
        </Text>
      </View>

      <View style={styles.contractBody}>
        <Label label="Signing" value={formatDate(contract?.signing_date)} />
        <Label
          label="Commence"
          value={formatDate(contract?.commencement_date)}
        />
        <Label
          label="Initial Complete"
          value={formatDate(contract?.initial_completion_date)}
        />
        <Label
          label="Revised Complete"
          value={formatDate(contract?.revised_completion_date)}
        />
      </View>

      {/* <View style={{ marginTop: 12 }}>
        <Text style={styles.subHeader}>Progress</Text>
        <Text style={styles.smallText}>Physical</Text>
        <ProgressBar percent={physical_progress} />
        <Text style={[styles.smallText, { marginTop: 8 }]}>Financial</Text>
        <ProgressBar percent={financial_progress} />
      </View> */}
    </View>
  );
};

// ----- Utilities -----
function numberWithCommas(x) {
  if (x === null || x === undefined) return "-";
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatDate(s) {
  if (!s) return "-";
  // keep ISO-ish YYYY-MM-DD -> show as DD MMM YYYY
  try {
    const d = new Date(s);
    return d.toLocaleDateString();
  } catch (e) {
    return s;
  }
}

// ----- Main Screen -----
const ProjectDetailsScreen = (props) => {
  const project = props && props?.route?.params && props?.route?.params?.data;

  // aggregate quick stats
  const totalContractValue = project?.contracts
    ? project?.contracts?.reduce(
        (s, c) => s + Number(c?.contract_value || 0),
        0
      )
    : 0;

  const avgPhysical =
    project?.contracts && project?.contracts.length
      ? Math.round(
          project?.contracts?.reduce((s, c) => {
            const subs = c?.sub_projects || [];
            const avg = subs?.length
              ? subs?.reduce((ss, sp) => ss + (sp?.physical_progress || 0), 0) /
                subs?.length
              : 0;
            return s + avg;
          }, 0) / project?.contracts?.length
        )
      : 0;

  const avgFinancial =
    project?.contracts && project?.contracts?.length
      ? Math.round(
          project?.contracts?.reduce((s, c) => {
            const subs = c?.sub_projects || [];
            const avg = subs?.length
              ? subs?.reduce(
                  (ss, sp) => ss + (sp?.financial_progress || 0),
                  0
                ) / subs?.length
              : 0;
            return s + avg;
          }, 0) / project?.contracts.length
        )
      : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader Title={"Package Information"} GoBack={true} />

      <View style={styles.header}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Octicons name="info" size={20} color="black" />
          <Text style={styles.headerTitle}>Package Name:</Text>
        </View>
        <Text style={styles.headerSub}>{project?.package_name}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Top summary block */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View
              style={{
                width: "90%",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text style={styles.summaryLabel}>Implementation Agency:</Text>
                <Text style={styles.summaryValue}>{project?.department}</Text>
              </View>
              <View>
                <Text style={[styles.summaryLabel]}>Category</Text>
                <Text style={styles.summaryValue}>{project?.category}</Text>
              </View>
              <View>
                <Text style={[styles.summaryLabel]}>Sub Category</Text>
                <Text style={styles.summaryValue}>{project?.sub_category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.pillRow}>
            <StatPill
              title="Sanction Cost : (Including GST)"
              value={`${convertToCr(project?.estimated_budget_incl_gst)}`}
            />
            <StatPill
              title="Contract Sum"
              value={`${convertToCr(totalContractValue.toFixed(2))}`}
            />
          </View>
        </View>

        {/* Contracts list */}
        <View style={{ marginTop: 12 }}>
          <Text style={styles.sectionTitle}>Contracts</Text>

          {project?.contracts && project?.contracts?.length > 0 ? (
            <FlatList
              data={project.contracts}
              keyExtractor={(it) => String(it.id)}
              renderItem={({ item }) => <ContractCard contract={item} />}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            />
          ) : (
            <View style={styles.noContracts}>
              <Text style={styles.noContractsText}>No Contracts Available</Text>
            </View>
          )}
        </View>

        {/* Quick actions */}
        {/* <View style={{ marginTop: 18 }}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#2b8aef" }]}
              onPress={() => alert("Open site photos")}
            >
              <Text style={styles.actionText}>Photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#20c997" }]}
              onPress={() => alert("Open documents")}
            >
              <Text style={styles.actionText}>Documents</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: "#ff7b7b" }]}
              onPress={() => alert("Contact contractor")}
            >
              <Text style={styles.actionText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProjectDetailsScreen;

// ----- Styles -----
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f6f8fb" },
  header: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 20, fontFamily: "Jost-SemiBold" },
  headerSub: {
    fontSize: 13,
    color: "#666",
    fontFamily: "Jost-Medium",
    marginTop: 6,
  },

  container: { padding: 16, paddingBottom: 40 },

  summaryCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryTopRow: { flexDirection: "row", alignItems: "center" },
  thumb: { width: 96, height: 64, borderRadius: 8, backgroundColor: "#ddd" },
  summaryLabel: { fontSize: 12, color: "#888", fontFamily: "Jost-Medium" },
  summaryValue: { fontSize: 15, fontFamily: "Jost-SemiBold", marginTop: 4 },

  pillRow: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 10,
  },
  pill: {
    // flex: 1,
    backgroundColor: "#fbfdff",
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  pillTitle: { fontSize: 11, color: "#5b6b7b" },
  pillValue: { fontSize: 14, fontWeight: "700", marginTop: 6 },

  smallMuted: { color: "#6b7280", fontSize: 12 },
  desc: { marginTop: 6, color: "#2b2b2b", fontSize: 13 },

  sectionTitle: { fontSize: 16, fontFamily: "Jost-SemiBold", marginBottom: 10 },

  contractCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  contractHeader: { flexDirection: "row", alignItems: "center" },
  contractTitle: { fontSize: 14, fontFamily: "Jost-SemiBold" },
  contractSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
    fontFamily: "Jost-Medium",
  },
  contractValue: { fontWeight: "700", fontSize: 13 },
  contractBody: { marginTop: 10 },
  subHeader: { fontSize: 13, fontWeight: "700", marginBottom: 6 },
  smallText: { fontSize: 12, color: "#555" },

  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: { color: "#6b7280", fontSize: 12, fontFamily: "Jost-Medium" },
  value: { color: "#222", fontSize: 12, fontFamily: "Jost-SemiBold" },

  progressTrack: {
    height: 28,
    backgroundColor: "#eef2f8",
    borderRadius: 999,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressFill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#2b8aef",
  },
  progressText: { alignSelf: "center", fontWeight: "700", color: "#fff" },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "700" },
  noContracts: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  noContractsText: { fontSize: 14, color: "#888", fontStyle: "italic" },
});
