import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchWorkProgress } from "@/services/api/fetch";
import WorkProgressSkeletonCard from "@/components/SkeletonDesign/WorkProgressCard";
import { useNavigation } from "@react-navigation/native";
import { convertToCr } from "@/services/helper";

const WorkProgress = (props) => {
  const [search, setSearch] = useState("");
  const [workProgressData, setWorkProgressData] = useState([]);
  const [load, setLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getWorkProgress();
  }, []);

  const getWorkProgress = async ({ isRefresh = false } = {}) => {
    const authToken = await getFromSS("authToken");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoad(true);
    }

    try {
      const res = await fetchWorkProgress(authToken);

      if (!res?.success) {
        throw new Error(res?.data?.msg || "Unable to load work progress.");
      }

      setWorkProgressData(Array.isArray(res?.data) ? res.data : []);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error?.message || "Unable to load work progress. Please try again."
      );
      setWorkProgressData([]);
    } finally {
      setLoad(false);
      setRefreshing(false);
    }
  };

  const filteredData = useMemo(() => {
    const searchLower = search.trim().toLowerCase();

    if (!searchLower) {
      return workProgressData;
    }

    return workProgressData?.filter((item) => {
      const totalComponents = item?.work_progress_data?.length?.toString() || "";
      const contractValue = String(item?.contract_value || "").toLowerCase();

      return (
        item?.name?.toLowerCase().includes(searchLower) ||
        item?.project_id?.toString().includes(searchLower) ||
        totalComponents.includes(searchLower) ||
        contractValue.includes(searchLower)
      );
    });
  }, [search, workProgressData]);

  const summary = useMemo(() => {
    const totalComponents = filteredData.reduce(
      (sum, item) => sum + (item?.work_progress_data?.length || 0),
      0
    );

    return {
      totalProjects: filteredData.length,
      totalComponents,
    };
  }, [filteredData]);

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={errorMessage ? "alert-circle-outline" : "file-search-outline"}
        size={34}
        color={errorMessage ? "#dc2626" : "#64748b"}
      />
      <Text style={styles.emptyTitle}>
        {errorMessage
          ? "Work progress needs attention"
          : search
          ? "No projects match your search"
          : "No work progress available"}
      </Text>
      <Text style={styles.emptyBody}>
        {errorMessage ||
          "Try a different keyword for project name, project ID, or components."}
      </Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => getWorkProgress({ isRefresh: false })}
      >
        <Feather name="refresh-cw" size={16} color="#fff" />
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => {
    const componentCount = item?.work_progress_data?.length || 0;

    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.projectBadge}>
            <Text style={styles.projectBadgeText}>Project #{item.project_id}</Text>
          </View>
          <View style={styles.componentBadge}>
            <MaterialCommunityIcons
              name="format-list-bulleted-square"
              size={14}
              color="#0b57a4"
            />
            <Text style={styles.componentBadgeText}>{componentCount} items</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {item?.name || "Untitled project"}
        </Text>

        <View style={styles.metaGrid}>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Contract Value</Text>
            <Text style={styles.metaValue}>
              {convertToCr(item?.contract_value || 0)}
            </Text>
          </View>
          <View style={styles.metaCard}>
            <Text style={styles.metaLabel}>Components</Text>
            <Text style={styles.metaValue}>{componentCount}</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.updateBtn]}
            onPress={() =>
              props?.navigation.navigate("UpdateWorkProgress", {
                project: item,
              })
            }
            activeOpacity={0.85}
          >
            <Feather name="edit-3" size={18} color="#fff" />
            <Text style={styles.actionText}>Update</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("WorkProgressList", {
                workData: item,
              })
            }
            style={[styles.actionButton, styles.detailsBtn]}
            activeOpacity={0.85}
          >
            <Entypo name="eye" size={18} color="#fff" />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screen}>
      <CustomHeader Title={"Work Progress"} GoBack={true} />

      <FlatList
        data={load ? [] : filteredData}
        keyExtractor={(item) => String(item?.id || item?.project_id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={() => getWorkProgress({ isRefresh: true })}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.searchWrapper}>
              <Feather name="search" size={18} color="#64748b" />
              <TextInput
                placeholder="Search by project, ID, or components"
                placeholderTextColor="#888"
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
              />
              {load ? (
                <ActivityIndicator size="small" color="#0b57a4" />
              ) : null}
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryValue}>{summary.totalProjects}</Text>
                <Text style={styles.summaryLabel}>Projects</Text>
              </View>
              <View style={styles.summaryChip}>
                <Text style={styles.summaryValue}>{summary.totalComponents}</Text>
                <Text style={styles.summaryLabel}>Components</Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          load ? (
            <>
              {Array.from({ length: 4 }).map((_, index) => (
                <WorkProgressSkeletonCard key={index} />
              ))}
            </>
          ) : (
            renderEmptyState()
          )
        }
        renderItem={renderItem}
      />
    </View>
  );
};

export default WorkProgress;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 28,
  },
  headerBlock: {
    gap: 14,
    marginBottom: 2,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 14,
    minHeight: 50,
    borderWidth: 1,
    borderColor: "#dbe5ef",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#0f172a",
    fontFamily: "Jost-Regular",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryChip: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  summaryValue: {
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: "#0b57a4",
  },
  summaryLabel: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#64748b",
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginTop: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#e6edf5",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  projectBadge: {
    borderRadius: 999,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  projectBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#0b57a4",
  },
  componentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  componentBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#334155",
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-SemiBold",
    color: "#0f172a",
    marginTop: 12,
    lineHeight: 22,
  },
  metaGrid: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  metaCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metaLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  metaValue: {
    marginTop: 4,
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#0f172a",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 16,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
  },
  updateBtn: {
    backgroundColor: "#13803d",
  },
  detailsBtn: {
    backgroundColor: "#0b57a4",
  },
  actionText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: "#0f172a",
    textAlign: "center",
  },
  emptyBody: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    backgroundColor: "#0b57a4",
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
  },
});
