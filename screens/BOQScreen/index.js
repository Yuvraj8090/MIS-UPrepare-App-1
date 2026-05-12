// screens/BoqListScreen.js
import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather, FontAwesome, MaterialIcons, Entypo } from "@expo/vector-icons";

import { fetchBoqEntriesDetails } from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import SkeletonLoader from "@/components/SkeletonDesign/BOQPhysicalProgressSkeleton";

export default function BoqListScreen({ navigation, route }) {
  const { data } = route?.params || {};
  const insets = useSafeAreaInsets(); // CRITICAL FIX: Initialized safe area insets

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  
  // Track expanded state per item ID
  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const loadData = useCallback(async (id, isRefresh = false) => {
    if (!id) return;
    
    if (isRefresh) {
      setRefresh(true);
    } else {
      setLoading(true);
    }

    try {
      const authToken = await getFromSS("authToken");
      const resp = await fetchBoqEntriesDetails(authToken, id);
      
      if (resp?.status) {
        const payload = resp.data.data || resp.data;
        // Filter out empty or zeroed entries
        const filtered = payload.filter(
          (item) =>
            !(item?.qty === null && item?.rate === null && item?.amount === null) &&
            !(item?.qty === "0.000" && item?.rate === "0.00" && item?.amount === "0.00")
        );
        setItems(filtered);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error("[BoqListScreen] Failed to load BOQ entries:", e);
      // Optional: Add a toast or UI error message here
    } finally {
      setLoading(false);
      setRefresh(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        loadData(data.id, false);
      }
    }, [data?.id, loadData])
  );

  const handleRefresh = () => {
    if (data?.id) {
      loadData(data.id, true); // CRITICAL FIX: Passed the ID to the refresh function
    } else {
      setRefresh(false);
    }
  };

  const renderItem = ({ item }) => {
    // Safety check for empty entries
    if (
      (item?.qty === "0.000" && item?.rate === "0.00" && item?.amount === "0.00") ||
      (item?.qty == null && item?.rate == null && item?.amount == null)
    ) {
      return null;
    }

    const isExpanded = expandedRows[item.id] || false;
    const description = item?.item_description || "No description available";
    const needsExpansion = description.length > 55; // Threshold for showing View/Hide

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.card}
        onPress={() => navigation.navigate("BOQDetailsScreen", { data: item })}
      >
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text 
              style={styles.title} 
              numberOfLines={isExpanded ? undefined : 2}
            >
              {item.sl_no} - {description}
            </Text>
            
            {needsExpansion && (
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => toggleExpand(item.id)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.expandText}>
                  {isExpanded ? "Hide details ▲" : "View full details ▼"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <MaterialIcons name="arrow-forward-ios" size={16} color="#9CA3AF" style={{ marginTop: 2 }} />
        </View>

        {/* Data Grid Section */}
        <View style={styles.gridRow}>
          {/* Column 1 */}
          <View style={styles.column}>
            <View style={styles.iconRow}>
              <Entypo name="ruler" size={14} color="#10B981" style={styles.icon} />
              <Text style={styles.label}>Unit:</Text>
              <Text style={styles.value} numberOfLines={1}>{item?.unit || "N/A"}</Text>
            </View>
            <View style={styles.iconRow}>
              <Feather name="package" size={14} color="#3B82F6" style={styles.icon} />
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{item?.qty ? parseFloat(item.qty).toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.iconRow}>
              <MaterialIcons name="attach-money" size={16} color="#F59E0B" style={styles.icon} />
              <Text style={styles.label}>Rate:</Text>
              <Text style={styles.value}>{item?.rate ? parseFloat(item.rate).toFixed(2) : "0.00"}</Text>
            </View>
          </View>

          {/* Column 2 */}
          <View style={styles.column}>
            <View style={styles.iconRow}>
              <MaterialIcons name="monetization-on" size={16} color="#8B5CF6" style={styles.icon} />
              <Text style={styles.label}>Amount:</Text>
              <Text style={styles.value}>{item?.amount ? parseFloat(item.amount).toFixed(2) : "0.00"}</Text>
            </View>
            <View style={styles.iconRow}>
              <Feather name="trending-up" size={14} color="#EF4444" style={styles.icon} />
              <Text style={styles.label}>Remaining:</Text>
              <Text style={styles.value}>
                {item?.remaining_qty ? parseFloat(item.remaining_qty).toFixed(2) : "0.00"}
              </Text>
            </View>
          </View>
        </View>

        {/* Footer Section */}
        <View style={styles.cardFooter}>
          <MaterialIcons name="access-time" size={12} color="#9CA3AF" />
          <Text style={styles.footerText}>
            Updated: {item?.updated_at ? new Date(item.updated_at).toLocaleDateString() : "Unknown"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.projectHeaderCard}>
      <FontAwesome name="folder-open" size={14} color="#3B82F6" style={{ marginTop: 2 }} />
      <Text style={styles.projectTitle}>
        {data?.name || "Unknown Project"}
      </Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Physical Progress Update"} GoBack={true} />
      
      {loading ? (
        <SkeletonLoader />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item?.id || Math.random())}
          refreshControl={
            <RefreshControl 
              refreshing={refresh} 
              onRefresh={handleRefresh} 
              tintColor="#3B82F6" 
            />
          }
          ListHeaderComponent={renderHeader}
          renderItem={renderItem}
          contentContainerStyle={[
            styles.listContent, 
            { paddingBottom: Math.max(insets.bottom, 20) + 20 }
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="inbox" size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>No BOQ entries found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6", // Light gray background makes white cards pop
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 12, // Modern flex gap replaces ItemSeparatorComponent
  },
  projectHeaderCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF", // Light blue tint for context
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 4,
    gap: 8,
  },
  projectTitle: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Jost-SemiBold",
    color: "#1E3A8A",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontFamily: "Jost-SemiBold",
    color: "#111827",
    lineHeight: 20,
  },
  expandButton: {
    alignSelf: "flex-end",
    marginTop: 4,
  },
  expandText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#3B82F6",
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 6,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 20, // Fixed width ensures all text aligns perfectly vertically
    textAlign: "center",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "Jost-Medium",
    marginHorizontal: 4,
  },
  value: {
    flex: 1,
    fontSize: 12.5,
    color: "#111827",
    fontFamily: "Jost-SemiBold",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 4,
  },
  footerText: {
    fontSize: 10.5,
    fontFamily: "Jost-Medium",
    color: "#9CA3AF",
  },
  emptyState: {
    flex: 1,
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyStateText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    color: "#9CA3AF",
  },
});