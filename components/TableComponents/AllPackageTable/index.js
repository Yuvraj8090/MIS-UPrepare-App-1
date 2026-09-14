import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import { convertToCr, height, width } from "@/services/helper";

const AllPackageTable = ({ refresh, handleRefresh, projectData, loading }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState("");

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter Data
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return projectData;
    const lower = searchText.toLowerCase();
    return projectData.filter(
      (item) =>
        item?.id?.toString().toLowerCase().includes(lower) ||
        item?.package_name?.toLowerCase().includes(lower) ||
        item?.department?.toLowerCase().includes(lower) ||
        item?.category?.toLowerCase().includes(lower) ||
        item?.sub_category?.toLowerCase().includes(lower)
    );
  }, [projectData, searchText]);

  // Skeleton Loader UI
  const renderSkeleton = () => {
    return (
      <View style={styles.skeletonContainer}>
        {[...Array(5)].map((_, i) => (
          <View key={i} style={styles.skeletonRow}>
            <SkeletonLoader width={40} height={40} style={{ borderRadius: 20 }} />
            <View style={styles.skeletonContent}>
              <SkeletonLoader width={80} height={20} style={{ marginBottom: 8, borderRadius: 4 }} />
              <SkeletonLoader width={width * 0.6} height={16} style={{ marginBottom: 6, borderRadius: 4 }} />
              <SkeletonLoader width={width * 0.4} height={16} style={{ marginBottom: 12, borderRadius: 4 }} />
              <View style={styles.rowBetween}>
                <SkeletonLoader width={60} height={20} style={{ borderRadius: 4 }} />
                <SkeletonLoader width={100} height={32} style={{ borderRadius: 6 }} />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          placeholder="Search package, department, category..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")} style={styles.clearIcon}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* List / Loader */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} tintColor="#3B82F6" />
          }
          contentContainerStyle={styles.listContent}
          renderItem={({ item, index }) => {
            const expanded = expandedRows[item?.id] || false;
            const hasContracts = item?.contracts?.length > 0;

            return (
              <View style={[styles.card, { backgroundColor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB" }]}>
                
                {/* S.No. Badge */}
                <View style={styles.serialContainer}>
                  <View style={styles.serialBadge}>
                    <Text style={styles.serialText}>{index + 1}</Text>
                  </View>
                </View>

                {/* Package Details */}
                <View style={styles.contentContainer}>
                  
                  {/* Header Row: ID Badge & Budget */}
                  <View style={styles.cardHeader}>
                   
                    <View style={styles.budgetContainer}>
                      <Text style={styles.budgetLabel}>Budget: </Text>
                      <Text style={styles.budgetValue}>{convertToCr(item?.estimated_budget_incl_gst)}</Text>
                    </View>
                  </View>

                  {/* Title */}
                  <TouchableOpacity activeOpacity={0.7} onPress={() => toggleExpand(item?.id)}>
                    <Text 
                      style={styles.title} 
                      numberOfLines={expanded ? undefined : 2}
                    >
                      {item?.package_name || "Unnamed Package"}
                    </Text>
                  </TouchableOpacity>

                  {/* Meta Information (Dept & Category) */}
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="account-balance" size={14} color="#6B7280" />
                      <Text style={styles.metaText} numberOfLines={1}>
                        <Text style={styles.metaLabel}>Dept: </Text>{item?.department || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <MaterialIcons name="category" size={14} color="#6B7280" />
                      <Text style={styles.metaText} numberOfLines={1}>
                        <Text style={styles.metaLabel}>Cat: </Text>{item?.category || "N/A"}
                        {item?.sub_category ? ` (${item?.sub_category})` : ""}
                      </Text>
                    </View>
                  </View>

                  {/* Footer Row: Contracts & Action Button */}
                  <View style={styles.cardFooter}>
                    <View style={[styles.contractBadge, hasContracts ? styles.contractActive : styles.contractInactive]}>
                      <Text style={[styles.contractText, hasContracts ? styles.contractTextActive : styles.contractTextInactive]}>
                        {hasContracts ? `${item.contracts.length} Contracts` : "No Contracts"}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate("PackageInfoScreen", { data: item })}
                    >
                      <Text style={styles.actionBtnText}>Details</Text>
                      <Feather name="arrow-right" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            !loading && (
              <View style={styles.emptyContainer}>
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyText}>
                  {searchText ? "No matching packages found." : "No packages available."}
                </Text>
              </View>
            )
          }
          ListFooterComponent={<View style={{ height: 80 }} />}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

export default AllPackageTable;

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 1560,
    minHeight: 600,
    backgroundColor: "#F3F4F6", // Light gray background for contrast
   },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "Jost-Medium",
    fontSize: 14,
    color: "#111827",
  },
  clearIcon: {
    padding: 4,
  },
  listContent: {
    height:"auto",
    minHeight: 780,
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    backgroundColor: "#FFFFFF",
  },
  serialContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  serialBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  serialText: {
    fontFamily: "Jost-Bold",
    fontSize: 12,
    color: "#4B5563",
  },
  contentContainer: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: "#DEF7EC", // Light green
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  idText: {
    fontFamily: "Jost-Bold",
    fontSize: 11,
    color: "#03543F", // Dark green
  },
  budgetContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetLabel: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  budgetValue: {
    fontFamily: "Jost-Bold",
    fontSize: 13,
    color: "#10B981", // Emerald green
  },
  title: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: "#111827",
    marginBottom: 10,
    lineHeight: 22,
  },
  metaRow: {
    gap: 6,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#374151",
    flex: 1,
  },
  metaLabel: {
    fontFamily: "Jost-SemiBold",
    color: "#6B7280",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  contractBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  contractActive: {
    backgroundColor: "#E0F2FE",
    borderColor: "#BAE6FD",
  },
  contractInactive: {
    backgroundColor: "#F3F4F6",
    borderColor: "#E5E7EB",
  },
  contractText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
  },
  contractTextActive: {
    color: "#0284C7",
  },
  contractTextInactive: {
    color: "#6B7280",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6", // Primary blue
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  actionBtnText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  skeletonContainer: {
    paddingHorizontal: 16,
  },
  skeletonRow: {
    flexDirection: "row",
    marginVertical: 12,
  },
  skeletonContent: {
    flex: 1,
    marginLeft: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: "Jost-Medium",
    fontSize: 15,
    color: "#6B7280",
  },
});
