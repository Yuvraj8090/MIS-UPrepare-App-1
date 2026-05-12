import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

// Components & Services
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import AllPackageTable from "@/components/TableComponents/AllPackageTable";
import { getFromSS } from "../../../services/storage/SecureStore";
import { fetchPackages } from "../../../services/api/fetch";
import { NetConnected } from "@/services/helper";
import {
  getPackageCacheAgeLabel,
  isPackageCacheFresh,
  readPackageCache,
  writePackageCache,
} from "@/services/packages/cache";

const AllPackagesScreen = () => {
  const [packageData, setPackageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Status States
  const [errorMessage, setErrorMessage] = useState("");
  const [cacheMessage, setCacheMessage] = useState("");
  const [isStaleData, setIsStaleData] = useState(false);
  
  // Assuming NetConnected is a custom hook that returns a boolean
  const isInternet = NetConnected();

  useEffect(() => {
    bootstrapPackages();
  }, [isInternet]);

  const bootstrapPackages = async () => {
    setLoading(true);
    setErrorMessage("");

    const cached = await readPackageCache();

    // 1. Load cache immediately for fast perceived performance
    if (cached?.items?.length) {
      setPackageData(cached.items);
      setCacheMessage(getPackageCacheAgeLabel(cached.timestamp) || "");
      setIsStaleData(!isPackageCacheFresh(cached.timestamp));
    }

    // 2. Handle Offline Scenarios
    if (isInternet === false) {
      setLoading(false);
      if (cached?.items?.length) {
        setErrorMessage("You are offline. Showing saved packages.");
      } else {
        setErrorMessage("No internet connection and no saved data found.");
      }
      return;
    }

    // 3. Handle Online Scenario
    if (isInternet) {
      await getPackagesData({ isRefresh: false });
    }
  };

  const getPackagesData = async ({ isRefresh = false } = {}) => {
    const authToken = await getFromSS("authToken");

    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await fetchPackages(authToken);

      if (res?.status >= 400 || res?.ok === false) {
        throw new Error(res?.data?.msg || "Unable to load packages right now.");
      }

      const packages = res?.data?.packages || [];
      setPackageData(packages);
      setErrorMessage("");
      setIsStaleData(false);

      // Save fresh data to cache
      const cache = await writePackageCache(packages);
      setCacheMessage(getPackageCacheAgeLabel(cache.timestamp) || "");
    } catch (error) {
      const cached = await readPackageCache();

      if (cached?.items?.length) {
        setPackageData(cached.items);
        setCacheMessage(getPackageCacheAgeLabel(cached.timestamp) || "");
        setIsStaleData(true);
        setErrorMessage("Could not refresh. Showing most recent saved data.");
      } else {
        setErrorMessage(error?.message || "Unable to load packages. Please try again.");
      }
    } finally {
      if (isRefresh) setRefreshing(false);
      else setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (isInternet === false) {
      setRefreshing(false);
      setErrorMessage("Reconnect to the internet to refresh package data.");
      return;
    }
    getPackagesData({ isRefresh: true });
  };

  // UX Component: Smart Status Banner
  const renderStatusBanner = () => {
    if (!errorMessage && !isStaleData && isInternet !== false) return null;

    const isError = errorMessage && !isStaleData;
    const bannerColor = isError ? "#FEF2F2" : "#FFFBEB"; // Red for errors, Amber for warnings/offline
    const borderColor = isError ? "#FECACA" : "#FDE68A";
    const iconName = isError ? "alert-circle" : "cloud-offline";
    const iconColor = isError ? "#EF4444" : "#D97706";
    const textColor = isError ? "#991B1B" : "#92400E";

    return (
      <View style={[styles.bannerContainer, { backgroundColor: bannerColor, borderColor }]}>
        <Ionicons name={iconName} size={20} color={iconColor} style={styles.bannerIcon} />
        <View style={styles.bannerTextContainer}>
          <Text style={[styles.bannerText, { color: textColor }]}>
            {errorMessage || "Viewing cached data."}
          </Text>
          {cacheMessage && (
            <Text style={[styles.bannerSubText, { color: textColor }]}>
              Last updated: {cacheMessage}
            </Text>
          )}
        </View>
        {isError && isInternet && (
          <TouchableOpacity onPress={() => getPackagesData({ isRefresh: false })} style={styles.retryBtn}>
            <Ionicons name="refresh" size={18} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom", "left", "right"]}>
      <CustomHeader Title={"All Packages"} GoBack={true} />
      
      {/* Status Notifications for Offline / Stale Data */}
      {renderStatusBanner()}

      <View style={styles.content}>
        <AllPackageTable
          refresh={refreshing}
          handleRefresh={handleRefresh}
          projectData={packageData}
          loading={loading}
          // Passing down in case the table handles its own empty states
          errorMessage={errorMessage}
          cacheMessage={cacheMessage}
          isStaleData={isStaleData}
          isOnline={isInternet}
        />
      </View>
    </SafeAreaView>
  );
};

export default AllPackagesScreen;

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Matches the table's background perfectly
  },
  content: {
    flex: 1,
  },
  // Status Banner Styles
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  bannerText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    lineHeight: 18,
  },
  bannerSubText: {
    fontFamily: "Jost-Regular",
    fontSize: 11,
    marginTop: 2,
    opacity: 0.8,
  },
  retryBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginLeft: 8,
  },
});