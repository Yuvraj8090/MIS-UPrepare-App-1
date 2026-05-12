import { View, Text, TouchableOpacity, Animated } from "react-native";
import React from "react";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { getFromSS } from "../../../services/storage/SecureStore";
import { fetchSubProjects } from "../../../services/api/fetch";
import { useNetConnected } from "@/services/helper";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import AllprojectTable from "@/components/TableComponents/AllProjectTable";
import { Feather } from "@expo/vector-icons";

const AllProjectScreen = () => {
  const [projectData, setProjectData] = React.useState([]);
  const [load, setLoad] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [heroMeasuredHeight, setHeroMeasuredHeight] = React.useState(0);

  const isInternet = useNetConnected();
  const { user } = useAuth();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const getProjectsData = React.useCallback(async () => {
    try {
      const authToken = await getFromSS("authToken");

      if (!authToken) {
        setProjectData([]);
        setErrorMessage("Your session has expired. Please sign in again.");
        return;
      }

      const res = await fetchSubProjects(authToken);
      const subProjects = res?.data?.sub_packages;

      if (Array.isArray(subProjects)) {
        setProjectData(subProjects);
        setErrorMessage("");
        return;
      }

      setProjectData([]);
      setErrorMessage(
        res?.data?.msg || "We couldn't load the sub-projects right now."
      );

    } catch (error) {
      console.error("[getProjectsData] Critical Exception during fetch:", error);
      setProjectData([]);
      setErrorMessage("An unexpected error occurred while connecting to the server.");
    }
  }, []);

  const fetchDataBasedOnConnectivity = React.useCallback(async () => {
    setLoad(true);

    try {
      if (isInternet === false) {
        setErrorMessage(
          "You're offline. Reconnect to refresh the latest sub-project updates.",
        );
        setProjectData((current) => current);
        return;
      }

      await getProjectsData();
    } catch (error) {
      console.error("Error fetching project list:", error);
      setErrorMessage("Something went wrong while loading sub-projects.");
    } finally {
      setLoad(false);
    }
  }, [getProjectsData, isInternet]);

  React.useEffect(() => {
    if (isInternet === null) {
      return;
    }

    fetchDataBasedOnConnectivity();
  }, [fetchDataBasedOnConnectivity, isInternet]);

  const handleRefresh = React.useCallback(async () => {
    setRefresh(true);
    await fetchDataBasedOnConnectivity();
    setRefresh(false);
  }, [fetchDataBasedOnConnectivity]);

  const handleHeroLayout = React.useCallback(
    (event) => {
      const measuredHeight = event?.nativeEvent?.layout?.height ?? 0;

      if (!measuredHeight || measuredHeight === heroMeasuredHeight) {
        return;
      }

      setHeroMeasuredHeight(measuredHeight);
    },
    [heroMeasuredHeight]
  );

  const collapseDistance = React.useMemo(() => {
    if (!heroMeasuredHeight) {
      return 120;
    }

    return Math.max(96, Math.min(heroMeasuredHeight, 160));
  }, [heroMeasuredHeight]);

  const clampedScrollY = React.useMemo(
    () => Animated.diffClamp(scrollY, 0, collapseDistance),
    [collapseDistance, scrollY]
  );

  const heroContainerHeight = clampedScrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [heroMeasuredHeight || 1, 0],
    extrapolate: "clamp",
  });

  const heroContainerMarginTop = clampedScrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [16, 0],
    extrapolate: "clamp",
  });

  const heroTranslateY = clampedScrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [0, -18],
    extrapolate: "clamp",
  });

  const heroOpacity = clampedScrollY.interpolate({
    inputRange: [0, collapseDistance * 0.8, collapseDistance],
    outputRange: [1, 0.12, 0],
    extrapolate: "clamp",
  });

  const heroScale = clampedScrollY.interpolate({
    inputRange: [0, collapseDistance],
    outputRange: [1, 0.985],
    extrapolate: "clamp",
  });

  const handleTableScroll = React.useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      }),
    [scrollY]
  );

  const totalProjects = projectData.length;
  const totalEPCProjects = projectData.filter(
    (item) => item?.type_of_procurement === "EPC",
  ).length;
  const totalItemRateProjects = projectData.filter(
    (item) => item?.type_of_procurement === "Item-Rate",
  ).length;
  const activeTeamName =
    typeof user?.department === "object"
      ? user?.department?.name || "PWD"
      : user?.department || "PWD";

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"All Sub-Projects"} GoBack={true} />

      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.heroCardContainer,
            {
              height: heroMeasuredHeight ? heroContainerHeight : undefined,
              marginTop: heroContainerMarginTop,
              opacity: heroMeasuredHeight ? 1 : 0,
            },
          ]}
        >
          <Animated.View
            onLayout={handleHeroLayout}
            style={[
              styles.heroCard,
              {
                transform: [{ translateY: heroTranslateY }, { scale: heroScale }],
                opacity: heroOpacity,
              },
            ]}
          >
            <View style={styles.heroTopRow}>
              <View style={styles.heroCopy}>
                <Text style={styles.eyebrow}>Project Workspace</Text>
                <Text style={styles.heroTitle}>Track progress with clarity</Text>
              </View>

              <View style={styles.statusPill}>
                <Feather
                  name={isInternet === false ? "wifi-off" : "wifi"}
                  size={14}
                  color={isInternet === false ? "#b54708" : "#027a48"}
                />
                <Text
                  style={[
                    styles.statusText,
                    { color: isInternet === false ? "#b54708" : "#027a48" },
                  ]}
                >
                  {isInternet === false ? "Offline" : "Live"}
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{totalProjects}</Text>
                <Text style={styles.metricLabel}>Sub-projects</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{totalEPCProjects}</Text>
                <Text style={styles.metricLabel}>EPC projects</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{totalItemRateProjects}</Text>
                <Text style={styles.metricLabel}>BOQ projects</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{activeTeamName}</Text>
                <Text style={styles.metricLabel}>Active team</Text>
              </View>
            </View>
          </Animated.View>
        </Animated.View>

        {errorMessage ? (
          <View style={styles.noticeCard}>
            <View style={styles.noticeContent}>
              <Feather
                name={isInternet === false ? "alert-triangle" : "info"}
                size={16}
                color={isInternet === false ? "#b54708" : "#1d4ed8"}
              />
              <Text
                style={[
                  styles.noticeText,
                  { color: isInternet === false ? "#b54708" : "#1d4ed8" },
                ]}
              >
                {errorMessage}
              </Text>
            </View>
            {isInternet !== false ? (
              <TouchableOpacity
                style={styles.retryButton}
                activeOpacity={0.85}
                onPress={fetchDataBasedOnConnectivity}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        <AllprojectTable
          refresh={refresh}
          handleRefresh={handleRefresh}
          projectData={projectData}
          loading={load}
          isInternet={isInternet}
          onTableScroll={handleTableScroll}
        />
      </View>
    </View>
  );
};

export default AllProjectScreen;
