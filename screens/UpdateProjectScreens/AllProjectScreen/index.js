import React from "react";
import { View } from "react-native";

import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { getFromSS } from "../../../services/storage/SecureStore";
import { fetchSubProjects } from "../../../services/api/fetch";
import { fetchUserProjectData } from "@/services/database/database";
import { NetConnected } from "@/services/helper";
import AllprojectTable from "@/components/TableComponents/AllProjectTable";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";
import styles from "./styles";

const normaliseSubProjects = (response) => {
  const subProjects = response?.data?.sub_packages;
  return Array.isArray(subProjects) ? subProjects : [];
};

const AllProjectScreen = () => {
  const [projectData, setProjectData] = React.useState([]);
  const [load, setLoad] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  const isInternet = NetConnected();
  const { refreshMap } = useUpdateFlow();
  const refreshVersion = refreshMap[UPDATE_REFRESH_KEYS.allProjects] || 0;
  const screenActiveRef = React.useRef(true);
  const loadTimerRef = React.useRef(null);

  const stopLoadingWithDelay = React.useCallback((delayMs = 0) => {
    if (loadTimerRef.current) {
      clearTimeout(loadTimerRef.current);
    }

    loadTimerRef.current = setTimeout(() => {
      if (screenActiveRef.current) {
        setLoad(false);
      }
    }, delayMs);
  }, []);

  React.useEffect(() => {
    screenActiveRef.current = true;

    return () => {
      screenActiveRef.current = false;

      if (loadTimerRef.current) {
        clearTimeout(loadTimerRef.current);
      }
    };
  }, []);

  const getProjectSql = React.useCallback(async () => {
    setLoad(true);

    try {
      const storedProjects = await fetchUserProjectData();

      if (screenActiveRef.current) {
        setProjectData(Array.isArray(storedProjects) ? storedProjects : []);
      }
    } catch (error) {
      console.log("Project SQL read error:", error);

      if (screenActiveRef.current) {
        setProjectData([]);
      }
    } finally {
      stopLoadingWithDelay(250);
    }
  }, [stopLoadingWithDelay]);

  const getProjectsData = React.useCallback(async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);

    if (!authToken) {
      if (screenActiveRef.current) {
        setProjectData([]);
      }

      stopLoadingWithDelay(0);
      return;
    }

    try {
      const response = await fetchSubProjects(authToken);
      const nextProjects = normaliseSubProjects(response);

      if (screenActiveRef.current) {
        setProjectData(nextProjects);
      }
    } catch (error) {
      console.log("Sub-project fetch error:", error);

      if (screenActiveRef.current) {
        setProjectData([]);
      }
    } finally {
      stopLoadingWithDelay(250);
    }
  }, [stopLoadingWithDelay]);

  const fetchDataBasedOnConnectivity = React.useCallback(async () => {
    if (isInternet === null) {
      setLoad(true);
      return;
    }

    if (isInternet) {
      await getProjectsData();
      return;
    }

    await getProjectSql();
  }, [getProjectSql, getProjectsData, isInternet]);

  React.useEffect(() => {
    fetchDataBasedOnConnectivity();
  }, [fetchDataBasedOnConnectivity, refreshVersion]);

  const handleRefresh = React.useCallback(() => {
    setRefresh(true);

    fetchDataBasedOnConnectivity().finally(() => {
      if (screenActiveRef.current) {
        setRefresh(false);
      }
    });
  }, [fetchDataBasedOnConnectivity]);

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"All Sub-Projects"} GoBack={true} />

      <View style={{ flex: 1 }}>
        <AllprojectTable
          refresh={refresh}
          handleRefresh={handleRefresh}
          projectData={projectData}
          loading={load}
        />
      </View>
    </View>
  );
};

export default AllProjectScreen;
