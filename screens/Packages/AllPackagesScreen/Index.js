import { View, StyleSheet } from "react-native";
import React from "react";

import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { getFromSS } from "../../../services/storage/SecureStore";
import { fetchPackages } from "../../../services/api/fetch";
import { NetConnected } from "@/services/helper";
import AllPackageTable from "@/components/TableComponents/AllPackageTable";
import {
  getPackageCacheAgeLabel,
  isPackageCacheFresh,
  readPackageCache,
  writePackageCache,
} from "@/services/packages/cache";

const AllPackagesScreen = () => {
  const [packageData, setPackageData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [cacheMessage, setCacheMessage] = React.useState("");
  const [isStaleData, setIsStaleData] = React.useState(false);
  const isInternet = NetConnected();

  React.useEffect(() => {
    bootstrapPackages();
  }, [isInternet]);

  const bootstrapPackages = async () => {
    setLoading(true);
    setErrorMessage("");

    const cached = await readPackageCache();

    if (cached?.items?.length) {
      setPackageData(cached.items);
      setCacheMessage(getPackageCacheAgeLabel(cached.timestamp) || "");
      setIsStaleData(!isPackageCacheFresh(cached.timestamp));
    }

    if (isInternet === false && cached?.items?.length) {
      setLoading(false);
      setErrorMessage("Showing saved package data while you are offline.");
      return;
    }

    if (isInternet === false && !cached?.items?.length) {
      setLoading(false);
      setErrorMessage("No internet connection and no saved package data found.");
      return;
    }

    if (isInternet) {
      await getPackagesData({ isRefresh: false });
      return;
    }

    setLoading(false);
  };

  const getPackagesData = async ({ isRefresh = false } = {}) => {
    const authToken = await getFromSS("authToken");

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await fetchPackages(authToken);

      if (res?.status >= 400 || res?.ok === false) {
        throw new Error(res?.data?.msg || "Unable to load packages right now.");
      }

      const packages = res?.data?.packages || [];
      setPackageData(packages);
      setErrorMessage("");
      setIsStaleData(false);

      const cache = await writePackageCache(packages);
      setCacheMessage(getPackageCacheAgeLabel(cache.timestamp) || "");
    } catch (error) {
      const cached = await readPackageCache();

      if (cached?.items?.length) {
        setPackageData(cached.items);
        setCacheMessage(getPackageCacheAgeLabel(cached.timestamp) || "");
        setIsStaleData(true);
        setErrorMessage(
          "Could not refresh packages. Showing the most recent saved data."
        );
      } else {
        setErrorMessage(
          error?.message || "Unable to load packages. Please try again."
        );
      }
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
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

  return (
    <View style={styles.screen}>
      <CustomHeader Title={"All Packages"} GoBack={true} />
      <View style={styles.content}>
        <AllPackageTable
          refresh={refreshing}
          handleRefresh={handleRefresh}
          projectData={packageData}
          loading={loading}
          errorMessage={errorMessage}
          cacheMessage={cacheMessage}
          isStaleData={isStaleData}
          isOnline={isInternet}
          onRetry={() => getPackagesData({ isRefresh: false })}
        />
      </View>
    </View>
  );
};

export default AllPackagesScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  content: {
    flex: 1,
  },
});
