import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
  fetchDashBoardData,
} from "../../services/api/fetch";
import { getFromSS } from "../../services/storage/SecureStore";
import { useAuth } from "../../navigation/AuthContext/AuthContext";
import PhotoCard from "../../components/PhotoCard";
import { NetConnected } from "@/services/helper";
import PhysicalSubProjectProgressTable from "../../components/DashBoardComponent/PackageProgressTable";
import DepartmentOviewCharts from "../../components/DashBoardComponent/Charts/DepartmentOverview";
import ContractsDistributaionCharts from "../../components/DashBoardComponent/Charts/ContractDistribution";
import DepartmentPhysicalProgress from "../../components/DashBoardComponent/Charts/DepartmentPhysicalProgress";
import DepartmentFinanicalProgress from "../../components/DashBoardComponent/Charts/DepartmentFinancialProgress";
import ExecutiveSummary from "../../components/DashBoardComponent/ExecutiveSummary";
import DepartmentPortfolioBoard from "../../components/DashBoardComponent/DepartmentPortfolioBoard";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const DashboardScreen = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useAuth();
  const isInternet = NetConnected();

  const getDashboardData = useCallback(async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const authToken = await getFromSS("authToken");

    try {
      const response = await fetchDashBoardData(authToken);

      if (response?.success) {
        setDashboardData(response?.data || null);
      } else {
        setDashboardData(null);
      }
    } catch (error) {
      console.log("Dashboard fetch error ::", error);
      setDashboardData(null);
    } finally {
      if (refresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    getDashboardData();
  }, [getDashboardData]);

  const handleRefresh = () => {
    getDashboardData(true);
  };

  const overviewItems = [
    {
      label: "Departments",
      value: dashboardData?.departments?.length ?? 0,
      icon: "layers-triple-outline",
    },
    {
      label: "Sub Projects",
      value: dashboardData?.sub_projects?.length ?? 0,
      icon: "briefcase-outline",
    },
    {
      label: "Online Sync",
      value: isInternet ? "Live" : "Offline",
      icon: isInternet ? "wifi" : "wifi-off",
    },
  ];

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loaderText}>Loading dashboard...</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {isInternet ? <PhotoCard /> : null}

          <View style={styles.heroWrap}>
            <LinearGradient
              colors={["#0b57a4", "#0f766e"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroCard}
            >
              <View style={styles.heroTopRow}>
                <View style={styles.heroBadge}>
                  <Feather name="bar-chart-2" size={14} color="#dbeafe" />
                  <Text style={styles.heroBadgeText}>Overview</Text>
                </View>
                <View style={styles.heroStatus}>
                  <MaterialCommunityIcons
                    name={isInternet ? "cloud-check-outline" : "cloud-off-outline"}
                    size={16}
                    color="#ffffff"
                  />
                  <Text style={styles.heroStatusText}>
                    {isInternet ? "Connected" : "Offline"}
                  </Text>
                </View>
              </View>

              <Text style={styles.greetingText}>Hi, {user?.name || "User"}</Text>
              <Text style={styles.greetingSubtext}>
                Review key contract, financial, and project progress updates in one
                place.
              </Text>

              <View style={styles.overviewRow}>
                {overviewItems.map((item) => (
                  <View key={item.label} style={styles.overviewCard}>
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={18}
                      color="#0b57a4"
                    />
                    <Text style={styles.overviewValue}>{item.value}</Text>
                    <Text style={styles.overviewLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          <View style={styles.sectionIntro}>
            <Text style={styles.sectionEyebrow}>Performance Snapshot</Text>
            <Text style={styles.sectionTitle}>Project health at a glance</Text>
            <Text style={styles.sectionSubtext}>
              The sections below group contracts, physical progress, finance, and
              department performance into consistent cards.
            </Text>
          </View>

          <ExecutiveSummary data={dashboardData} />
          <DepartmentPortfolioBoard data={dashboardData} />
          <DepartmentOviewCharts data={dashboardData} />
          <ContractsDistributaionCharts data={dashboardData} />
          <DepartmentPhysicalProgress data={dashboardData} />
          <DepartmentFinanicalProgress data={dashboardData} />
          <PhysicalSubProjectProgressTable data={dashboardData?.sub_projects || []} />
        </ScrollView>
      )}
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loaderText: {
    marginTop: 10,
    color: colors.textMuted,
    fontSize: 14,
    fontFamily: "Jost-Medium",
    textAlign: "center",
  },
  heroWrap: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  heroCard: {
    borderRadius: 24,
    padding: spacing.lg,
    ...shadows.card,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  heroBadgeText: {
    color: "#dbeafe",
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
  },
  heroStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroStatusText: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Jost-Medium",
  },
  greetingText: {
    marginTop: spacing.md,
    fontFamily: "Jost-Bold",
    fontSize: 28,
    color: "#ffffff",
  },
  greetingSubtext: {
    marginTop: 8,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#dbeafe",
  },
  overviewRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  overviewCard: {
    flex: 1,
    minHeight: 96,
    borderRadius: radius.md,
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  overviewValue: {
    marginTop: 8,
    fontFamily: "Jost-Bold",
    fontSize: 22,
    color: colors.text,
  },
  overviewLabel: {
    marginTop: 4,
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionIntro: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 2,
  },
  sectionEyebrow: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  sectionTitle: {
    marginTop: 4,
    fontFamily: "Jost-Bold",
    fontSize: 24,
    color: colors.text,
  },
  sectionSubtext: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: colors.textMuted,
    maxWidth: 440,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
