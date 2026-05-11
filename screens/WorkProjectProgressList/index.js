import CustomHeader from "@/components/AppHeader/CustomHeader";
import {
  deleteWorkProgressById,
  fetchWorkProgressById,
} from "@/services/api/fetch";
import { width } from "@/services/helper";
import { getFromSS } from "@/services/storage/SecureStore";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import SubProgressCardSkeleton from "@/components/SkeletonDesign/SubProgressCardSkeleton";

// Convert date to readable format (e.g., 30 Oct 2025)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const WorkProjectProgressList = (props) => {
  console.log("Poropsps ;;", props?.route?.params);
  const { workData } = props?.route?.params;
  // const workProgressData = workData?.work_progress_data;
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [workProgressData, setWorkProgressData] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    getWorkProgress();
  }, []);

  const getWorkProgress = async () => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    setWorkProgressData([]);
    try {
      const res = await fetchWorkProgressById(authToken, workData?.id);
      console.log("RESSSS SUb Packagess::", res);
      if (res?.success) {
        setWorkProgressData(res?.project?.work_progress_data);
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

  useEffect(() => {
    if (!search.trim()) {
      setFilteredData(workProgressData);
      return;
    }

    const lower = search?.toLowerCase();
    const filtered = workProgressData?.filter((item) => {
      const comp = item?.work_component?.work_component?.toLowerCase() || "";
      const stage = item?.current_stage?.toLowerCase() || "";
      const remark = item?.remarks?.toLowerCase() || "";
      return (
        comp.includes(lower) || stage.includes(lower) || remark.includes(lower)
      );
    });

    setFilteredData(filtered);
  }, [search, workProgressData]);

  const handleDeleteProgress = async (ID) => {
    // Step 1: Ask for confirmation
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this progress?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => confirmDelete(ID),
        },
      ]
    );
  };

  const confirmDelete = async (ID) => {
    const authToken = await getFromSS("authToken");
    console.log("Delete ID:", ID);

    try {
      const resp = await deleteWorkProgressById(authToken, ID);

      if (resp?.success) {
        Alert.alert(
          "Success",
          resp?.message || "Progress Deleted Successfully!"
        );
        getWorkProgress();
      } else {
        Alert.alert("Failed to Delete!", resp?.message || "Please try again");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Something went wrong while deleting");
    }
  };

  const renderCard = ({ item }) => {
    const wc = item?.work_component;

    return (
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>
            <Text style={{ color: "#777" }}>ID: {item?.id}</Text> -{" "}
            {wc?.work_component ? wc?.work_component : "--"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={{ backgroundColor: "", padding: 5 }}
            // onPress={() => Alert.alert("Delete")}
            onPress={() => handleDeleteProgress(item?.id)}
          >
            <MaterialIcons name="delete-forever" size={24} color="red" />
          </TouchableOpacity>
        </View>

        <Text style={styles.row}>
          <Text style={styles.label}>Stage: </Text>
          {item?.current_stage ? item?.current_stage : "--"}
        </Text>

        <Text style={styles.row}>
          <Text style={styles.label}>Progress: </Text>
          {item?.progress_percentage ? `${item?.progress_percentage}%` : "--"}
        </Text>

        {item?.qty_length && (
          <Text style={styles.row}>
            <Text style={styles.label}>Length: </Text>
            {item?.qty_length ? item?.qty_length : "--"}
          </Text>
        )}

        {item?.remarks && (
          <Text style={styles.row}>
            <Text style={styles.label}>Remarks: </Text>
            {item?.remarks ? item?.remarks : "--"}
          </Text>
        )}

        <Text style={styles.row}>
          <Text style={styles.label}>Date: </Text>
          {item?.date_of_entry ? formatDate(item?.date_of_entry) : "--"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Addes By: </Text>
          {item?.user?.name ? item?.user?.name : "--"}
        </Text>

        <View style={styles.separator} />

        <Text style={styles.row}>
          <Text style={styles.label}>Type: </Text>
          {wc?.type_details ? wc?.type_details : "--"}
        </Text>
        <Text style={styles.row}>
          <Text style={styles.label}>Side: </Text>
          {wc?.side_location ? wc?.side_location : "--"}
        </Text>
      </View>
    );
  };

  return (
    <View style={{}}>
      <CustomHeader GoBack={true} Title={"Project Progress Details"} />

      <View style={{ backgroundColor: "#fff" }}>
        <View style={[styles.projectCard]}>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              width: width * 0.85,
            }}
          >
            <FontAwesome
              name="folder-open"
              size={12}
              color="#007BFF"
              style={{ marginTop: 2.5 }}
            />
            <Text
              style={styles.projectTitle}
              numberOfLines={expandedTitle ? undefined : 2}
            >
              {workData?.name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              activeOpacity={0.5}
              style={{
                alignSelf: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#007BFF",
                borderRadius: 10,
                paddingVertical: "1.5%",
                paddingHorizontal: "2.5%",
                gap: 5,
              }}
              onPress={() =>
                props?.navigation.navigate("UpdateWorkProgress", {
                  project: workData,
                })
              }
              // onPress={() => Alert.alert("Add Work Progress")}
            >
              <FontAwesome5 name="plus-circle" size={16} color="#fff" />
              <Text
                style={{
                  fontFamily: "Jost-SemiBold",
                  fontSize: 12,
                  color: "#ffff",
                }}
              >
                Add Progress
              </Text>
            </TouchableOpacity>

            {workData?.name?.length > 60 && (
              <TouchableOpacity
                style={{ position: "absolute", right: 0, top: 1 }}
                onPress={() => setExpandedTitle(!expandedTitle)}
              >
                <Text
                  style={{
                    fontFamily: "Jost-Regular",
                    fontSize: 12,
                    color: "#3488FD",
                  }}
                >
                  {expandedTitle ? "Hide ▲" : "View ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={{ margin: 5 }}>
        {/* Data List */}
        {load ? (
          Array.from({ length: 5 }).map((_, index) => (
            <SubProgressCardSkeleton key={index} />
          ))
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.id.toString()}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <TextInput
                placeholder="Search by Component / Stage / Remark"
                placeholderTextColor="#666"
                style={styles.search}
                value={search}
                onChangeText={setSearch}
              />
            }
            renderItem={renderCard}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text
                style={{ textAlign: "center", marginTop: 30, color: "#555" }}
              >
                No matching records found.
              </Text>
            }
            contentContainerStyle={{ paddingBottom: "80%" }}
          />
        )}
      </View>
    </View>
  );
};

export default WorkProjectProgressList;

// -----------------------------
const styles = StyleSheet.create({
  projectCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    // marginBottom: 12,
    shadowColor: "#00000011",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 1,
    // paddingBottom: 30,
  },
  projectTitle: {
    fontSize: 13,
    fontFamily: "Jost-Medium",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f3f4f6",
  },
  search: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 12,
    color: "#000",
  },
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: "Jost-Bold",
    color: "#111",
    marginBottom: 3,
  },
  row: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
    fontFamily: "Jost-Medium",
  },
  label: {
    fontFamily: "Jost-SemiBold",
    color: "#000",
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
});
