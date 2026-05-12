import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

// Components & Services
import CustomHeader from "@/components/AppHeader/CustomHeader";
import TextField from "@/components/TextField/TextField";
import LoaderCard from "@/components/LoaderCard";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchECPActivityStages, saveECPPhycialProgressImage } from "@/services/api/fetch";
import { showFeedback } from "@/services/platform/feedback";

const EPCPhysicalProgressForm = (props) => {
  const { data, remainProgress } = props?.route?.params || {};
  const navigation = useNavigation();

  // State
  const [stage, setStage] = useState(null);
  const [items, setItems] = useState("");
  const [images, setImages] = useState([]);
  
  // UI State
  const [showLCard, setShowLCard] = useState(false);
  const [activity, setAcitvity] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(false);

  // Fetch Activities
  const getActivity = async (id) => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    try {
      const res = await fetchECPActivityStages(authToken, id);
      setAcitvity(res?.data || []);
    } catch (error) {
      console.log("EPC activity fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (data?.id) getActivity(data?.id);
  }, [data?.id]);

  // Media Pickers
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets]);
    }
  };

  // Submit Handler
  const handleSubmit = async () => {
    if (!stage?.id) {
      Alert.alert("Required", "Please select an Activity & Stage.");
      return;
    }

    if (!images || images.length === 0) {
      Alert.alert("Required", "Please upload at least one image.");
      return;
    }

    setShowLCard(true);
    const authToken = await getFromSS("authToken");

    const formData = new FormData();
    formData.append("epcentry_data_id", stage?.id);
    formData.append("remarks", items);

    // FIXED: Loop through all images to append them correctly for Laravel array validation
    images.forEach((img, index) => {
      let localUri = img.uri;
      let filename = img.fileName || localUri.split("/").pop() || `image_${index}.jpg`;
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image/jpeg`;

      formData.append("images[]", {
        uri: localUri,
        name: filename,
        type,
      });
    });

    try {
      const res = await saveECPPhycialProgressImage(authToken, formData);
      if (res?.status) {
        Platform.OS === "ios" ? Alert.alert("Success", res?.message) : showFeedback(res?.message);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Alert.alert("Error", res?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("EPC progress submit error ::", error);
      Alert.alert("Error", "Failed to submit progress. Please try again.");
    } finally {
      setShowLCard(false);
    }
  };

  const handleReset = () => {
    setStage(null);
    setItems("");
    setImages([]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <CustomHeader Title={"Add Physical EPC Progress"} GoBack={true} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
            {/* Project Context Card with Expandable Text */}
            <TouchableOpacity 
              style={styles.projectCard} 
              activeOpacity={0.8}
              onPress={() => setExpandedTitle(!expandedTitle)}
            >
              <FontAwesome name="folder-open" size={16} color="#3B82F6" style={styles.projectTagIcon} />
              <View style={styles.projectTextContainer}>
                <Text style={styles.projectLabel}>Posting to Project</Text>
                <Text 
                  style={styles.projectTagText} 
                  numberOfLines={expandedTitle ? undefined : 2}
                >
                  {data?.name || "Unknown Project"}
                </Text>
                {data?.name?.length > 50 && (
                  <Text style={styles.expandText}>
                    {expandedTitle ? "Hide ▲" : "View full name ▼"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Dropdown Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Activity Name & Stage <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <SelectDropdown
                data={activity}
                onSelect={(selectedItem) => setStage(selectedItem)}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownBtn}>
                      <Text style={[styles.dropdownBtnText, !selectedItem && { color: "#9CA3AF" }]} numberOfLines={1}>
                        {selectedItem
                          ? `${selectedItem?.activity_name} - ${selectedItem?.stage_name}`
                          : "Select Activity & Stage"}
                      </Text>
                      <MaterialCommunityIcons
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#6B7280"
                      />
                    </View>
                  );
                }}
                renderItem={(item, index, isSelected) => {
                  return (
                    <View style={[styles.dropdownItem, isSelected && styles.dropdownItemSelected]}>
                      <Text style={[styles.dropdownItemTxt, isSelected && { color: "#1E3A8A", fontFamily: "Jost-SemiBold" }]}>
                        {item?.activity_name} - {item?.stage_name}
                      </Text>
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdownMenu}
              />
            </View>

            {/* Remarks Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Remarks / Items</Text>
              <TextField
                placeholder="Enter item descriptions or remarks..."
                value={items}
                setData={setItems}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* File Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.label}>
                Upload Images <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.rowBetween}>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={pickFromCamera}>
                  <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="camera" size={22} color="#0284C7" />
                  </View>
                  <Text style={styles.actionBtnText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={pickFromGallery}>
                  <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                    <Ionicons name="images" size={22} color="#9333EA" />
                  </View>
                  <Text style={styles.actionBtnText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Image Preview Scroller */}
            {images?.length > 0 && (
              <ScrollView
                horizontal
                style={styles.previewScroller}
                contentContainerStyle={{ paddingRight: 20 }}
                showsHorizontalScrollIndicator={false}
              >
                {images.map((img, i) => (
                  <View key={i} style={styles.filePreviewContainer}>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      activeOpacity={0.8}
                      onPress={() => setImages((prev) => prev.filter((_, index) => index !== i))}
                    >
                      <Ionicons name="close" size={14} color="#FFF" />
                    </TouchableOpacity>
                    <Image source={{ uri: img.uri }} style={styles.previewImg} />
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={handleReset}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Ionicons name="cloud-upload-outline" size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>

   
        </ScrollView>

        <LoaderCard visible={showLCard} message={"Uploading Images..."} />
      </View>
    </SafeAreaView>
  );
};

export default EPCPhysicalProgressForm;

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
    height:1560,
    minHeight: 600,
    backgroundColor: "#F3F4F6", // Light gray background
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    // Premium soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  projectCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF", // Subtle blue tint
    borderWidth: 1,
    borderColor: "#BFDBFE",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 12,
  },
  projectTextContainer: {
    flex: 1,
  },
  projectTagIcon: {
    marginTop: 2,
  },
  projectLabel: {
    fontFamily: "Jost-Medium",
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  projectTagText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 20,
  },
  expandText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 6,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    color: "#374151",
    marginBottom: 6,
  },
  requiredAsterisk: {
    color: "#EF4444",
  },
  // Dropdown Styles
  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 50,
    paddingHorizontal: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dropdownBtnText: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  dropdownMenu: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemSelected: {
    backgroundColor: "#EFF6FF",
  },
  dropdownItemTxt: {
    fontFamily: "Jost-Medium",
    fontSize: 14,
    color: "#4B5563",
  },
  uploadSection: {
    marginTop: 4,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#4B5563",
  },
  previewScroller: {
    marginTop: 8,
    marginBottom: 16,
  },
  filePreviewContainer: {
    position: "relative",
    marginRight: 16,
    marginTop: 8,
  },
  previewImg: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
    backgroundColor: "#EF4444",
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#4B5563",
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
  },
  saveButton: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#10B981", // Emerald Green for positive action
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontFamily: "Jost-SemiBold",
    fontSize: 14,
  },
});