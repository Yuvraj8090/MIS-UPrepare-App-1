import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";

// Services & Components
import { fetchFinancalProgress } from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import FinancialMediaPopUp from "../../components/FinancialMediaPopup";

const FinancialScreen = (props) => {
  const { data } = props?.route?.params || {};
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // State Management
  const [entries, setEntries] = useState([]);
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // 🔹 Fetch Data
  const getEntries = async (id, isRefresh = false) => {
    if (isRefresh) setRefresh(true);
    else setLoad(true);

    try {
      const authToken = await getFromSS("authToken");
      const res = await fetchFinancalProgress(authToken, id);
      
      if (res?.status && res?.data) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("[FinancialScreen] API ERROR ::", error);
      setEntries([]);
    } finally {
      setLoad(false);
      setRefresh(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        getEntries(data.id);
      }
    }, [data?.id])
  );

  const handleRefresh = () => {
    if (data?.id) {
      getEntries(data.id, true);
    }
  };

  // 🔹 Render Individual Financial Card
  const renderItem = ({ item, index }) => {
    // Safely format Indian currency
    const formattedAmount = item?.finance_amount 
      ? `₹ ${parseFloat(item.finance_amount).toLocaleString("en-IN", {
          maximumFractionDigits: 2,
        })}`
      : "₹ 0.00";

    const formattedDate = item?.submit_date
      ? new Date(item.submit_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "N/A";

    const hasFiles = item?.media_files && item.media_files.length > 0;

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.serialBadge}>
            <Text style={styles.serialBadgeText}>#{index + 1}</Text>
          </View>
          <Text style={styles.dateText}>
            <Ionicons name="calendar-outline" size={12} color="#6B7280" /> {formattedDate}
          </Text>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <Text style={styles.billSerialText}>
            {item?.bill_serial_no || "Unnamed Bill"}
          </Text>
          
          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Amount Paid</Text>
              <Text style={styles.amountText}>{formattedAmount}</Text>
            </View>
            <View style={[styles.statBox, { alignItems: "flex-end" }]}>
              <Text style={styles.statLabel}>No. of Bills</Text>
              <Text style={styles.statValue}>{item?.no_of_bills || 0}</Text>
            </View>
          </View>
        </View>

        {/* Card Footer / Actions */}
        <View style={styles.cardFooter}>
          {hasFiles ? (
            <TouchableOpacity
              style={styles.fileButton}
              activeOpacity={0.8}
              onPress={() => {
                setSelectedItem(item);
                setModalVisible(true);
              }}
            >
              <Ionicons name="document-attach-outline" size={16} color="#FFFFFF" />
              <Text style={styles.fileButtonText}>
                View Files ({item.media_files.length})
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noFileBadge}>
              <Ionicons name="document-outline" size={14} color="#9CA3AF" />
              <Text style={styles.noFileText}>No Files Attached</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  // 🔹 Render Project Sticky Header
  const renderHeader = () => (
    <View style={styles.projectHeaderWrapper}>
      <View style={styles.projectCard}>
        <View style={styles.projectTitleRow}>
          <FontAwesome name="folder-open" size={14} color="#3B82F6" style={{ marginTop: 2 }} />
          <Text style={styles.projectTitle} numberOfLines={expandedTitle ? undefined : 2}>
            {data?.name || "Unknown Project"}
          </Text>
        </View>

        <View style={styles.projectActionsRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.addButton}
            onPress={() => navigation.navigate("FinancialProgressForm", { data })}
          >
            <FontAwesome5 name="plus-circle" size={14} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add Progress</Text>
          </TouchableOpacity>

          {data?.name?.length > 55 && (
            <TouchableOpacity onPress={() => setExpandedTitle(!expandedTitle)}>
              <Text style={styles.expandText}>{expandedTitle ? "Hide ▲" : "View full name ▼"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <CustomHeader Title={"Financial Progress"} GoBack={true} />

        {load && !refresh ? (
          <View style={styles.loaderContainer}>
            {renderHeader()}
            <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
            <Text style={styles.loadingText}>Fetching financial records...</Text>
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} tintColor="#10B981" />
            }
            ListHeaderComponent={renderHeader}
            renderItem={renderItem}
            contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 20) + 20 }]}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No financial records found.</Text>
              </View>
            }
          />
        )}

        {/* Media Pop-Up Modal */}
        {selectedItem && (
          <FinancialMediaPopUp
            visible={modalVisible}
            setVisible={setModalVisible}
            data={selectedItem} // Passing the whole object so the popup can map `media_files`
          />
        )}
      </View>
    </SafeAreaView>
  );
};

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    height: 1560,
    minHeight: 600,
    backgroundColor: "#F3F4F6", // Light gray background for contrast
  },
  projectHeaderWrapper: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  projectCard: {
    backgroundColor: "#EFF6FF", // Subtle blue tint
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  projectTitleRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectTitle: {
    flex: 1,
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  projectActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981", // Emerald Green for Financial Actions
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    gap: 6,
  },
  addButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  expandText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#3B82F6",
  },
  listContent: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  serialBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  serialBadgeText: {
    fontFamily: "Jost-Bold",
    fontSize: 12,
    color: "#4B5563",
  },
  dateText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#6B7280",
  },
  cardBody: {
    marginBottom: 12,
  },
  billSerialText: {
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: "#111827",
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 10,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  statValue: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: "#374151",
  },
  amountText: {
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: "#10B981", // Success green to highlight money
  },
  cardFooter: {
    marginTop: 4,
    alignItems: "flex-start",
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6", // Action Blue
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    gap: 6,
  },
  fileButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#FFFFFF",
  },
  noFileBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  noFileText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#9CA3AF",
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
  },
  loadingText: {
    fontFamily: "Jost-Medium",
    color: "#6B7280",
    marginTop: 12,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyStateText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    color: "#9CA3AF",
  },
});

export default FinancialScreen;