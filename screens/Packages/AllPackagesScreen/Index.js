import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";
import React from "react";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { getFromSS } from "../../../services/storage/SecureStore";
import { fetchPackages, fetchProjects } from "../../../services/api/fetch";
import AllProjectTable from "../../../components/TableComponents/AllProjectTable";
import {
  fetchUserProjectData,
  saveSqlProjectData,
} from "@/services/database/database";
import { NetConnected } from "@/services/helper";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import AllPackageTable from "@/components/TableComponents/AllPackageTable";
import { useNavigation } from "@react-navigation/native";

const AllPackagesScreen = () => {
  const [packageData, setPackageData] = React.useState([]);
  const [load, setLoad] = React.useState(true);
  const [refresh, setRefresh] = React.useState(false);
  const isInternet = NetConnected();
  const { user } = useAuth();

  React.useEffect(() => {
    fetchDataBasedOnConnectivity();
    // getProjectSql();
  }, [isInternet]);

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
        setPackageData(res);
      });
    } catch (error) {
      console.log("Eroro ::", error);
    }
  };

  const getProjectsData = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    try {
      const res = await fetchPackages(authToken);
      console.log("RESSSS  Packagess::", res);
      if (res?.data) {
        setPackageData(res?.data?.packages);
        // const storeSql = {
        //   userId: user?.id,
        //   access_token: authToken,
        //   data: res?.data?.projects,
        // };
        // await saveSqlProjectData(storeSql);
        setTimeout(() => {
          setLoad(false);
        }, 2000);
      }
    } catch (error) {
      console.log("error ::", error);
      setLoad(false);
    } finally {
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    fetchDataBasedOnConnectivity();
    setTimeout(() => setRefresh(false), 1000);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <CustomHeader Title={"All Packages"} GoBack={true} />

      {/* {load ? (
        <>
          <ActivityIndicator size="small" color="#000" style={{marginTop:"2%"}} />
        </>
      ) : (
        <> */}
      <View>
        <AllPackageTable
          refresh={refresh}
          handleRefresh={handleRefresh}
          projectData={packageData}
          loading={load}
        />
      </View>
      {/* </>
      )} */}
    </View>
  );
};

export default AllPackagesScreen;
