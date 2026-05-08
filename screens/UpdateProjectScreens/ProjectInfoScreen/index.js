import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import styles from "./styles";
import { getFromSS } from "../../../services/storage/SecureStore";
import {
  fetchProjects,
  fetchProjectsDetailsByPId,
} from "../../../services/api/fetch";
import { ActivityIndicator } from "react-native";
import Button from "../../../components/Button/Button";
import DropDown from "../../../components/DropDown";
import { useNavigation } from "@react-navigation/native";
import { NetConnected, width } from "../../../services/helper";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import BottomButton from "@/components/Button/BottomButton";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import {
  fetchProjectDetailsData,
  saveSqlProjectDetails,
} from "@/services/database/database";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";

const ProjectInfoScreen = (props) => {
  const { data } = props?.route?.params;
  console.log("DATATAT ::", data?.project_id);

  const [projectDetails, setProjectDetails] = React.useState([]);
  // const [projectId, setProjectID] = React.useState("");
  const [load, setLoad] = React.useState(false);

  const navigation = useNavigation();
  const isInternet = NetConnected();
  const { user } = useAuth();
  const { refreshMap } = useUpdateFlow();
  const refreshVersion = refreshMap[UPDATE_REFRESH_KEYS.projectInfo] || 0;

  useEffect(() => {
    // getProjectsDataByPID(data?.project_id);
    fetchDataBasedOnConnectivity(data?.project_id);
  }, [data, isInternet, refreshVersion]);

  const fetchDataBasedOnConnectivity = async (PID) => {
    setLoad(true);
    try {
      if (isInternet) {
        console.log("Fetching data from the server...");
        await getProjectsDataByPID(PID);
      } else {
        console.log("Fetching data from local storage...");
        await getProjectDetailsSql(PID);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoad(false);
      }, 3000);
    }
  };

  const getProjectDetailsSql = async (PID) => {
    setLoad(true);
    try {
      await fetchProjectDetailsData(PID).then((res) => {
        console.log("RESS PROJECTT Deatils SQL ::", res);
        setProjectDetails(res);
      });
    } catch (error) {
      console.log("Eroro ::", error);
    }
  };

  const getProjectsDataByPID = async (PID) => {
    // setProjectID(PID);
    setLoad(true);
    const authToken = await getFromSS("authToken");

    var formData = {
      project_id: PID,
    };
    try {
      const res = await fetchProjectsDetailsByPId(formData, authToken);
      console.log("RESS ::", res?.data);
      if (res?.data) {
        setProjectDetails(res?.data?.project);
        const storeSql = {
          project_id: data?.project_id,
          data: res?.data?.project,
        };
        await saveSqlProjectDetails(storeSql);
      }
    } catch (error) {
      console.log("error ::", error);
    }
    // finally {
    //   setLoad(false);
    // }
  };

  const handleNext = () => {
    navigation.navigate("ProjectMilestones", {
      data: data,
    });
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Project Information"} GoBack={true} />
      {load ? (
        <>
          <ActivityIndicator size="small" color="#000" />
        </>
      ) : (
        projectDetails != 0 && (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                justifyContent: "space-between",
                flex: 1,
              }}
            >
              <View style={{ marginHorizontal: "3%", marginVertical: "2%" }}>
                <Text style={styles.labelText}>Project Name</Text>
                <View style={styles.subTextview}>
                  <Text style={styles.subText}>
                    {isInternet
                      ? projectDetails?.name
                      : projectDetails[0]?.name}
                  </Text>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Project Type :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.project_type
                          : projectDetails?.project_type == null
                          ? "Not Mentioned"
                          : projectDetails[0]?.project_type}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Department :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.department
                          : projectDetails[0]?.department}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Category :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.category
                          : projectDetails[0]?.category}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Sub-Category :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.subcategory
                          : projectDetails[0]?.subcategory}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>DEC Approval Date :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.dec_approval_date
                          : projectDetails[0]?.dec_approval_date}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>HPC Approval Date :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.hpc_approval_date
                          : projectDetails[0]?.hpc_approval_date}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Vidhan Sabha :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.assembly
                          : projectDetails[0]?.assembly}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Lok Sabha :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.constituency
                          : projectDetails[0]?.constituency}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>District :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.district
                          : projectDetails[0]?.district}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Block :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {isInternet
                          ? projectDetails?.block
                          : projectDetails[0]?.block}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <BottomButton
                Title={
                  user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
                  user?.role?.department == "FIELD-PWD-SOCIAL" ||
                  user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
                  user?.role_department == "FIELD-PWD-SOCIAL"
                    ? "Project Activities ->"
                    : "Project Milestones ->"
                }
                onPress={handleNext}
                active={true}
              />
            </ScrollView>
          </>
        )
      )}
    </View>
  );
};

export default ProjectInfoScreen;
