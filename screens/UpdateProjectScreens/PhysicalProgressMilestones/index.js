import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { NetConnected } from "../../../services/helper";
import { fetchPhysicalProgressByMId } from "../../../services/api/fetch";
import { getFromSS } from "../../../services/storage/SecureStore";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import {
  fetchMilestonePhysicalProgressData,
  saveSqlMilestonePhysicalProgress,
} from "@/services/database/database";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";

const formatDateLabel = (date) => {
  if (!date) {
    return "Not Mentioned";
  }

  const nextDate = new Date(date);

  if (Number.isNaN(nextDate.getTime())) {
    return date;
  }

  return nextDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PhysicalProgressMilestone = (props) => {
  const { milestone_id, milestone, project, highlightUpdated } = props?.route?.params;
  const [milestonesData, setMilestonesData] = useState([]);
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [totalPer, setTotalPer] = useState(0);
  const [remainingPer, setRemainingPer] = useState(100);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const isInternet = NetConnected();
  const { refreshMap, lastUpdateSummary } = useUpdateFlow();
  const refreshVersion =
    refreshMap[UPDATE_REFRESH_KEYS.physicalProgressMilestone] || 0;

  const records = useMemo(() => {
    if (isInternet) {
      return milestonesData?.milestone?.records || [];
    }

    return Array.isArray(milestonesData) ? milestonesData : [];
  }, [isInternet, milestonesData]);

  const milestoneName = useMemo(() => {
    if (isInternet) {
      return milestonesData?.milestone?.name || milestone?.name || "Milestone";
    }

    return milestonesData?.[0]?.name || milestone?.name || "Milestone";
  }, [isInternet, milestonesData, milestone?.name]);

  const checkAvailableMilestone = (data) => {
    const totalPercentage = (data || []).reduce(
      (total, item) => total + Number(item?.percentage || 0),
      0
    );

    const remainingPercentage = Math.max(0, 100 - totalPercentage);
    setTotalPer(totalPercentage);
    setRemainingPer(remainingPercentage);
  };

  const getMilestonePhysicalProgressSql = async (mid) => {
    try {
      const res = await fetchMilestonePhysicalProgressData(mid);
      setMilestonesData(res);
      checkAvailableMilestone(res);
    } catch (error) {
      console.error("Error fetching data from SQL:", error);
    }
  };

  const getPhysicalProgressByMID = async (mid) => {
    const authToken = await getFromSS("authToken");

    try {
      const formData = { milestone_id: mid };
      const res = await fetchPhysicalProgressByMId(formData, authToken);

      if (res?.data?.milestone) {
        setMilestonesData(res?.data);
        checkAvailableMilestone(res?.data?.milestone?.records);
        await saveSqlMilestonePhysicalProgress(res?.data?.milestone);
      } else {
        setMilestonesData([]);
        checkAvailableMilestone([]);
      }
    } catch (error) {
      console.error("Error fetching physical progress by MID:", error);
    }
  };

  const fetchDataBasedOnConnectivity = useCallback(
    async (mid) => {
      setLoad(true);
      try {
        if (isInternet) {
          await getPhysicalProgressByMID(mid);
        } else {
          await getMilestonePhysicalProgressSql(mid);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoad(false);
        setRefresh(false);
      }
    },
    [isInternet]
  );

  useEffect(() => {
    if (milestone_id) {
      fetchDataBasedOnConnectivity(milestone_id);
    }
  }, [milestone_id, isFocused, fetchDataBasedOnConnectivity, refreshVersion]);

  const handleRefresh = () => {
    setRefresh(true);
    fetchDataBasedOnConnectivity(milestone_id);
  };

  const handleNext = () => {
    navigation.navigate("PhysicalProgressForm", {
      milestone: isInternet ? milestonesData?.milestone : { id: milestone_id, name: milestoneName },
      project,
      remainProgress: remainingPer,
    });
  };

  const renderRecord = ({ item, index }) => (
    <View style={screenStyles.recordCard}>
      <View style={screenStyles.recordHeader}>
        <View style={screenStyles.recordBadge}>
          <Text style={screenStyles.recordBadgeText}>Entry #{index + 1}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          style={screenStyles.imageButton}
          onPress={() =>
            navigation.navigate("PhotoGalleryScreen", {
              mppr_id: item?.record_id || item?.id,
            })
          }
        >
          <Feather name="image" size={14} color="#fff" />
          <Text style={screenStyles.imageButtonText}>Images</Text>
        </TouchableOpacity>
      </View>

      <View style={screenStyles.metricRow}>
        <View style={screenStyles.metricCard}>
          <Text style={screenStyles.metricLabel}>Progress</Text>
          <Text style={screenStyles.metricValue}>{item?.percentage || 0}%</Text>
        </View>
        <View style={screenStyles.metricCard}>
          <Text style={screenStyles.metricLabel}>Date</Text>
          <Text style={screenStyles.metricValue}>{formatDateLabel(item?.date)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Physical Progress of Milestones"} GoBack={true} />

      {load ? (
        <View style={screenStyles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={screenStyles.loaderText}>Loading progress records...</Text>
        </View>
      ) : (
        <FlatList
          data={records}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) =>
            String(item?.record_id || item?.id || index)
          }
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
          contentContainerStyle={screenStyles.listContent}
          ListHeaderComponent={
            <View style={screenStyles.heroCard}>
              <Text style={screenStyles.heroTitle}>{milestoneName}</Text>
              <Text style={screenStyles.heroSubtext}>
                Review the current progress history and add the next update only
                after the remaining percentage is confirmed.
              </Text>

              <View style={screenStyles.summaryRow}>
                <View style={screenStyles.summaryChip}>
                  <Text style={screenStyles.summaryValue}>{totalPer}%</Text>
                  <Text style={screenStyles.summaryLabel}>Completed</Text>
                </View>
                <View style={screenStyles.summaryChip}>
                  <Text style={screenStyles.summaryValue}>{remainingPer}%</Text>
                  <Text style={screenStyles.summaryLabel}>Remaining</Text>
                </View>
              </View>

              {highlightUpdated && lastUpdateSummary?.milestoneId === milestone_id ? (
                <View style={screenStyles.successBanner}>
                  <MaterialCommunityIcons
                    name="check-circle-outline"
                    size={18}
                    color={colors.success}
                  />
                  <Text style={screenStyles.successText}>
                    Progress updated successfully. The latest data is now in sync.
                  </Text>
                </View>
              ) : null}
            </View>
          }
          renderItem={renderRecord}
          ListEmptyComponent={
            <View style={screenStyles.emptyState}>
              <Text style={screenStyles.emptyTitle}>No progress records yet</Text>
              <Text style={screenStyles.emptyText}>
                This milestone has no saved progress entries right now.
              </Text>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleNext}
              style={screenStyles.addButton}
            >
              <Feather name="plus-circle" size={18} color="#fff" />
              <Text style={screenStyles.addButtonText}>Add Physical Progress</Text>
            </TouchableOpacity>
          }
        />
      )}
    </View>
  );
};

export default PhysicalProgressMilestone;

const screenStyles = StyleSheet.create({
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loaderText: {
    marginTop: 10,
    color: colors.textMuted,
    fontFamily: "Jost-Medium",
  },
  listContent: {
    padding: spacing.md,
    height:"auto",
    minHeight: 780,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  heroTitle: {
    fontFamily: "Jost-Bold",
    fontSize: 22,
    color: colors.text,
  },
  heroSubtext: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
  },
  summaryRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  summaryChip: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  summaryValue: {
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: colors.primary,
  },
  summaryLabel: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: colors.textMuted,
  },
  successBanner: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.successSoft,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  successText: {
    flex: 1,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    lineHeight: 18,
    color: colors.success,
  },
  recordCard: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.md,
    ...shadows.soft,
  },
  recordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  recordBadge: {
    borderRadius: radius.pill,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  recordBadgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: colors.primary,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  imageButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#fff",
  },
  metricRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metricCard: {
    flex: 1,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metricLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    color: colors.textMuted,
  },
  metricValue: {
    marginTop: 4,
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: colors.text,
  },
  emptyState: {
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    alignItems: "center",
  },
  emptyTitle: {
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: colors.text,
  },
  emptyText: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: "center",
  },
  addButton: {
    marginTop: spacing.lg,
    minHeight: 52,
    borderRadius: radius.md,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    ...shadows.soft,
  },
  addButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#fff",
  },
});
