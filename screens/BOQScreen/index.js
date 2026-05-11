// screens/BoqListScreen.js
import React, { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { fetchBoqEntriesDetails } from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { width } from "@/services/helper";
import Entypo from "@expo/vector-icons/Entypo";
import { useFocusEffect } from "@react-navigation/native";
import SkeletonLoader from "@/components/SkeletonDesign/BOQPhysicalProgressSkeleton";

const SUB_PACKAGE_PROJECT_ID = 26; // change as needed or pass from previous screen

export default function BoqListScreen({ navigation, route }) {
  const { data } = route?.params;
  // console.log("PPRPPSSS BOQ::", route);
  console.log("PPRPPSSS BOQ::", data);

  // console.log("NAVIGATION ::", navigation);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [expandedTitle, setExpandedTitle] = useState(false);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        load(data?.id);
      }
    }, [data?.id])
  );

  useEffect(() => {}, [data?.id]);

  const load = async (id) => {
    const authToken = await getFromSS("authToken");
    setLoading(true);
    try {
      const resp = await fetchBoqEntriesDetails(authToken, id);
      console.log("RESSS ALL BOQQ :", resp);
      if (resp?.status) {
        const payload = resp.data.data || resp.data;
        const filtered = payload.filter(
          (item) =>
            !(
              item?.qty === null &&
              item?.rate === null &&
              item?.amount === null
            ) &&
            !(
              item?.qty === "0.000" &&
              item?.rate === "0.00" &&
              item?.amount === "0.00"
            )
        );
        setItems(filtered);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load BOQ entries");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    // Skip items with zero qty, rate, and amount
    if (
      (item.qty === "0.000" &&
        item.rate === "0.00" &&
        item.amount === "0.00") ||
      (item?.qty === null && item?.rate === null && item?.amount === null)
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate("BOQDetailsScreen", { data: item })}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: width * 0.8 }}>
            <Text style={styles.title} numberOfLines={2}>
              {item.sl_no} - {item.item_description?.split("\n")[0]}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                marginBottom: "1%",
              }}
            >
              {data?.item_description?.length > 60 && (
                <TouchableOpacity
                  style={{ position: "relative" }}
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
            {/* {item?.name?.length > 60 && (
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
            )} */}
          </View>
          <View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#FF5722" />
          </View>
        </View>

        {/* Two-column info layout */}
        <View style={styles.row}>
          <View style={styles.col}>
            <View style={styles.iconRow}>
              <Entypo name="ruler" size={15} color="#4CAF50" />
              <Text style={styles.label}>Unit:</Text>
              <Text style={styles.value}>{item?.unit || "N/A"}</Text>
            </View>
            <View style={styles.iconRow}>
              <Feather name="package" size={15} color="#2196F3" />
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>
                {item?.qty ? parseFloat(item.qty).toFixed(2) : "0.00"}
              </Text>
            </View>
            <View style={styles.iconRow}>
              <MaterialIcons name="attach-money" size={20} color="#FF9800" />
              <Text style={styles.label}>Rate:</Text>
              <Text style={styles.value}>
                {item?.rate ? parseFloat(item.rate).toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>

          <View style={styles.col}>
            <View style={styles.iconRow}>
              <MaterialIcons name="monetization-on" size={20} color="#9C27B0" />
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>
                {item?.amount ? parseFloat(item.amount).toFixed(2) : "0.00"}
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Feather name="trending-up" size={15} color="#F44336" />
              <Text style={styles.label}>Remaining:</Text>
              <Text style={styles.value}>
                {item?.remaining_qty
                  ? parseFloat(item.remaining_qty).toFixed(2)
                  : "0.00"}
              </Text>
            </View>
          </View>
        </View>
        <View style={[styles.iconRow, { alignSelf: "flex-end" }]}>
          <MaterialIcons name="calendar-today" size={14} color="#ccc" />
          <Text style={[styles.label, { fontSize: 10 }]}>Updated:</Text>
          <Text style={(styles.value, { fontSize: 10.5 })}>
            {new Date(item?.updated_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // if (loading)
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );

  const handleRefresh = () => {
    setRefresh(true);
    if (data?.id) {
      load();
    }
    setTimeout(() => setRefresh(false), 1000);
  };

  return (
    <View style={{ flex: 1 }}>
      <CustomHeader Title={"Physical Progress Update"} GoBack={true} />
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
            <Text style={styles.projectTitle}>{data?.name}</Text>
          </View>
        </View>
      </View>
      {loading ? (
        <>
          <SkeletonLoader />
        </>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(i) => String(i.id)}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
            // stickyHeaderIndices={[0]}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
            contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 20) }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: 200,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Jost-Medium",
                    fontSize: 30, // big like watermark
                    color: "#000", // black or any color
                    opacity: 0.3, // faded effect
                    position: "absolute", // behind content
                    textAlign: "center",
                  }}
                >
                  No found !
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginVertical: 2,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: "Jost-SemiBold",
    // color: "#333",
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: "#555",
    fontFamily: "Jost-Medium",
    marginHorizontal: 8,
    // width: "40%",
  },
  value: {
    fontSize: 14,
    color: "#000",
    fontFamily: "Jost-SemiBold",
  },
  projectCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    // marginBottom: 12,
    shadowColor: "#00000011",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    elevation: 1,
  },
  projectTitle: {
    fontSize: 13,
    fontFamily: "Jost-Medium",
    marginBottom: 8,
  },
  mediaBox: { width: 80, alignItems: "center", justifyContent: "center" },
  thumb: { width: 72, height: 48, resizeMode: "cover", borderRadius: 4 },
  noThumb: {
    width: 72,
    height: 48,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
});