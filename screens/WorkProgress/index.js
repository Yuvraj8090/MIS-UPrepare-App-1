import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { use, useEffect, useState } from "react";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchWorkProgress } from "@/services/api/fetch";
import WorkProgressSkeletonCard from "@/components/SkeletonDesign/WorkProgressCard";
import { useNavigation } from "@react-navigation/native";

const dummyData = [
  {
    id: 1,
    project_id: 101,
    name: "River Bridge Construction - Phase 1",
    contract_value: "45000000.00",
    work_progress_data: [
      {
        id: 1,
        current_stage: "Borehole completed",
        progress_percentage: "100",
        work_component: { work_component: "Preliminary Works" },
      },
      {
        id: 2,
        current_stage: "A1/A2 side complete",
        progress_percentage: "80",
        work_component: { work_component: "Foundation" },
      },
    ],
  },
  {
    id: 2,
    project_id: 102,
    name: "Hill Road Development Project",
    contract_value: "22000000.00",
    work_progress_data: [
      {
        id: 1,
        current_stage: "Cutting work started",
        progress_percentage: "40",
        work_component: { work_component: "Approach Road" },
      },
    ],
  },
  {
    id: 3,
    project_id: 103,
    name: "City Flyover Expansion",
    contract_value: "82000000.00",
    work_progress_data: [
      {
        id: 1,
        current_stage: "Pillar reinforcement",
        progress_percentage: "55",
        work_component: { work_component: "Substructure" },
      },
      {
        id: 2,
        current_stage: "Deck casting started",
        progress_percentage: "20",
        work_component: { work_component: "Superstructure" },
      },
      {
        id: 3,
        current_stage: "Initial excavation",
        progress_percentage: "10",
        work_component: { work_component: "Approach Road (A1)" },
      },
    ],
  },
];

const WorkProgress = (props) => {
  const [search, setSearch] = useState("");
  const [WorkProgressData, setWorkProgressData] = useState([]);
  const [load, setLoad] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    getWorkProgress();
  }, []);

  const getWorkProgress = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    try {
      const res = await fetchWorkProgress(authToken);
      console.log("RESSSS  Packagess::", res);
      if (res?.success) {
        setWorkProgressData(res?.data);
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

  // const sortedData = WorkProgressData?.slice().sort(
  //   (a, b) => Number(a.project_id) - Number(b.project_id)
  // );

  const filteredData = WorkProgressData?.filter((item) => {
    const totalComponents = item?.work_progress_data?.length?.toString();
    const searchLower = search.toLowerCase();

    return (
      item?.name?.toLowerCase().includes(searchLower) ||
      totalComponents?.includes(search)
    );
  });

  return (
    <View style={{ flex: 11, backgroundColor: "#fff" }}>
      <CustomHeader Title={"Work Progress"} GoBack={true} />

      {/* Search Box */}
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Search by Project Name or Total Components"
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView style={{ paddingHorizontal: 16 }}>
        {load
          ? Array.from({ length: 5 }).map((_, index) => (
              <WorkProgressSkeletonCard key={index} />
            ))
          : filteredData?.map((project) => (
              <View key={project.id} style={styles.card}>
                {/* Project ID */}
                <Text style={styles.projectId}>#ID: {project.project_id}</Text>
                <Text style={styles.title}>{project.name}</Text>

                <Text style={styles.label}>
                  Components:{" "}
                  <Text style={styles.value}>
                    {project.work_progress_data.length}
                  </Text>
                </Text>

                <Text style={styles.label}>
                  Contract Value:{" "}
                  <Text style={styles.value}>₹ {project.contract_value}</Text>
                </Text>

                <View style={styles.btnRow}>
                  <TouchableOpacity
                    style={styles.updateBtn}
                    onPress={() =>
                      props?.navigation.navigate("UpdateWorkProgress", {
                        project: project,
                      })
                    }
                  >
                    <Feather name="edit" size={20} color="#fff" />
                    <Text style={styles.updateText}>Update Progress</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("WorkProgressList", {
                        workData: project,
                      })
                    }
                    style={styles.detailsBtn}
                  >
                    <Entypo name="eye" size={20} color="#fff" />
                    <Text style={styles.detailsText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
      </ScrollView>
    </View>
  );
};

export default WorkProgress;

const styles = StyleSheet.create({
  searchWrapper: {
    padding: 16,
  },
  searchInput: {
    height: 45,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  card: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  title: {
    fontSize: 14,
    // fontWeight: "700",
    fontFamily: "Jost-Medium",
    color: "#000",
    marginVertical: 5,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  value: {
    fontWeight: "600",
    color: "#222",
  },
  projectId: {
    fontSize: 16,
    color: "#888",
    // marginBottom: 8,
    fontFamily: "Jost-SemiBold",
  },
  btnRow: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "space-between",
  },

  updateBtn: {
    flex: 0.48,
    backgroundColor: "#28A745",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  updateText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
  },

  detailsBtn: {
    flex: 0.48,
    backgroundColor: "#17A2B8",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
    justifyContent: "center",
  },
  detailsText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
  },
});
