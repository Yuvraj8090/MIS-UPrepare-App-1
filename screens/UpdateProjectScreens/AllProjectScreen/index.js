import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React from "react";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { getFromSS } from "../../../services/storage/SecureStore";
import {
  fetchPackages,
  fetchProjects,
  fetchSubProjects,
} from "../../../services/api/fetch";
import AllPackageTable from "../../../components/TableComponents/AllPackageTable";
import {
  fetchUserProjectData,
  saveSqlProjectData,
} from "@/services/database/database";
import { NetConnected } from "@/services/helper";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import AllprojectTable from "@/components/TableComponents/AllProjectTable";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";

const AllProjectScreen = () => {
  const [projectData, setProjectData] = React.useState([]);
  const [load, setLoad] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  const isInternet = NetConnected();
  const { user } = useAuth();
  const { refreshMap } = useUpdateFlow();
  const refreshVersion = refreshMap[UPDATE_REFRESH_KEYS.allProjects] || 0;

  React.useEffect(() => {
    fetchDataBasedOnConnectivity();
    // getProjectSql();
  }, [isInternet, refreshVersion]);

  const fetchDataBasedOnConnectivity = async () => {
    setLoad(true);
    try {
      if (isInternet) {
        console.log("Fetching data from the server...");
        await getProjectsData();
      } else {
        console.log("Fetching data from local storage...");
        // await getProjectSql();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoad(false);
      }, 3000);
    }
  };

  const getProjectSql = async () => {
    setLoad(true);
    try {
      await fetchUserProjectData(user?.id).then((res) => {
        // console.log("RESS PROJECTT SQL ::", res);
        setProjectData(res);
      });
    } catch (error) {
      console.log("Eroro ::", error);
    }
  };

  const getProjectsData = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    try {
      const res = await fetchSubProjects(authToken);
      console.log("RESSSS Sub-Projects::", res);
      if (res?.data) {
        setProjectData(res?.data?.sub_packages);
        // const storeSql = {
        //   userId: user?.id,
        //   access_token: authToken,
        //   data: res?.data?.projects,
        // };
        // await saveSqlProjectData(storeSql);
      }
    } catch (error) {
      console.log("error ::", error);
    } finally {
      setTimeout(() => {
        setLoad(false);
      }, 2000);
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    fetchDataBasedOnConnectivity();
    setTimeout(() => setRefresh(false), 1000);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"All Sub-Projects"} GoBack={true} />

      {/* {load ? (
        <>
          <ActivityIndicator size="small" color="#000" />
        </>
      ) : (
        <> */}
      <View>
        <AllprojectTable
          refresh={refresh}
          handleRefresh={handleRefresh}
          projectData={projectData}
          loading={load}
        />
      </View>
      {/* </>
      )} */}
    </View>
  );
};

export default AllProjectScreen;
