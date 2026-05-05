import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import styles from "./styles";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import PhaseActivites from "@/components/TableComponents/PhaseActivities";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchPhasesSubActivitiesByPID } from "@/services/api/fetch";
import { useIsFocused } from "@react-navigation/native";
import {
  fetchPhasesSubActivitiesData,
  saveSqlPhaseSubActivities,
} from "@/services/database/database";
import { NetConnected } from "@/services/helper";

const PhaseSubActivites = (props) => {
  const { parentData, data } = props?.route?.params;
  // console.log("DTATATA ::", parentData);
  // console.log("TITLEEE ::", data);

  const [subActivites, setSubActivities] = useState([]);
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const isInternet = NetConnected();
  const IsFocused = useIsFocused();

  const fetchDataBasedOnConnectivity = useCallback(async () => {
    setLoad(true);
    try {
      if (isInternet) {
        console.log("Fetching data from the server...");
        await fetchPhaseSubActivites();
      } else {
        console.log("Fetching data from local storage...");
        await getPhaseSubActivitiesSql();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoad(false);
    }
  }, [isInternet]);

  useEffect(() => {
    fetchDataBasedOnConnectivity();
  }, [data, IsFocused, fetchDataBasedOnConnectivity]);

  const getPhaseSubActivitiesSql = async () => {
    var IdData = {
      type_id: parentData?.type_id,
      project_id: parentData?.project_id,
      activities_id: data?.id,
    };

    try {
      await fetchPhasesSubActivitiesData(IdData).then((res) => {
        // console.log("RESS PHASEE ACTivitiess  SQL ::", res);
        setSubActivities(res);
      });
    } catch (error) {
      console.log("Erorooo ::", error);
    }
  };

  const handleRefresh = () => {
    setLoad(true);
    setRefresh(true);
    fetchDataBasedOnConnectivity();
    setTimeout(() => {
      setLoad(false);
      setRefresh(false);
    }, 1500);
  };

  const fetchPhaseSubActivites = async () => {
    const authToken = await getFromSS("authToken");

    var formData = {
      type_id: parentData?.type_id,
      project_id: parentData?.project_id,
      activity_id: data?.id,
    };

    try {
      const res = await fetchPhasesSubActivitiesByPID(formData, authToken);
      //   console.log("RESS ::", res?.data?.records);
      setSubActivities(res?.data?.records);

      const storeSql = {
        type_id: parentData?.type_id,
        project_id: parentData?.project_id,
        activities_id: data?.id,
        data: res?.data?.records,
      };
      await saveSqlPhaseSubActivities(storeSql);
    } catch (error) {
      console.log("Error :", error);
    } finally {
      setLoad(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={parentData?.name} GoBack={true} />

      {load ? (
        <ActivityIndicator size="small" color="#000" />
      ) : (
        <View>
          <PhaseActivites
            Title={`${parentData?.name} | ${data?.name}`}
            data={subActivites}
            refresh={refresh}
            handleRefresh={handleRefresh}
            {...props}
          />
        </View>
      )}
    </View>
  );
};

export default PhaseSubActivites;
