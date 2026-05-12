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

  const isInternet = useNetConnected();
  const { user } = useAuth();
  const heroTranslateY = React.useRef(new Animated.Value(0)).current;
  const heroOpacity = React.useRef(new Animated.Value(1)).current;
  const heroScale = React.useRef(new Animated.Value(1)).current;
  const lastScrollOffset = React.useRef(0);
  const heroHiddenRef = React.useRef(false);
  const scrollHideThreshold = 24;
  const scrollShowThreshold = 12;

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

  const showHeroCard = React.useCallback(() => {
    if (!heroHiddenRef.current) {
      return;
    }

    heroHiddenRef.current = false;

    Animated.parallel([
      Animated.timing(heroTranslateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroOpacity, heroScale, heroTranslateY]);

  const hideHeroCard = React.useCallback(() => {
    if (heroHiddenRef.current) {
      return;
    }

    heroHiddenRef.current = true;

    Animated.parallel([
      Animated.timing(heroTranslateY, {
        toValue: -22,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(heroScale, {
        toValue: 0.96,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [heroOpacity, heroScale, heroTranslateY]);

  const handleTableScroll = React.useCallback(
    (event) => {
      const currentOffset = event?.nativeEvent?.contentOffset?.y ?? 0;
      const diff = currentOffset - lastScrollOffset.current;

      if (currentOffset <= 4) {
        showHeroCard();
        lastScrollOffset.current = currentOffset;
        return;
      }

      if (diff > scrollHideThreshold) {
        hideHeroCard();
      } else if (diff < -scrollShowThreshold) {
        showHeroCard();
      }

      lastScrollOffset.current = currentOffset;
    },
    [hideHeroCard, showHeroCard]
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
            styles.heroCard,
            {
              transform: [
                { translateY: heroTranslateY },
                { scale: heroScale },
              ],
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
