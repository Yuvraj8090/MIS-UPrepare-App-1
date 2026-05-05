import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { fetchFinancalProgress } from "@/services/api/fetch";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getFromSS } from "@/services/storage/SecureStore";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { width } from "@/services/helper";
import FinancialMediaPopUp from "../../components/FinancialMediaPopup";

const FinancialScreen = (props) => {
  console.log("PROPSSS FINANCIAL ::", props?.route?.params);
  const { data } = props?.route?.params;
  const navigation = useNavigation();

  const [entries, setEntries] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const [imgLoad, setImgLoad] = useState(false);

  // 🔹 API call
  const getEntries = async (id) => {
    const authToken = await getFromSS("authToken");

    setLoad(true);
    try {
      const res = await fetchFinancalProgress(authToken, id);
      console.log("RESS FINANCIAL ::", res);
      if (res?.status) {
        setEntries(res?.data || []);
      } else {
        setEntries([]);
      }

      setLoad(false);
    } catch (error) {
      console.log("GET FINANCIAL API ERROR ::", error);
      setLoad(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        getEntries(data?.id);
      }
    }, [data?.id])
  );

  const handleRefresh = () => {
    setRefresh(true);
    if (data?.id) {
      getEntries(data?.id);
    }
    setTimeout(() => setRefresh(false), 1000);
  };

  const renderItem = ({ item, index }) => {
    const formattedAmount = `₹ ${parseInt(
      item.finance_amount
    ).toLocaleString()}`;
    const formattedDate = new Date(item.submit_date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

    return (
      <View
        style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]}
      >
        <Text style={[styles.cell, { flex: 0.3 }]}>{index + 1}</Text>
        <Text style={[styles.cell, { flex: 1.5 }]}>{item?.bill_serial_no}</Text>
        <Text style={[styles.cell, { flex: 0.6 }]}>{item?.no_of_bills}</Text>
        <Text style={[styles.cell, { flex: 1.5 }]}>{formattedAmount}</Text>
        <Text style={[styles.cell, { flex: 1.4 }]}>{formattedDate}</Text>
        {item?.media?.length > 0 ? (
          <>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setModalVisible(true);
                setSelected(item);
              }}
              style={[styles.cell, { flex: 0.6 }]}
            >
              <Text
                style={[
                  // styles.cell,
                  {
                    textDecorationLine: "underline",
                    color: "#007BFF",
                  },
                ]}
              >
                Files
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={[styles.cell, { flex: 1 }]}>
              {item?.media?.length > 0 ? "View Files" : "No Files"}
            </Text>
          </>
        )}
      </View>
    );
  };

  if (load) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#777" />
        <Text style={{ fontFamily: "Jost-Medium" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader Title={"Financial Progress List"} GoBack={true} />
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
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
                  {data?.name}
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
                    navigation.navigate("FinancialProgressForm", {
                      data,
                    })
                  }
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

                {data?.name?.length > 60 && (
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
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.headerCell, { flex: 0.3 }]}>#</Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>
                Bill Serial No
              </Text>
              <Text style={[styles.headerCell, { flex: 1 }]}>No. of Bills</Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>
                Finance Amount
              </Text>
              <Text style={[styles.headerCell, { flex: 1.5 }]}>
                Submit Date
              </Text>
              <Text style={[styles.headerCell, { flex: 0.8 }]}>Media</Text>
            </View>
          </View>
        }
        renderItem={renderItem}
        stickyHeaderIndices={[0]}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <FinancialMediaPopUp
        visible={modalVisible}
        setVisible={setModalVisible}
        data={selected}
      />
    </View>
  );
};

export default FinancialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 10,
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
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    alignItems: "center",
  },
  headerRow: {
    backgroundColor: "#28a745",
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cell: {
    fontSize: 12,
    color: "#333",
    fontFamily: "Jost-Medium",
    paddingHorizontal: 4,
  },
  headerCell: {
    fontSize: 12,
    fontFamily: "Jost-SemiBold",
    color: "#fff",
    paddingHorizontal: 4,
  },
  evenRow: {
    backgroundColor: "#fff",
  },
  oddRow: {
    backgroundColor: "#f1f5f9",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
