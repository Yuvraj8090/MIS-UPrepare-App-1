import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { convertToCr } from "@/services/helper";

// ----- Reusable UI Components -----

const StatBox = ({ label, value, icon, iconLib: IconLib = MaterialIcons }) => (
  <View style={styles.statBox}>
    <IconLib name={icon} size={16} color="#6B7280" style={{ marginBottom: 4 }} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue} numberOfLines={2}>{value || "N/A"}</Text>
  </View>
);

const FinancePill = ({ title, value, type }) => {
  const isGreen = type === "success";
  return (
    <View style={[styles.financePill, isGreen ? styles.pillGreen : styles.pillBlue]}>
      <Text style={[styles.pillTitle, isGreen ? styles.pillTextGreen : styles.pillTextBlue]}>
        {title}
      </Text>
      <Text style={[styles.pillValue, isGreen ? styles.pillTextGreen : styles.pillTextBlue]}>
        {value}
      </Text>
    </View>
  );
};

const DateItem = ({ label, date }) => (
  <View style={styles.dateItem}>
    <Text style={styles.dateLabel}>{label}</Text>
    <View style={styles.dateValueRow}>
      <Ionicons name="calendar-outline" size={12} color="#4B5563" />
      <Text style={styles.dateValue}>{formatDate(date)}</Text>
    </View>
  </View>
);

const ContractCard = ({ contract }) => {
  return (
    <View style={styles.contractCard}>
      {/* Contract Header */}
      <View style={styles.contractHeader}>
        <View style={styles.contractIconBadge}>
          <Ionicons name="document-text" size={20} color="#3B82F6" />
        </View>
        <View style={styles.contractTitleContainer}>
          <Text style={styles.contractorName} numberOfLines={2}>
            {contract?.contractor || "Unknown Contractor"}
          </Text>
          <Text style={styles.contractNumber} selectable>
            {contract?.contract_number || "N/A"}
          </Text>
        </View>
      </View>

      {/* Contract Value Badge */}
      <View style={styles.contractValueRow}>
        <Text style={styles.contractValueLabel}>Contract Sum</Text>
        <Text style={styles.contractValueAmount}>
          {convertToCr(contract?.contract_value)}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Dates Grid */}
      <View style={styles.datesGrid}>
        <DateItem label="Signing Date" date={contract?.signing_date} />
        <DateItem label="Commencement" date={contract?.commencement_date} />
        <DateItem label="Initial Completion" date={contract?.initial_completion_date} />
        <DateItem label="Revised Completion" date={contract?.revised_completion_date} />
      </View>
    </View>
  );
};

// ----- Utilities -----
function formatDate(s) {
  if (!s) return "Not Set";
  try {
    const d = new Date(s);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return s;
  }
}

// ----- Main Screen -----
const ProjectDetailsScreen = (props) => {
  const project = props?.route?.params?.data || {};

  // Aggregate stats
  const totalContractValue = project?.contracts
    ? project.contracts.reduce((sum, c) => sum + Number(c?.contract_value || 0), 0)
    : 0;

  // Header Component to avoid nesting ScrollView and FlatList
  const renderHeader = () => (
    <>
      {/* Main Title Banner */}
      <View style={styles.pageHeader}>
        <View style={styles.titleRow}>
          <Ionicons name="folder-open" size={20} color="#3B82F6" />
          <Text style={styles.pageHeaderTitle}>Package Name</Text>
        </View>
        <Text style={styles.pageHeaderSub}>{project?.package_name || "N/A"}</Text>
      </View>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        
        {/* Info Grid */}
        <View style={styles.summaryGrid}>
          <StatBox label="Agency" value={project?.department} icon="business" />
          <StatBox label="Category" value={project?.category} icon="category" />
          <StatBox label="Sub Category" value={project?.sub_category} icon="subdirectory-arrow-right" />
        </View>

        <View style={styles.divider} />

        {/* Finance Pills */}
        <View style={styles.pillRow}>
          <FinancePill
            type="success"
            title="Sanction Cost (Inc. GST)"
            value={convertToCr(project?.estimated_budget_incl_gst)}
          />
          <FinancePill
            type="primary"
            title="Total Contract Sum"
            value={convertToCr(totalContractValue.toFixed(2))}
          />
        </View>
      </View>

      {/* Contracts Section Title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contracts ({project?.contracts?.length || 0})</Text>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <CustomHeader Title={"Package Information"} GoBack={true} />

      <FlatList
        data={project?.contracts || []}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ContractCard contract={item} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyStateText}>No Contracts Available</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default ProjectDetailsScreen;

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    
    backgroundColor: "#F3F4F6", // Premium light gray background
  },
  listContent: {
    padding: 16,
    height:"auto",
    minHeight: 780, // Ensures content fills screen but allows for scrolling
    paddingBottom: 40,
  },
  // Top Header Banner
  pageHeader: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  pageHeaderTitle: {
    fontSize: 14,
    fontFamily: "Jost-Bold",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  pageHeaderSub: {
    fontSize: 15,
    fontFamily: "Jost-SemiBold",
    color: "#111827",
    lineHeight: 22,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Jost-Medium",
    color: "#6B7280",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
    color: "#111827",
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 14,
  },
  
  // Finance Pills
  pillRow: {
    flexDirection: "row",
    gap: 12,
  },
  financePill: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
  },
  pillGreen: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  pillBlue: {
    backgroundColor: "#EFF6FF",
    borderColor: "#BFDBFE",
  },
  pillTitle: {
    fontSize: 11,
    fontFamily: "Jost-Medium",
    marginBottom: 4,
    textAlign: "center",
  },
  pillValue: {
    fontSize: 15,
    fontFamily: "Jost-Bold",
    textAlign: "center",
  },
  pillTextGreen: {
    color: "#065F46",
  },
  pillTextBlue: {
    color: "#1E3A8A",
  },

  // Contracts Section
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#111827",
  },
  contractCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contractHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  contractIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  contractTitleContainer: {
    flex: 1,
  },
  contractorName: {
    fontSize: 15,
    fontFamily: "Jost-Bold",
    color: "#111827",
    marginBottom: 4,
  },
  contractNumber: {
    fontSize: 12,
    fontFamily: "Jost-Medium",
    color: "#6B7280",
  },
  contractValueRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  contractValueLabel: {
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
    color: "#4B5563",
  },
  contractValueAmount: {
    fontSize: 14,
    fontFamily: "Jost-Bold",
    color: "#10B981", // Emerald Green for money
  },
  datesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },
  dateItem: {
    width: "48%", // Creates a 2-column grid
  },
  dateLabel: {
    fontSize: 11,
    fontFamily: "Jost-Medium",
    color: "#6B7280",
    marginBottom: 4,
  },
  dateValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dateValue: {
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
    color: "#374151",
  },
  
  // Empty State
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Jost-Medium",
    color: "#9CA3AF",
    marginTop: 12,
  },
});