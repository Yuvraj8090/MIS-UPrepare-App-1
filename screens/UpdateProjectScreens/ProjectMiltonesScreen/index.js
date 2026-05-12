import { View, ActivityIndicator, Text } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import {
  fetchProjectPhasesByPID,
  fetchProjectsMilestonesByPId,
} from "../../../services/api/fetch";
import { getFromSS } from "../../../services/storage/SecureStore";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import ProjectActivitiesMilestone from "../../../components/TableComponents/ProjectActiviteMilestone";
import {
  fetchProjectMilestonesData,
  fetchProjectPhasesData,
  saveSqlProjectActivities,
  saveSqlProjectMilestone,
} from "@/services/database/database";
import { NetConnected } from "@/services/helper";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "@/constants/theme";

const ProjectMilestones = (props) => {
  const { data } = props?.route?.params;

  const [projectMilestonesData, setProjectMilestonesData] = useState([]);
  const [projectPhasesData, setProjectPhasesData] = useState([]);
  const [load, setLoad] = useState(true);

  const { user } = useAuth();
  const IsFocused = useIsFocused();
  const isInternet = NetConnected();
  const { refreshMap } = useUpdateFlow();
  const refreshVersion = refreshMap[UPDATE_REFRESH_KEYS.projectMilestones] || 0;

  const fetchProjectData = useCallback(async () => {
    setLoad(true);
    try {
      if (
        ["FIELD-PWD-ENVIRONMENT", "FIELD-PWD-SOCIAL"].includes(
          user?.role?.department
        ) ||
        ["FIELD-PWD-ENVIRONMENT", "FIELD-PWD-SOCIAL"].includes(
          user?.role_department
        )
      ) {
        if (isInternet) {
          getProjectsPhasesByPID(data?.id);
        } else {
          await getProjectPhasesSql(data?.id);
        }
      } else {
        if (isInternet) {
          await getProjectsMilestoneByPID(data?.project_id);
        } else {
          await getProjectMilestoneSql(data?.project_id);
        }
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
    } finally {
      setLoad(false);
    }
  }, [data, isInternet, user, IsFocused, refreshVersion]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

  const getProjectMilestoneSql = async (PID) => {
    try {
      await fetchProjectMilestonesData(PID).then((res) => {
        setProjectMilestonesData(res);
      });
    } catch (error) {
      console.log("Milestone local fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  const getProjectPhasesSql = async (PID) => {
    try {
      await fetchProjectPhasesData(PID).then((res) => {
        setProjectPhasesData(res);
      });
    } catch (error) {
      console.log("Phase local fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  const getProjectsMilestoneByPID = async (PID) => {
    const authToken = await getFromSS("authToken");

    var formData = {
      project_id: PID,
    };

    try {
      const res = await fetchProjectsMilestonesByPId(formData, authToken);
      if (res?.data) {
        setProjectMilestonesData(res?.data?.milestones);
        const storeSql = {
          project_id: data?.project_id,
          data: res?.data?.milestones,
        };
        await saveSqlProjectMilestone(storeSql);
      }
    } catch (error) {
      console.log("Milestone remote fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  const getProjectsPhasesByPID = async (ID) => {
    const authToken = await getFromSS("authToken");

    var formData = {
      project_id: ID,
    };

    try {
      const res = await fetchProjectPhasesByPID(formData, authToken);
      if (res?.data) {
        setProjectPhasesData(res?.data?.phases);
        const storeSql = {
          project_id: data?.id,
          data: res?.data?.phases,
        };
        await saveSqlProjectActivities(storeSql);
      }
    } catch (error) {
      console.log("Phase remote fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={["bottom"]}>
      <CustomHeader
        Title={
          user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
          user?.role?.department == "FIELD-PWD-SOCIAL" ||
          user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
          user?.role_department == "FIELD-PWD-SOCIAL"
            ? "Environment Safeguard Activities"
            : "Project Milestones"
        }
        GoBack={true}
      />

      {load ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loaderText}>Loading progress workflow...</Text>
        </View>
      ) : (
        <View style={styles.contentWrap}>
          <ProjectActivitiesMilestone
            project={data}
            data={
              user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
              user?.role?.department == "FIELD-PWD-SOCIAL" ||
              user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
              user?.role_department == "FIELD-PWD-SOCIAL"
                ? projectPhasesData
                : projectMilestonesData
            }
            refreshing={load}
            onRefresh={fetchProjectData}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProjectMilestones;
