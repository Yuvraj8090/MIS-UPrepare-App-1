import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  MaterialCommunityIcons,
  Octicons,
  MaterialIcons,
} from "@expo/vector-icons";
import styles from "./styles";
import AppHeader from "../../components/AppHeader/AppHeader";
import BigCard from "../../components/DashBoardComponent/BigCard";
import SmallCard from "../../components/DashBoardComponent/SmallCard";
import Charts from "../../components/DashBoardComponent/Charts/Charts";
import {
  fetchDashBoardData,
  fetchLocationData,
} from "../../services/api/fetch";
import { getFromSS } from "../../services/storage/SecureStore";
import { useAuth } from "../../navigation/AuthContext/AuthContext";
import PhotoCard from "../../components/PhotoCard";
import {
  saveDashboardData,
  fetchUserDashBoardData,
  fetchPhasesActivitiesImages,
} from "@/services/database/database";
import { NetConnected, width } from "@/services/helper";
import { PieChart } from "react-native-chart-kit";
import * as Location from "expo-location";
import TotalContracts from "../../components/DashBoardComponent/TotalContractsCard";
import PhysicalSubProjectProgressTable from "../../components/DashBoardComponent/PackageProgressTable";
import DepartmentOviewCharts from "../../components/DashBoardComponent/Charts/DepartmentOverview";
import ContractsDistributaionCharts from "../../components/DashBoardComponent/Charts/ContractDistribution";
import DepartmentPhysicalProgress from "../../components/DashBoardComponent/Charts/DepartmentPhysicalProgress";
import DepartmentFinanicalProgress from "../../components/DashBoardComponent/Charts/DepartmentFinancialProgress";

const data = [
  {
    name: "Completed",
    population: 45,
    color: "#4CAF50",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Pending",
    population: 35,
    color: "#CCC",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Pending",
    population: 12,
    color: "#3da1e9ff",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Pending",
    population: 25,
    color: "#b41111ff",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Pending",
    population: 16,
    color: "#473604ff",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Pending",
    population: 20,
    color: "#FFC107",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
  {
    name: "Failed",
    population: 30,
    color: "#F44336",
    legendFontColor: "#333",
    legendFontSize: 14,
  },
];

const DashboardScreen = () => {
  const [projectData, setProjectData] = useState([]);
  const [load, setLoad] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    // latitude: 30.3165, // Dehradun latitude
    // longitude: 78.0322, // Dehradun longitude
    // latitudeDelta: 0.05,
    // longitudeDelta: 0.05,
  });

  const [location, setLocation] = useState(null);
  const [dasboardData, setDashboardData] = useState(null);

  const { user } = useAuth();
  const isInternet = NetConnected();

  useEffect(() => {
    (async () => {
      // 1. Check existing permission
      const { status } = await Location.getForegroundPermissionsAsync();

      console.log("LOCATION STATUS:", status);

      if (status !== "granted") {
        const { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();

        if (newStatus !== "granted") {
          alert("Permission to access location was denied");
          return;
        }
      }

      // 2. Permission already granted → get location
      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    // fetchLocation();
  }, []);

  const fetchLocation = async () => {
    var formData = {
      // latitude: location?.coords?.latitude,
      // longitude: location?.coords?.longitude,
      latitude: 30.3268076, // Dehradun latitude
      longitude: 78.0350767,
    };

    console.log("LOCATIONN FORMDATA::", formData);
    try {
      const res = await fetchLocationData(formData);
      // console.log("RESSSS LOCATIONN::", res);
      // console.log("RESSSS LOCATIOON DATATA ::", res?.data);
      console.log("RESSSS ::", res?.data?.features);
      console.log("RESSSS ::", res?.data?.features[0].properties);

      // if (res?.data) {
      //   // ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      //   setAddress(res?.data?.features[0].properties);
      // } else {
      //   ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      // }
    } catch (error) {
      console.log("Error ::", error);
    }
  };

  // useEffect(() => {
  //   // fetchDataBasedOnConnectivity();
  // }, [isInternet]);

  // const fetchDataBasedOnConnectivity = async () => {
  //   setLoad(true);
  //   try {
  //     if (isInternet) {
  //       console.log("Fetching data from the server...");
  //       await getDashboardData();
  //     } else {
  //       console.log("Fetching data from local storage...");
  //       await getDashboardSql();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   } finally {
  //     setTimeout(() => {
  //       setLoad(false);
  //     }, 3000);
  //   }
  // };

  // const getDashboardSql = async () => {
  //   setLoad(true);
  //   try {
  //     await fetchUserDashBoardData().then((res) => {
  //       console.log("RESS SQL ::", res);
  //       setProjectData(res);
  //     });
  //   } catch (error) {
  //     console.log("Eroro ::", error);
  //   }
  //   // finally {
  //   //   setTimeout(() => {
  //   //     setLoad(false);
  //   //   }, 3000);
  //   // }
  // };

  useEffect(() => {
    getDashboardData();
  }, []);

  const getDashboardData = async () => {
    const authToken = await getFromSS("authToken");

    try {
      const res = await fetchDashBoardData(authToken);
      // console.log("RESSSS DASHBOARD ::", res?.data);
      if (res?.success) {
        setDashboardData(res?.data);
        // const storeSql = {
        //   userId: user?.id,
        //   access_token: authToken,
        //   data: res?.data,
        // };
        // await saveDashboardData(storeSql);
      }
    } catch (error) {
      console.log("error ::", error);
    } finally {
      setTimeout(() => {
        setLoad(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.mainContainer}>
      {/* <AppHeader Title={"U-Prepare"} /> */}

      {load ? (
        <>
          <ActivityIndicator
            size="small"
            color="#000"
            style={{ marginVertical: "5%" }}
          />
        </>
      ) : (
        <>
          {isInternet && !load && <PhotoCard />}
          <View style={localStyles.greetingBlock}>
            <Text style={localStyles.greetingText}>
              Hi, {user?.name}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={localStyles.scrollContent}
          >
            {/* <TotalContracts data={dasboardData?.contractsStatus} /> */}

            <DepartmentOviewCharts data={dasboardData} />
            <ContractsDistributaionCharts data={dasboardData} />
            <DepartmentPhysicalProgress data={dasboardData} />
            <DepartmentFinanicalProgress data={dasboardData} />

            {/* <Charts data={dasboardData} /> */}

            <PhysicalSubProjectProgressTable
              data={dasboardData?.sub_projects}
            />

            <View style={styles.container}>
              {/* <View>
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 18,
                    fontFamily: "Jost-Medium",
                    color: "#73879C",
                  }}
                >
                  Task Progress
                </Text>
                <View style={{ position: "relative" }}>
                  <PieChart
                    data={data}
                    width={width - 20}
                    height={220}
                    chartConfig={{
                      backgroundColor: "#fff",
                      backgroundGradientFrom: "#fff",
                      backgroundGradientTo: "#fff",
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                  />

                  
                  <View
                    style={{
                      position: "absolute",
                      top: 70,
                      left: (width - 20) / 5,
                      width: 80,
                      height: 80,
                      borderRadius: 50,
                      backgroundColor: "white",
                    }}
                  />
                </View>
              </View> */}

              {/* <SmallCard
                data={projectData?.totalProjects}
                // totalData={1000}
                title={"Total Projects"}
                // navPath={"EnquiryScreen"}
                bgColor={"#4ca2ff"}
                icon={
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={35}
                    color="#fff"
                  />
                }
              />
              <SmallCard
                data={projectData?.Ongoing}
                // totalData={1000}
                title={"Ongoing Projects"}
                // navPath={"EnquiryScreen"}
                bgColor={"#FF6500"}
                icon={
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={35}
                    color="#fff"
                  />
                }
              />

              <BigCard
                data={projectData?.completed}
                // totalData={1000}
                title={"Completed Projects"}
                // navPath={"EnquiryScreen"}
                bgColor={"#F4CE14"}
                icon={
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={35}
                    color="#fff"
                  />
                }
              />
              <BigCard
                data={projectData?.expenses}
                // totalData={1000}
                title={"Total Expense"}
                // navPath={"EnquiryScreen"}
                bgColor={"#059212"}
                icon={
                  <MaterialCommunityIcons
                    name="newspaper-variant-outline"
                    size={35}
                    color="#fff"
                  />
                }
              /> */}
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default DashboardScreen;

const localStyles = StyleSheet.create({
  greetingBlock: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  greetingText: {
    fontFamily: "Jost-Medium",
    fontSize: 26,
    color: "#0f172a",
  },
  scrollContent: {
    paddingBottom: 28,
  },
});
