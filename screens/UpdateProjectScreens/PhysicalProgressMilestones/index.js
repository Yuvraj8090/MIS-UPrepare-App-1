import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import * as Progress from "react-native-progress";
import styles from "./styles";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import { NetConnected, width } from "../../../services/helper";
import {
  fetchPhysicalProgressByMId,
  fetchProjectsMilestonesByPId,
} from "../../../services/api/fetch";
import { getFromSS } from "../../../services/storage/SecureStore";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import BottomButton from "@/components/Button/BottomButton";
import {
  fetchMilestonePhysicalProgressData,
  saveSqlMilestonePhysicalProgress,
} from "@/services/database/database";

const milestonesDummyData = [
  {
    id: 1,
    name: "Building Construction Progress",
    percentage: "20%",
    date: "2025-08-01",
  },
  {
    id: 2,
    name: "Building Construction Progress",
    percentage: "40%",
    date: "2025-08-10",
  },
  {
    id: 3,
    name: "Building Construction Progress",
    percentage: "60%",
    date: "2025-08-18",
  },
  {
    id: 4,
    name: "Building Construction Progress",
    percentage: "80%",
    date: "2025-08-25",
  },
  {
    id: 5,
    name: "Building Construction Progress",
    percentage: "100%",
    date: null, // Not Mentioned
  },
];

const PhysicalProgressMilestone = (props) => {
  const { milestone_id } = props?.route?.params;
  console.log("MIDD ::", milestone_id);
  const [milestonesData, setMilestonesData] = useState([]);
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [totalPer, setTotalPer] = useState("");
  const [remainingPer, setremainingPer] = useState("");

  const navigation = useNavigation();
  const IsFocused = useIsFocused();
  const isInternet = NetConnected();

  const fetchDataBasedOnConnectivity = useCallback(
    async (MID) => {
      setLoad(true);
      console.log("MIDD INDSIDEE::", MID);
      try {
        if (isInternet) {
          console.log("Fetching data from the server...");
          await getPhysicalProgressByMID(MID);
        } else {
          console.log("Fetching data from local storage...");
          await getMilestonePhysicalProgressSql(MID);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setLoad(false);
        }, 3000);
      }
    },
    [isInternet]
  );

  useEffect(() => {
    fetchDataBasedOnConnectivity(milestone_id);
  }, [milestone_id, IsFocused, fetchDataBasedOnConnectivity]);

  const getMilestonePhysicalProgressSql = async (MID) => {
    try {
      const res = await fetchMilestonePhysicalProgressData(MID);
      console.log("Fetched Milestone Physical Progress from SQL:", res);
      setMilestonesData(res);
      CheckAvailabileMilestone(res);
    } catch (error) {
      console.error("Error fetching data from SQL:", error);
    }
  };

  const getPhysicalProgressByMID = async (MID) => {
    setLoad(true);
    const authToken = await getFromSS("authToken");

    try {
      const formData = { milestone_id: MID };
      const res = await fetchPhysicalProgressByMId(formData, authToken);
      console.log("Fetched Physical Progress by MID:", res);

      if (res?.data) {
        setMilestonesData(res?.data);
        CheckAvailabileMilestone(res?.data?.milestone?.records);
        await saveSqlMilestonePhysicalProgress(res?.data?.milestone);
      }
    } catch (error) {
      console.error("Error fetching physical progress by MID:", error);
    } finally {
      setLoad(false);
    }
  };

  const CheckAvailabileMilestone = (data) => {
    const totalPercentage = data?.reduce(
      (total, item) => total + item?.percentage,
      0
    );

    const remainingPercentage = 100 - totalPercentage;
    // console.log("PERMMENEtt", totalPercentage);
    setTotalPer(totalPercentage);
    setremainingPer(remainingPercentage);
  };

  const handleRefresh = () => {
    setRefresh(true);
    // Simulate fetching new data
    // getPhysicalProgressByMID(milestone_id);
    fetchDataBasedOnConnectivity(milestone_id);
    setTimeout(() => setRefresh(false), 1000); // Simulating async refresh
  };

  const handleNext = () => {
    navigation.navigate("PhysicalProgressForm", {
      data: milestonesData,
      remainProgress: remainingPer,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <View>
        <CustomHeader Title={"Physical Progress of Milestones"} GoBack={true} />
        {/* <Text>ProjectMilestones</Text> */}

        {load ? (
          <>
            <ActivityIndicator size="small" color="#000" />
          </>
        ) : (
          <>
            <View>
              <View style={TableStyles.table}>
                {milestonesData?.milestone?.records?.length > 0 ||
                milestonesData?.length > 0 ||
                milestonesDummyData?.length > 0 ? (
                  <>
                    <FlatList
                      // data={
                      //   isInternet
                      //     ? milestonesData?.milestone?.records
                      //     : milestonesData
                      // }
                      data={milestonesDummyData}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      refreshControl={
                        <RefreshControl
                          refreshing={refresh}
                          onRefresh={handleRefresh}
                        />
                      }
                      ListHeaderComponent={
                        <>
                          <View>
                            <Text
                              style={{
                                fontFamily: "Jost-Medium",
                                fontSize: 16,
                                margin: "2%",
                                color: "#777",
                              }}
                            >
                              {/* {isInternet
                                ? milestonesData?.milestone?.name
                                : milestonesData[0]?.name} */}
                                Building Construction Progress
                            </Text>
                          </View>

                          <View style={TableStyles.row}>
                            <Text style={TableStyles.headerSnoCell}>S.No.</Text>
                            <Text style={TableStyles.headerCell}>
                              Progress (in %)
                            </Text>
                            <Text style={TableStyles.headerCell}>Date</Text>
                            <Text style={TableStyles.headerCell}>
                              Add Image
                            </Text>
                          </View>
                        </>
                      }
                      renderItem={({ item, index }) => {
                        return (
                          <View style={TableStyles.row}>
                            <View style={TableStyles.snocellView}>
                              <Text style={TableStyles.snocell}>
                                {index + 1}
                              </Text>
                            </View>

                            <View style={TableStyles.cellView}>
                              <Text style={[TableStyles.cell]}>
                                {item?.percentage}
                              </Text>
                            </View>
                            <View style={TableStyles.cellView}>
                              <Text style={TableStyles.cell}>
                                {item?.date != null
                                  ? item?.date
                                  : "Not Mentioned"}
                              </Text>
                            </View>

                            <View style={TableStyles.cellView}>
                              <View
                                style={TableStyles.buttinView}
                                onTouchEnd={() =>
                                  navigation.navigate("PhotoGalleryScreen", {
                                    mppr_id: item?.id,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    fontFamily: "Jost-Medium",
                                    color: "#fff",
                                    fontSize: 12,
                                  }}
                                >
                                  Add Image
                                </Text>
                              </View>
                              <View
                                style={[
                                  TableStyles.buttinView,
                                  {
                                    backgroundColor: "#68f168",
                                    marginVertical: "4%",
                                  },
                                ]}
                                onTouchEnd={() =>
                                  navigation.navigate("PhotoGalleryScreen", {
                                    mppr_id: item?.id,
                                  })
                                }
                              >
                                <Text
                                  style={{
                                    fontFamily: "Jost-Medium",
                                    fontSize: 12,
                                  }}
                                >
                                  View Image
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      }}
                      ListEmptyComponent={
                        milestonesData?.milestone?.records?.length == 0 ||
                        (milestonesData.length == 0 && (
                          <View
                            style={{
                              alignSelf: "center",
                              margin: "5%",
                            }}
                          >
                            <Text
                              style={{
                                fontFamily: "Jost-Medium",
                                fontSize: 15,
                              }}
                            >
                              No Milestone Available Now!!
                            </Text>
                          </View>
                        ))
                      }
                      ListFooterComponent={
                        <View style={{ marginBottom: "50%" }} />
                      }
                    />
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        alignSelf: "center",
                        margin: "5%",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Jost-Medium",
                          fontSize: 15,
                        }}
                      >
                        No Milestone Available Now!!
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        )}
      </View>

      {!load && (
        <BottomButton
          active={totalPer > 100 || totalPer == 100 ? false : true}
          Title={
            totalPer > 100 || totalPer > 100 || totalPer == 100
              ? "Completed Milestone Progress"
              : "Update Progress"
          }
          onPress={totalPer < 100 && handleNext}
        />
      )}
    </View>
  );
};

const TableStyles = StyleSheet.create({
  table: {
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "#000",
    marginHorizontal: "0.5%",
    borderRadius: 2,
  },
  row: {
    flexDirection: "row",
  },
  headerSnoCell: {
    width: width * 0.15,
    // flex: 1,
    paddingHorizontal: "1%",
    paddingVertical: "3%",
    fontFamily: "Jost-SemiBold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
  },
  headerCell: {
    // width: width * 0.26,
    flex: 1,
    paddingHorizontal: "1%",
    paddingVertical: "3%",
    fontFamily: "Jost-SemiBold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
    fontSize: 13,
  },
  snocellView: {
    width: width * 0.15,
    paddingHorizontal: "1%",
    paddingVertical: "3%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
  },
  snocell: {
    textAlign: "center",
    fontFamily: "Jost-Medium",
  },
  cellView: {
    width: width * 0.28,
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: "1%",
    paddingVertical: "2%",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    // backgroundColor: "green",
  },
  cell: {
    textAlign: "center",
    fontFamily: "Jost-Regular",
    fontSize: 13,
  },
  buttinView: {
    width: width * 0.2,
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: "5%",
    borderRadius: 4,
  },
});

export default PhysicalProgressMilestone;
