import { View, Text, TouchableOpacity } from "react-native";
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

  const getProjectsData = React.useCallback(async () => {
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
      res?.data?.msg || "We couldn't load the sub-projects right now.",
    );
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

  const totalProjects = projectData.length;
  const epcProjects = projectData.filter(
    (item) => item?.type_of_procurement === "EPC",
  ).length;
  const activeTeamName =
    typeof user?.department === "object"
      ? user?.department?.name || "PWD"
      : user?.department || "PWD";

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"All Sub-Projects"} GoBack={true} />

      <View style={styles.contentContainer}>
        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroCopy}>
              <Text style={styles.eyebrow}>Project Workspace</Text>
              <Text style={styles.heroTitle}>Track progress with clarity</Text>
              <Text style={styles.heroSubtitle}>
                Review sub-project health, drill into progress streams, and
                move quickly to milestone, BOQ, EPC, and safeguard updates.
              </Text>
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
              <Text style={styles.metricValue}>{epcProjects}</Text>
              <Text style={styles.metricLabel}>EPC projects</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{activeTeamName}</Text>
              <Text style={styles.metricLabel}>Active team</Text>
            </View>
          </View>
        </View>

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
        />
      </View>
    </View>
  );
};

export default AllProjectScreen;
