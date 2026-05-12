import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

import CustomHeader from "@/components/AppHeader/CustomHeader";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchECPPhycialProgress } from "@/services/api/fetch";
import SkeletonLoader from "@/components/SkeletonDesign/EntryCardSkeleton";

const { width, height } = Dimensions.get("window");
const ITEMS_PER_PAGE = 10;

const ECPScreen = (props) => {
  const { data } = props?.route?.params || {};
  const navigation = useNavigation();

  // State Management
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1); // For client-side pagination
  const [load, setLoad] = useState(true);
  const [expandedTitle, setExpandedTitle] = useState(false);

  // Modal & Image Gallery State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  // Fetch Data
  const getEntries = async (id) => {
    setLoad(true);
    try {
      const authToken = await getFromSS("authToken");
      const res = await fetchECPPhycialProgress(authToken, id);
      
      if (res?.status && res?.data) {
        setEntries(res.data);
      } else {
        setEntries([]);
      }
    } catch (error) {
      console.error("[ECPScreen] API ERROR ::", error);
      setEntries([]);
    } finally {
      setLoad(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        getEntries(data.id);
        setPage(1); // Reset pagination on focus
      }
    }, [data?.id])
  );

  // Pagination Logic
  const paginatedEntries = entries.slice(0, page * ITEMS_PER_PAGE);

  const handleLoadMore = () => {
    if (page * ITEMS_PER_PAGE < entries.length) {
      setPage((prev) => prev + 1);
    }
  };

  const openImageGallery = (imageUrls) => {
    setSelectedImages(imageUrls);
    setModalVisible(true);
  };

  // Render Individual EPC Entry Card
  const renderItem = ({ item }) => {
    // Note: API uses epc_entry_data, falling back to epcentry_data just in case
    const epcData = item?.epc_entry_data || item?.epcentry_data || {};
    const hasImages = item?.image_urls && item?.image_urls.length > 0;

    return (
      <View style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>S.No: {epcData?.sl_no || "N/A"}</Text>
          </View>
          <Text style={styles.dateText}>
            {item?.progress_submitted_date 
              ? new Date(item.progress_submitted_date).toLocaleDateString("en-GB") 
              : "No Date"}
          </Text>
        </View>

        {/* Card Body */}
        <View style={styles.cardBody}>
          <Text style={styles.activityTitle}>{epcData?.activity_name || "Unknown Activity"}</Text>
          <Text style={styles.stageText}>{epcData?.stage_name || "Unknown Stage"}</Text>
          
          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValueGreen}>{item?.percent ? `${item.percent}%` : "0%"}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Amount</Text>
              <Text style={styles.statValue}>
                {item?.amount ? `₹${parseFloat(item.amount).toLocaleString('en-IN')}` : "₹0"}
              </Text>
            </View>
          </View>

          <View style={styles.itemsDoneContainer}>
            <Text style={styles.statLabel}>Items Done:</Text>
            <Text style={styles.itemsDoneText}>{item?.items || "None specified"}</Text>
          </View>
        </View>

        {/* Card Footer / Actions */}
        {hasImages && (
          <View style={styles.cardFooter}>
            <TouchableOpacity
              style={styles.imageButton}
              activeOpacity={0.8}
              onPress={() => openImageGallery(item.image_urls)}
            >
              <Ionicons name="images-outline" size={16} color="#fff" />
              <Text style={styles.imageButtonText}>
                {item.image_urls.length > 1 
                  ? `View Images (${item.image_urls.length})` 
                  : "View Image"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render Image inside Modal Gallery
  const renderGalleryImage = ({ item }) => (
    <View style={styles.galleryImageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.previewImage}
        resizeMode="contain"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <CustomHeader Title={"Physical EPC Progress Management"} GoBack={true} />

        {/* Sticky Project Header */}
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
                onPress={() => navigation.navigate("ECPPhysicalProgressForm", { data })}
              >
                <FontAwesome5 name="plus-circle" size={14} color="#fff" />
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

        {/* List Content */}
        {load ? (
          <View style={{ padding: 15 }}>
            <SkeletonLoader width="100%" height={150} style={{ marginBottom: 15 }} />
            <SkeletonLoader width="100%" height={150} style={{ marginBottom: 15 }} />
          </View>
        ) : (
          <FlatList
            data={paginatedEntries}
            keyExtractor={(item) => item?.id?.toString() || Math.random().toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
                <Text style={styles.emptyStateText}>No Progress Entries Found!</Text>
              </View>
            }
          />
        )}

        {/* Enhanced Image Gallery Modal */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <SafeAreaView style={styles.modalSafeArea}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {selectedImages.length} {selectedImages.length > 1 ? "Images" : "Image"} Attached
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setModalVisible(false);
                    setSelectedImages([]);
                  }}
                >
                  <Ionicons name="close-circle" size={30} color="#EF4444" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={selectedImages}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={renderGalleryImage}
                contentContainerStyle={{ alignItems: 'center' }}
              />
              
              {selectedImages.length > 1 && (
                <Text style={styles.swipeHint}>Swipe left/right to view more</Text>
              )}
            </SafeAreaView>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
};

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  projectHeaderWrapper: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    zIndex: 10,
  },
  projectCard: {
    backgroundColor: "#EFF6FF",
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
    backgroundColor: "#10B981", // Emerald Green
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
    padding: 12,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
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
    marginBottom: 10,
  },
  badgeContainer: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    color: "#4B5563",
  },
  dateText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#9CA3AF",
  },
  cardBody: {
    marginBottom: 10,
  },
  activityTitle: {
    fontFamily: "Jost-Bold",
    fontSize: 15,
    color: "#111827",
    marginBottom: 4,
  },
  stageText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  statValue: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#111827",
  },
  statValueGreen: {
    fontFamily: "Jost-Bold",
    fontSize: 16,
    color: "#10B981", // Success green for progress
  },
  itemsDoneContainer: {
    backgroundColor: "#F9FAFB",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  itemsDoneText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
    lineHeight: 18,
  },
  cardFooter: {
    marginTop: 5,
    alignItems: "flex-start",
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6", // Blue
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  imageButtonText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: "#FFFFFF",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    gap: 12,
  },
  emptyStateText: {
    fontFamily: "Jost-Medium",
    fontSize: 16,
    color: "#9CA3AF",
  },
  // Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 5,
  },
  galleryImageContainer: {
    width: width,
    height: height * 0.7,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  swipeHint: {
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    paddingBottom: 30,
  },
});

export default ECPScreen;