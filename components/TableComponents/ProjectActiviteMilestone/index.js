import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import React from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import { Feather } from "@expo/vector-icons";

const ProjectActivitesMilestone = ({ project, data, refreshing, onRefresh }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const RenderItem = ({ item, index }) => {
    var progress = item?.progress / 100;
    // console.log("PROGRESS ::", progress.toFixed(1));

    return (
      <>
        {user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
        user?.role?.department == "FIELD-PWD-SOCIAL" ||
        user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
        user?.role_department == "FIELD-PWD-SOCIAL" ? (
          <>
            <View style={styles.row}>
              <View style={styles.cellNameView}>
                <Text style={[styles.cell, { fontFamily: "Jost-Medium" }]}>
                  {item?.name}
                </Text>
              </View>
              <View style={styles.cellView}>
                <Text style={[styles.cell]}>{item?.total_activities}</Text>
              </View>
              <View style={styles.cellView}>
                <Text style={styles.cell}>{item?.total_completed}%</Text>
              </View>

              <View style={styles.cellView}>
                <Text
                  style={[
                    styles.cell,
                    // { fontFamily: "Jost-Medium", margin: "1%" },
                  ]}
                >
                  {item?.start_date}
                </Text>
                <Text
                  style={[
                    styles.cell,
                    // { fontFamily: "Jost-Medium", margin: "1%" },
                  ]}
                >
                  {item?.end_date}
                </Text>
              </View>

              <View style={[styles.cellView, { alignItems: "center" }]}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.buttinView}
                  onPress={() =>
                    navigation.navigate("ProjectActivitiesScreen", {
                      data: item,
                    })
                  }
                >
                  <Feather name="edit" size={13} color="#fff" />
                  <Text
                    style={{
                      fontFamily: "Jost-Medium",
                      color: "#fff",
                      fontSize: 13,
                      textAlign: "center",
                      marginLeft: "3%",
                      //   marginHorizontal: "3%",
                    }}
                  >
                    Update{" "}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={styles.row}>
              <View style={styles.snocellView}>
                <Text style={styles.snocell}>{index + 1}</Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate("PhysicalProgressMilestone", {
                    milestone_id: item?.id,
                    milestone: item,
                    project,
                  })
                }
                style={styles.cellView}
              >
                <Text style={[styles.cell, { color: "blue" }]}>
                  {item?.name}
                </Text>
              </TouchableOpacity>
              <View style={styles.cellView}>
                <Text style={styles.cell}>{item?.weightage}%</Text>
              </View>

              <View style={styles.cellView}>
                {/* <Progress.Bar progress={progress} width={50} /> */}
                <Progress.Pie progress={progress} size={25} />
                <Text
                  style={[
                    styles.cell,
                    { fontFamily: "Jost-Medium", margin: "1%" },
                  ]}
                >
                  {item?.progress}%
                </Text>
              </View>
            </View>
          </>
        )}
      </>
    );
  };

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <View style={styles.table}>
      {/* Data rows */}
      <FlatList
        data={data || []}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          // {/* Header row */}
          <>
            {user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
            user?.role?.department == "FIELD-PWD-SOCIAL" ||
            user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
            user?.role_department == "FIELD-PWD-SOCIAL" ? (
              <>
                <View style={styles.row}>
                  <Text style={styles.headerSnoCell}>Phase</Text>
                  <Text style={styles.headerCell}>No. of Activites</Text>
                  <Text style={styles.headerCell}>Activites Completed</Text>
                  <Text style={styles.headerCell}>Start / End Date</Text>
                  <Text style={styles.headerCell}>Action</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.row}>
                  <Text style={styles.headerSnoCell}>S.No.</Text>
                  <Text style={styles.headerCell}>Milestones</Text>
                  <Text style={styles.headerCell}>Weightage</Text>
                  <Text style={styles.headerCell}>Progress</Text>
                </View>
              </>
            )}
          </>
        }
        renderItem={({ item, index }) => (
          <RenderItem item={item} index={index} />
        )}
        ListEmptyComponent={
          data?.length == 0 && (
            <View
              style={{
                alignSelf: "center",
                margin: "5%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  fontSize: 18,
                }}
              >
                No Milestone Available Now!!
              </Text>
            </View>
          )
        }
        ListFooterComponent={<View style={{ marginBottom: "50%" }} />}
      />
    </View>
  );
};

export default ProjectActivitesMilestone;
