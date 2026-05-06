import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  return (
    <View style={styles.mainContainer}>
      {loading ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color="#0b57a4" />
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

          <View style={styles.greetingBlock}>
            <Text style={styles.greetingEyebrow}>Dashboard</Text>
            <Text style={styles.greetingText}>Hi, {user?.name || "User"}</Text>
            <Text style={styles.greetingSubtext}>
              Review key contract, financial, and project progress updates in one place.
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
    backgroundColor: "#eef1f4",
  },
  loaderWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loaderText: {
    marginTop: 10,
    color: "#475569",
    fontSize: 14,
    fontFamily: "Jost-Medium",
    textAlign: "center",
  },
  greetingBlock: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 2,
  },
  greetingEyebrow: {
    color: "#0b57a4",
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  greetingText: {
    marginTop: 4,
    fontFamily: "Jost-Bold",
    fontSize: 28,
    color: "#0f172a",
  },
  greetingSubtext: {
    marginTop: 6,
    fontFamily: "Jost-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
    maxWidth: 440,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});
