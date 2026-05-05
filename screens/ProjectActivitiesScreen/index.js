import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchPhasesActivitiesByPID } from "@/services/api/fetch";
import { useNavigation } from "@react-navigation/native";
import PhaseActivites from "../../components/TableComponents/PhaseActivities";
import {
  fetchPhasesActivitiesData,
  saveSqlPhaseActivities,
} from "@/services/database/database";
import { NetConnected } from "@/services/helper";
import { useIsFocused } from "@react-navigation/native";

const ProjectActiviteScreen = (props) => {
  const { data } = props?.route?.params;

  const navigation = useNavigation();

  const [load, setLoad] = useState(true);
  const [phaseActivites, setPhaseActivities] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const isInternet = NetConnected();
  const IsFocused = useIsFocused();

  const fetchDataBasedOnConnectivity = useCallback(async () => {
    setLoad(true);
    try {
      if (isInternet) {
        console.log("Fetching data from the server...");
        await fetchPhasesActivites();
      } else {
        console.log("Fetching data from local storage...");
        await getPhaseActivitiesSql();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoad(false);
      }, 2000);
    }
  }, [isInternet]);

  useEffect(() => {
    fetchDataBasedOnConnectivity();
  }, [data, IsFocused, fetchDataBasedOnConnectivity]);

  const getPhaseActivitiesSql = async () => {
    var IdData = {
      type_id: data?.type_id,
      project_id: data?.project_id,
    };
    try {
      await fetchPhasesActivitiesData(IdData).then((res) => {
        // console.log("RESS PHASEE ACTivitiess  SQL ::", res);
        setPhaseActivities(res);
      });
    } catch (error) {
      console.log("Eroro ::", error);
    }
  };

  const fetchPhasesActivites = async () => {
    const authToken = await getFromSS("authToken");

    var formData = {
      type_id: data?.type_id,
      project_id: data?.project_id,
    };

    // console.log("FORMDATATA ::", formData);

    try {
      const res = await fetchPhasesActivitiesByPID(formData, authToken);
      // console.log("RESSS ::", res);
      setPhaseActivities(res?.data?.records);
      const storeSql = {
        project_id: data?.project_id,
        type_id: data?.type_id,
        data: res?.data?.records,
      };
      await saveSqlPhaseActivities(storeSql);
    } catch (error) {
      console.log("Error ::", error);
    } finally {
      setLoad(false);
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    fetchPhasesActivites();

    setTimeout(() => {
      setRefresh(false);
    }, 1000);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={data?.name} GoBack={true} />

      {load ? (
        <>
          <ActivityIndicator size="small" color="#000" />
        </>
      ) : (
        <>
          <View>
            <PhaseActivites
              data={phaseActivites}
              handleRefresh={handleRefresh}
              Title={data?.name}
              refresh={refresh}
              {...props}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ProjectActiviteScreen;
