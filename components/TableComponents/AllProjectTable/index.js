import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
  StyleSheet,
} from "react-native";
import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import styles from "./styles";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import {
  Feather,
  Ionicons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import SkeletonLoader from "@/components/SkeletonDesign/PackageTableRow";
import { convertToCr, height, width } from "@/services/helper";
import {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import ButtonGrid from "@/components/TableComponents/ActionButtons/ActionButtons";

const { width: screenWidth } = Dimensions.get("window");

const ShimmerBar = ({ progress, color }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        })
      ).start();
    }, [])
  );

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-screenWidth, screenWidth],
  });

  return (
    <View style={{ overflow: "hidden", borderRadius: 10 }}>
      {/* Base progress bar */}
      <Progress.Bar
        progress={progress}
        width={null}
        height={10}
        borderRadius={8}
        color={color}
        unfilledColor="#E6E6E6"
        borderWidth={0}
        animated={true}
      />

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.6)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 10 }}
        />
      </Animated.View>
    </View>
  );
};

const ProgressWithLabel = ({ label, progress, color }) => {
  return (
    <View style={{ marginBottom: 10 }}>
      <View style={styles.row}>
        <Text style={[styles.label, { fontFamily: "Jost-SemiBold" }]}>
          {label}
        </Text>
        <Text style={styles.value}>{Math.round(progress * 100)}%</Text>
      </View>
      <ShimmerBar progress={progress} color={color} />
    </View>
  );
};

const ActionButton = ({ label, color, icon, onPress, disabled }) => (
  <TouchableOpacity
    style={[
      styles.button,
      { backgroundColor: color },
      disabled && { opacity: 0.5 },
    ]}
    onPress={disabled ? null : onPress}
    activeOpacity={0.6}
    disabled={disabled}
  >
    <FontAwesome5
      name={icon}
      size={14}
      color="#fff"
      style={{ marginRight: 6 }}
    />
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const AllprojectTable = ({ refresh, handleRefresh, projectData, loading }) => {
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
    return projectData?.filter((item) =>
      item?.name?.toLowerCase().includes(lower)
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
            {/* Package details skeleton */}

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
          marginVertical: 5,
          marginHorizontal: 5,
          height: 50,
          borderColor: "#E0E0E0",
          borderWidth: 1,
        }}
      >
        <Ionicons name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search Sub-Project..."
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
              {/* <Text style={[styles.headerSnoCell, { color: "#000" }]}>
                S.No.
              </Text> */}
              <Text style={[styles.headerCell, { color: "#000" }]}>
                Sub-Project Details
              </Text>
              <Text style={[styles.headerCell, { color: "#000" }]}>
                {user?.role?.department == "FIELD-PWD-ENVIRONMENT" ||
                  user?.role?.department == "FIELD-PWD-SOCIAL" ||
                  user?.role_department == "FIELD-PWD-ENVIRONMENT" ||
                  user?.role_department == "FIELD-PWD-SOCIAL"
                  ? "Action"
                  : "Action"}
                {/* : "Update Milestone"} */}
              </Text>
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
                {/* Project details */}
                <View style={[styles.cellNameView, { flex: 2 }]}>
                  <View style={{ flexDirection: "row", gap: 5 }}>
                    <FontAwesome
                      name="folder-open"
                      size={12}
                      color="#007BFF"
                      style={{ marginTop: 2.5 }}
                    />
                    <Text
                      style={{ fontFamily: "Jost-Regular", fontSize: 13 }}
                      numberOfLines={expanded ? undefined : 2}
                    >
                      {item?.name}
                    </Text>
                  </View>
                  {item?.name?.length > 60 && (
                    <TouchableOpacity
                      style={{ alignSelf: "flex-end" }}
                      onPress={() => toggleExpand(item?.id)}
                    >
                      <Text
                        style={{
                          fontFamily: "Jost-Regular",
                          fontSize: 12,
                          color: "#3488FD",
                        }}
                      >
                        {expanded ? "Hide full name ▲" : "View full name ▼"}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Other fields */}
                  <Text style={{ fontSize: 12.5, marginVertical: "1%" }}>
                    <Text style={{ fontFamily: "Jost-SemiBold" }}>
                      Contract Value:
                    </Text>{" "}
                    <Text
                      style={{ fontFamily: "Jost-SemiBold", color: "green" }}
                    >
                      {convertToCr(item?.contract_value)}
                    </Text>{" "}
                  </Text>
                  {/* Progress Bars */}
                  <ProgressWithLabel
                    label="Physical Progress"
                    progress={item?.physical_progress / 100}
                    color="#28a745"
                  />
                  <ProgressWithLabel
                    label="Financial Progress"
                    progress={item?.financial_progress / 100}
                    color="#007BFF"
                  />
                </View>

                {/* Action / Update button */}
                <View style={[styles.cellView, { alignItems: "cente" }]}>

                  <ActionButton
                    label="Financial"
                    color="#28a745"
                    icon="money-bill-wave"
                    // disabled={true}
                    onPress={() =>
                      navigation.navigate("FinancialScreen", { data: item })
                    }
                  />
                  <ActionButton
                    label="Safeguard"
                    color="#ffc107"
                    icon="vial"
                    // onPress={() => console.log("Safeguard pressed")}
                    onPress={() =>
                      navigation.navigate("SafeguardScreen", { data: item })
                    }
                  />
                  {item?.type_of_procurement === "EPC" ? (
                    <ActionButton
                      label="EPC"
                      color="#007BFF"
                      icon="building"
                      onPress={() =>
                        navigation.navigate("ECPScreen", { data: item })
                      }
                    />
                  ) : (
                    <ActionButton
                      label="BOQ"
                      color="#17A2B8"
                      icon="list-alt"
                      onPress={() =>
                        navigation.navigate("BOQScreen", { data: item })
                      }
                    />
                  )}
                </View>
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
        />
      )}
    </View>
  );
};

export default AllprojectTable;
