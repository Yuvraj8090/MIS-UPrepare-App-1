import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useMemo } from "react";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import { Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import { convertToCr, height, width } from "@/services/helper";

const AllPackageTable = ({ refresh, handleRefresh, projectData, loading }) => {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [expandedRows, setExpandedRows] = useState({});
  const [searchText, setSearchText] = useState("");

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filtered data
  const filteredData = useMemo(() => {
    if (!searchText.trim()) return projectData;
    const lower = searchText.toLowerCase();
    return projectData.filter(
      (item) =>
        item?.id?.toString().toLowerCase().includes(lower) ||
        item?.package_name?.toLowerCase().includes(lower) ||
        item?.department?.toLowerCase().includes(lower) ||
        item?.category?.toLowerCase().includes(lower) ||
        item?.sub_category?.toLowerCase().includes(lower)
    );
  }, [projectData, searchText]);

  // Skeleton Loader UI
  const renderSkeleton = () => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginVertical: 10,
              paddingHorizontal: 10,
            }}
          >
            <SkeletonLoader width={30} height={20} />

            <View style={{ marginLeft: 10, flex: 1 }}>
              <SkeletonLoader
                width={width * 0.5}
                height={15}
                style={{ marginBottom: 6 }}
              />
              <SkeletonLoader
                width={width * 0.4}
                height={15}
                style={{ marginBottom: 6 }}
              />
              <SkeletonLoader width={50} height={15} />
            </View>

            {/* Button skeleton */}
            <SkeletonLoader width={100} height={30} />
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={styles.table}>
      {/* 🔍 Search Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F1F3F6",
          borderRadius: 8,
          paddingHorizontal: 10,
          //   marginVertical: 5,
          //   marginHorizontal: 5,
          height: height * 0.04,
        }}
      >
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search package, department, category..."
          value={searchText}
          onChangeText={setSearchText}
          style={{
            flex: 1,
            marginLeft: 8,
            fontFamily: "Jost-Regular",
            fontSize: 14,
          }}
          placeholderTextColor="#888"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Show Skeleton if loading */}
      {loading ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filteredData}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
          }
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={[styles.row, { backgroundColor: "#E6EFFC" }]}>
              <Text style={[styles.headerSnoCell, { color: "#000" }]}>
                S.No.
              </Text>
              <Text style={[styles.headerCell, { color: "#000" }]}>
                Package Details
              </Text>
              {/* <Text style={[styles.headerCell, { color: "#000" }]}>
                {user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
                user?.role?.department == "FIELD-PWD-SOCIAL" ||
                user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
                user?.role_department == "FIELD-PWD-SOCIAL"
                  ? "Action"
                  : "Action"}
                : "Update Milestone"}
              </Text> */}
            </View>
          }
          renderItem={({ item, index }) => {
            const expanded = expandedRows[item?.id] || false;

            return (
              <View
                style={[
                  styles.row,
                  { backgroundColor: index % 2 === 0 ? "#F9FAFB" : "#FFFFFF" },
                ]}
              >
                {/* Serial no */}
                <View style={styles.snocellView}>
                  <Text style={styles.snocell}>{index + 1}</Text>
                </View>

                {/* Project details */}
                <View style={[styles.cellNameView, { flex: 2 }]}>
                  <Text
                    style={{
                      color: "green",
                      fontFamily: "Jost-SemiBold",
                      fontSize: 12.5,
                    }}
                  >
                    Package ID : {item?.id}
                  </Text>

                  <Text
                    style={{ fontFamily: "Jost-Regular", fontSize: 13 }}
                    numberOfLines={expanded ? undefined : 3}
                  >
                    {item?.package_name}
                  </Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginVertical: "1%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12.5,
                        marginTop: 4,
                      }}
                    >
                      {/* <FontAwesome name="building" size={14} color="#ccc" /> */}
                      <Text
                        style={{
                          fontFamily: "Jost-SemiBold",
                          marginLeft: "3%",
                        }}
                      >
                        Department:
                      </Text>{" "}
                      <Text
                        style={{
                          color: "green",
                          fontFamily: "Jost-SemiBold",
                        }}
                      >
                        {item?.department}
                      </Text>
                    </Text>
                    <Text style={{ fontSize: 12.5 }}>
                      <Text style={{ fontFamily: "Jost-SemiBold" }}>
                        Category:
                      </Text>{" "}
                      {item?.category}{" "}
                      {item?.sub_category && <>({item?.sub_category})</>}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Jost-SemiBold",
                        fontSize: 12.5,
                        color: "#000",
                      }}
                    >
                      Sanction Budget:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Jost-SemiBold",
                        fontSize: 12.5,
                        color: "green",
                      }}
                    >
                      {convertToCr(item?.estimated_budget_incl_gst)}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginTop: "1%",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Jost-SemiBold",
                        fontSize: 12.5,
                        color: "#000",
                      }}
                    >
                      Contracts:
                    </Text>
                    <Text
                      style={{
                        fontFamily: "Jost-SemiBold",
                        fontSize: 11,
                        color: item?.contracts?.length > 0 ? "#17A2B8" : "#777",
                        borderColor:
                          item?.contracts?.length > 0 ? "#17A2B8" : "#777",
                        borderWidth: 1,
                        paddingHorizontal: "1%",
                        borderRadius: 2,
                      }}
                    >
                      {item?.contracts?.length > 0 ? (
                        <Text>{item?.contracts?.length}</Text>
                      ) : (
                        <Text>No</Text>
                      )}{" "}
                      Contracts
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: "#0C7DFE",
                      alignSelf: "flex-end",
                      marginVertical: "1%",
                      gap: 5,
                      borderRadius: 6,
                      paddingHorizontal: "2.5%",
                      paddingVertical: "1.5%",
                    }}
                    onPress={() =>
                      navigation.navigate("PackageInfoScreen", { data: item })
                    }
                  >
                    <Text
                      style={{
                        fontFamily: "Jost-Regular",
                        fontSize: 12,
                        color: "#fff",
                      }}
                    >
                      View Details
                      {/* {expanded ? "Hide full name ▲" : "View full name ▼"} */}
                    </Text>
                    <Feather name="arrow-right-circle" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>

                {/* Action / Update button */}
                {/* <View style={[styles.cellView, { alignItems: "center" }]}>
                  <TouchableOpacity
                    style={styles.buttonView}
                    onPress={() =>
                      navigation.navigate("ProjectInfoScreen", { data: item })
                    }
                  >
                    <Feather name="edit" size={15} color="#fff" />
                    <Text
                      style={{
                        fontFamily: "Jost-Medium",
                        color: "#fff",
                        fontSize: 12,
                        textAlign: "center",
                        marginLeft: 6,
                      }}
                    >
                      {user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
                      user?.role?.department == "FIELD-PWD-SOCIAL" ||
                      user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
                      user?.role_department == "FIELD-PWD-SOCIAL"
                        ? "Update Activities"
                        : "Update Milestone"}
                    </Text>
                  </TouchableOpacity>
                </View> */}
              </View>
            );
          }}
          ListEmptyComponent={
            !loading && (
              <View style={{ alignSelf: "center", margin: "5%" }}>
                <Text style={{ fontFamily: "Jost-Medium", fontSize: 16 }}>
                  {searchText
                    ? "No matching package found 🔍"
                    : "No Package Available Now!!"}
                </Text>
              </View>
            )
          }
          ListFooterComponent={<View style={{ marginVertical: "18%" }} />}
          initialNumToRender={20}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

export default AllPackageTable;
