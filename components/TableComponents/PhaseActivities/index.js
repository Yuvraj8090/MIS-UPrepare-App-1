import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";

const PhaseActivites = ({ data, handleRefresh, Title, refresh, ...props }) => {
  const navigation = useNavigation();
  const PhaseData = props?.route?.params?.data;
  const parentData = props?.route?.params?.data;
  // console.log("PHASEEEE ::", parentData);
  // console.log("PRENENTTT ::", parentData);

  return (
    <View style={styles.table}>
      {/* Data rows */}
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            <View>
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  fontSize: 15,
                  margin: "2%",
                  color: "#777",
                }}
                numberOfLines={1}
              >
                {Title}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.headerSnoCell}>Environment Safeguard</Text>
              <Text style={styles.headerCell}>
                {PhaseData?.sub_activities > 1
                  ? "Complied (Yes/No/Not Applicable)"
                  : "No. of Sub-Activity"}
              </Text>
              <Text style={styles.headerCell}>Planned Date</Text>
              <Text style={styles.headerCell}>Actual Date</Text>
              <Text style={styles.headerCell}>Action</Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <View style={styles.row}>
              {/* <View style={styles.snocellView}>
                        <Text style={styles.snocell}>{index + 1}</Text>
                      </View> */}

              <View
                style={styles.cellView}
                onTouchEnd={() => {
                  item?.sub_activities > 1 &&
                    navigation.navigate("PhaseSubActivitiesScreen", {
                      data: item,
                      parentData: parentData,
                    });
                }}
              >
                <Text
                  style={[
                    styles.cell,
                    {
                      color: item?.sub_activities > 1 ? "blue" : "#000",
                      fontFamily:
                        item?.sub_activities > 1
                          ? "Jost-Medium"
                          : "Jost-Regular",
                    },
                  ]}
                >
                  {item?.name}
                </Text>
              </View>
              <View style={styles.cellView}>
                <Text style={[styles.cell]}>
                  {PhaseData?.sub_activities > 1
                    ? item?.complied
                    : item?.sub_activities}
                </Text>
              </View>
              <View style={styles.cellView}>
                <Text style={styles.cell}>
                  {item?.sub_activities > 1
                    ? "-"
                    : item?.planned_date != null
                    ? item?.planned_date
                    : "Not Mentioned"}
                </Text>
              </View>
              <View style={styles.cellView}>
                <Text style={styles.cell}>
                  {item?.sub_activities > 1
                    ? "-"
                    : item?.actual_date != null
                    ? item?.actual_date
                    : "Not Mentioned"}
                </Text>
              </View>

              <View style={styles.cellView}>
                {item?.sub_activities > 1 ? (
                  <View
                    style={[styles.buttonView]}
                    onTouchEnd={() =>
                      navigation.navigate("PhaseActivitiesPhotoScreen", {
                        data: item,
                        parentData: parentData,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontFamily: "Jost-Medium",
                        color: "#fff",
                        fontSize: 15,
                      }}
                    >
                      -
                    </Text>
                  </View>
                ) : (
                  <View
                    style={styles.buttonView}
                    onTouchEnd={() =>
                      navigation.navigate("PhaseActivitiesPhotoScreen", {
                        data: item,
                        parentData: parentData,
                      })
                    }
                  >
                    <Text
                      style={{
                        fontFamily: "Jost-Medium",
                        color: "#fff",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    >
                      Add Image
                    </Text>
                  </View>
                )}
                {/* <View
                          style={[
                            styles.buttinView,
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
                              fontSize: 13,
                            }}
                          >
                            View Image
                          </Text>
                        </View> */}
              </View>
            </View>
          );
        }}
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
        ListFooterComponent={<View style={{ marginBottom: "20%" }} />}
      />
    </View>
  );
};

export default PhaseActivites;
