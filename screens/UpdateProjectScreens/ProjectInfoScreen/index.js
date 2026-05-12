import {
  View,
  Text,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import styles from "./styles";
import {
  fetchProjectsDetailsByPId,
} from "../../../services/api/fetch";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NetConnected } from "../../../services/helper";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import BottomButton from "@/components/Button/BottomButton";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import {
  fetchProjectDetailsData,
  saveSqlProjectDetails,
} from "@/services/database/database";
import { UPDATE_REFRESH_KEYS, useUpdateFlow } from "@/navigation/UpdateFlowContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { getFromSS } from "../../../services/storage/SecureStore";

const ProjectInfoScreen = (props) => {
  const { data } = props?.route?.params;

  const [projectDetails, setProjectDetails] = React.useState([]);
  const [load, setLoad] = React.useState(false);

  const navigation = useNavigation();
  const isInternet = NetConnected();
  const { user } = useAuth();
  const { refreshMap } = useUpdateFlow();
  const refreshVersion = refreshMap[UPDATE_REFRESH_KEYS.projectInfo] || 0;

  useEffect(() => {
    fetchDataBasedOnConnectivity(data?.project_id);
  }, [data, isInternet, refreshVersion]);

  const fetchDataBasedOnConnectivity = async (PID) => {
    setLoad(true);
    try {
      if (isInternet) {
        await getProjectsDataByPID(PID);
      } else {
        await getProjectDetailsSql(PID);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoad(false);
    }
  };

  const getProjectDetailsSql = async (PID) => {
    try {
      await fetchProjectDetailsData(PID).then((res) => {
        setProjectDetails(res);
      });
    } catch (error) {
      console.log("Project details local fetch error ::", error);
    }
  };

  const getProjectsDataByPID = async (PID) => {
    setLoad(true);
    const authToken = await getFromSS("authToken");

    var formData = {
      project_id: PID,
    };
    try {
      const res = await fetchProjectsDetailsByPId(formData, authToken);
      if (res?.data) {
        setProjectDetails(res?.data?.project);
        const storeSql = {
          project_id: data?.project_id,
          data: res?.data?.project,
        };
        await saveSqlProjectDetails(storeSql);
      }
    } catch (error) {
      console.log("Project details remote fetch error ::", error);
    }
  };

  const handleNext = () => {
    navigation.navigate("ProjectMilestones", {
      data: data,
    });
  };

  const details = isInternet ? projectDetails : projectDetails?.[0] || {};

  return (
    <SafeAreaView style={styles.mainContainer} edges={["bottom"]}>
      <CustomHeader Title={"Project Information"} GoBack={true} />
      {load ? (
        <View style={styles.loaderWrap}>
          <ActivityIndicator size="small" color="#000" />
        </View>
      ) : (
        projectDetails != 0 && (
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.contentCard}>
                <Text style={styles.labelText}>Project Name</Text>
                <View style={styles.subTextview}>
                  <Text style={styles.subText}>
                    {details?.name || "Not Mentioned"}
                  </Text>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Project Type :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>
                        {details?.project_type || "Not Mentioned"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Department :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.department || "Not Mentioned"}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Category :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.category || "Not Mentioned"}</Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Sub-Category :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.subcategory || "Not Mentioned"}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>DEC Approval Date :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.dec_approval_date || "Not Mentioned"}</Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>HPC Approval Date :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.hpc_approval_date || "Not Mentioned"}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Vidhan Sabha :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.assembly || "Not Mentioned"}</Text>
                    </View>
                  </View>

                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Lok Sabha :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.constituency || "Not Mentioned"}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.subContainer}>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>District :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.district || "Not Mentioned"}</Text>
                    </View>
                  </View>
                  <View style={styles.subView}>
                    <Text style={styles.sublabelText}>Block :</Text>
                    <View style={styles.subTextview}>
                      <Text style={styles.subText}>{details?.block || "Not Mentioned"}</Text>
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
        )
      )}
    </SafeAreaView>
  );
};

export default ProjectInfoScreen;
