import CustomHeader from "@/components/AppHeader/CustomHeader";
import {
  deleteWorkProgressById,
  fetchWorkProgressById,
} from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import {
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React, { useState, useEffect, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";

import SubProgressCardSkeleton from "@/components/SkeletonDesign/SubProgressCardSkeleton";

const formatDate = (dateString) => {
  if (!dateString) {
    return "--";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLabelWrap}>
      <MaterialCommunityIcons name={icon} size={15} color="#64748b" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value || "--"}</Text>
  </View>
);

const WorkProjectProgressList = (props) => {
  const routeParams = props?.route?.params || {};
  const incomingWorkData = routeParams?.workData ?? routeParams?.project ?? null;
  const workData = Array.isArray(incomingWorkData)
    ? incomingWorkData[0] || null
    : incomingWorkData;
  const [search, setSearch] = useState("");
  const [workProgressData, setWorkProgressData] = useState([]);
  const [load, setLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getWorkProgress();
  }, [workData?.id]);

  const getWorkProgress = async ({ isRefresh = false } = {}) => {
    if (!workData?.id) {
      setErrorMessage("Project details are missing. Please reopen this progress screen.");
      setWorkProgressData([]);
      setLoad(false);
      setRefreshing(false);
      return;
    }

    const authToken = await getFromSS("authToken");
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoad(true);
    }

    try {
      const res = await fetchWorkProgressById(authToken, workData?.id);

      if (!res?.success) {
        throw new Error(res?.data?.msg || "Unable to load progress details.");
      }

      setWorkProgressData(res?.project?.work_progress_data || []);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error?.message || "Something went wrong while loading progress details."
      );
      setWorkProgressData([]);
    } finally {
      setLoad(false);
      setRefreshing(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) {
      return workProgressData;
    }

    const lower = search.toLowerCase();
    return workProgressData?.filter((item) => {
      const comp = item?.work_component?.work_component?.toLowerCase() || "";
      const stage = item?.current_stage?.toLowerCase() || "";
      const remark = item?.remarks?.toLowerCase() || "";

      return (
        comp.includes(lower) || stage.includes(lower) || remark.includes(lower)
      );
    });
  }, [search, workProgressData]);

  const handleDeleteProgress = async (id) => {
    Alert.alert(
      "Delete progress entry",
      "Are you sure you want to delete this progress item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => confirmDelete(id),
        },
      ]
    );
  };

  const confirmDelete = async (id) => {
    const authToken = await getFromSS("authToken");

    try {
      const resp = await deleteWorkProgressById(authToken, id);

      if (resp?.success) {
        Alert.alert("Deleted", resp?.message || "Progress deleted successfully.");
        getWorkProgress({ isRefresh: false });
      } else {
        Alert.alert("Delete failed", resp?.message || "Please try again.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong while deleting progress.");
    }
  };

  const renderCard = ({ item }) => {
    const wc = item?.work_component;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.componentTag}>
            <Text style={styles.componentTagText}>Entry #{item?.id}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.deleteButton}
            onPress={() => handleDeleteProgress(item?.id)}
          >
            <MaterialIcons name="delete-outline" size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {wc?.work_component || "--"}
        </Text>

        <View style={styles.progressRow}>
          <View style={styles.progressChip}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>
              {item?.progress_percentage ? `${item?.progress_percentage}%` : "--"}
            </Text>
          </View>
          <View style={styles.progressChip}>
            <Text style={styles.progressLabel}>Qty / Length</Text>
            <Text style={styles.progressValue}>{item?.qty_length || "--"}</Text>
          </View>
        </View>

        <InfoRow icon="stairs" label="Stage" value={item?.current_stage} />
        <InfoRow icon="calendar-month-outline" label="Date" value={formatDate(item?.date_of_entry)} />
        <InfoRow icon="account-outline" label="Added By" value={item?.user?.name} />

        {item?.remarks ? (
          <InfoRow icon="text-box-outline" label="Remarks" value={item?.remarks} />
        ) : null}

        <View style={styles.separator} />

        <InfoRow icon="toolbox-outline" label="Type" value={wc?.type_details} />
        <InfoRow icon="map-marker-outline" label="Side" value={wc?.side_location} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons
        name={errorMessage ? "alert-circle-outline" : "text-search"}
        size={32}
        color={errorMessage ? "#dc2626" : "#64748b"}
      />
      <Text style={styles.emptyTitle}>
        {errorMessage
          ? "Progress details need attention"
          : search
          ? "No matching records found"
          : "No progress entries available"}
      </Text>
      <Text style={styles.emptyText}>
        {errorMessage ||
          "Try a different search term for component, stage, or remarks."}
      </Text>
    </View>
  );

  const renderLoadingSkeleton = () => (
    <View style={styles.skeletonWrap}>
      {Array.from({ length: 4 }).map((_, index) => (
        <SubProgressCardSkeleton key={index} />
      ))}
    </View>
  );

  return (
    <View style={styles.screen}>
      <CustomHeader GoBack={true} Title={"Project Progress Details"} />

      <FlatList
        data={load ? [] : filteredData}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={() => getWorkProgress({ isRefresh: true })}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(insets.bottom, 28) }]}
        ListHeaderComponent={
          <View style={styles.headerSection}>
            <View style={styles.projectCard}>
              <View style={styles.projectTitleRow}>
                <MaterialCommunityIcons
                  name="folder-open-outline"
                  size={18}
                  color="#0b57a4"
                />
                <Text
                  style={styles.projectTitle}
                  numberOfLines={expandedTitle ? undefined : 2}
                >
                  {workData?.name}
                </Text>
              </View>

              <View style={styles.projectFooter}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.addButton}
                  onPress={() =>
                    props?.navigation.navigate("UpdateWorkProgress", {
                      project: workData,
                    })
                  }
                >
                  <FontAwesome5 name="plus-circle" size={15} color="#fff" />
                  <Text style={styles.addButtonText}>Add Progress</Text>
                </TouchableOpacity>

                {workData?.name?.length > 60 ? (
                  <TouchableOpacity
                    onPress={() => setExpandedTitle(!expandedTitle)}
                    style={styles.expandButton}
                  >
                    <Text style={styles.expandButtonText}>
                      {expandedTitle ? "Show less" : "Read more"}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            <View style={styles.searchWrap}>
              <Feather name="search" size={18} color="#64748b" />
              <TextInput
                placeholder="Search by component, stage, or remark"
                placeholderTextColor="#666"
                style={styles.search}
                value={search}
                onChangeText={setSearch}
              />
              {load ? (
                <ActivityIndicator size="small" color="#0b57a4" />
              ) : null}
            </View>
          </View>
        }
        renderItem={renderCard}
        ListEmptyComponent={load ? renderLoadingSkeleton : renderEmpty}
      />
    </View>
  );
};

export default WorkProjectProgressList;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  content: {
    padding: 16,
    paddingBottom: 28,
  },
  headerSection: {
    gap: 14,
    marginBottom: 2,
  },
  skeletonWrap: {
    gap: 12,
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    shadowColor: "#00000011",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 2,
  },
  projectTitleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },
  projectTitle: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Jost-SemiBold",
    color: "#0f172a",
    lineHeight: 22,
  },
  projectFooter: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  addButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0b57a4",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 6,
  },
  addButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#fff",
  },
  expandButton: {
    paddingVertical: 6,
  },
  expandButtonText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#0b57a4",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe5ef",
    paddingHorizontal: 14,
    minHeight: 50,
  },
  search: {
    flex: 1,
    marginLeft: 10,
    color: "#000",
    fontFamily: "Jost-Regular",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 18,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  componentTag: {
    borderRadius: 999,
    backgroundColor: "#eef4ff",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  componentTagText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#0b57a4",
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
  },
  title: {
    fontSize: 16,
    fontFamily: "Jost-Bold",
    color: "#111",
    marginTop: 12,
  },
  progressRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  progressChip: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  progressLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  progressValue: {
    marginTop: 4,
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#0f172a",
  },
  infoRow: {
    marginTop: 12,
    gap: 4,
  },
  infoLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: "#64748b",
  },
  infoValue: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 19,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginTop: 14,
  },
  emptyState: {
    marginTop: 24,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 10,
    fontFamily: "Jost-Bold",
    fontSize: 16,
    textAlign: "center",
    color: "#0f172a",
  },
  emptyText: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 20,
  },
});