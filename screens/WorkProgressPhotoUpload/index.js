import React, { useEffect, useMemo, useState } from "react";
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
import {
  fetchAllWorkProgressSubPackageProjectById,
  uploadWorkProgressImages,
} from "@/services/api/fetch";
import * as Location from "expo-location";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import { showFeedback } from "@/services/platform/feedback";

const WorkProgressPhotoUpload = (props) => {
  const { data } = props?.route?.params || {};
  const navigation = useNavigation();
  const { user } = useAuth() || {};

  // State
  const [component, setComponent] = useState(null);
  const [items, setItems] = useState("");
  const [images, setImages] = useState([]);
  const [coords, setCoords] = useState(null);

  // UI State
  const [showLCard, setShowLCard] = useState(false);
  const [components, setComponents] = useState([]);
  const [project, setProject] = useState(null);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(false);

  // Fetch work components for this sub-project
  const getComponents = async (id) => {
    const authToken = await getFromSS("authToken");
    setLoad(true);
    try {
      const res = await fetchAllWorkProgressSubPackageProjectById(authToken, id);

      // `project` comes back null for an unknown id, still with HTTP 200.
      setComponents(Array.isArray(res?.components) ? res.components : []);
      setProject(res?.project || null);
    } catch (error) {
      console.log("Work component fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    if (data?.id) getComponents(data?.id);
  }, [data?.id]);

  // Location is optional: upload still proceeds if permission is denied.
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        const position = await Location.getCurrentPositionAsync({});
        setCoords(position?.coords || null);
      } catch (error) {
        console.log("Location unavailable ::", error);
      }
    })();
  }, []);

  // The API returns every component in the system, unfiltered by department.
  // The user carries a department *name*, not the numeric department_id the
  // API keys on, so only filter when a numeric id is actually available and
  // never filter the list down to nothing.
  const visibleComponents = useMemo(() => {
    const departmentId = user?.role?.department_id ?? user?.department_id ?? null;
    if (!departmentId) return components;
    const filtered = components.filter(
      (item) => item?.work_service?.department_id === departmentId
    );
    return filtered.length ? filtered : components;
  }, [components, user]);

  const componentLabel = (item) =>
    [item?.work_component, item?.type_details, item?.side_location]
      .filter(Boolean)
      .join(" - ");

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
    if (!component?.id) {
      Alert.alert("Required", "Please select a Work Component.");
      return;
    }

    if (!images || images.length === 0) {
      Alert.alert("Required", "Please upload at least one image.");
      return;
    }

    setShowLCard(true);
    const authToken = await getFromSS("authToken");

    const formData = new FormData();
    formData.append("project_id", String(data?.id ?? ""));
    formData.append("work_component_id", String(component?.id ?? ""));
    formData.append("description", items || "");

    if (coords?.latitude != null && coords?.longitude != null) {
      formData.append("lat", String(coords.latitude));
      formData.append("long", String(coords.longitude));
    }

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
      const res = await uploadWorkProgressImages(authToken, formData);

      // Success is signalled by `success: true` plus a message; the response
      // carries no media ids or urls, so there is nothing to render back.
      if (res?.success) {
        Platform.OS === "ios"
          ? Alert.alert("Success", res?.message)
          : showFeedback(res?.message);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Alert.alert("Error", res?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Work progress upload error ::", error);
      Alert.alert("Error", "Failed to submit progress. Please try again.");
    } finally {
      setShowLCard(false);
    }
  };

  const handleReset = () => {
    setComponent(null);
    setItems("");
    setImages([]);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <CustomHeader Title={"Add Work Progress Photos"} GoBack={true} />

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
                  {project?.name || data?.name || "Unknown Project"}
                </Text>
                {(project?.name || data?.name || "").length > 50 && (
                  <Text style={styles.expandText}>
                    {expandedTitle ? "Hide ▲" : "View full name ▼"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>

            {/* Dropdown Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Work Component <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <SelectDropdown
                data={visibleComponents}
                onSelect={(selectedItem) => setComponent(selectedItem)}
                renderButton={(selectedItem, isOpened) => {
                  return (
                    <View style={styles.dropdownBtn}>
                      <Text style={[styles.dropdownBtnText, !selectedItem && { color: "#9CA3AF" }]} numberOfLines={1}>
                        {selectedItem
                          ? componentLabel(selectedItem)
                          : load
                          ? "Loading components..."
                          : "Select Work Component"}
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
                        {componentLabel(item)}
                      </Text>
                    </View>
                  );
                }}
                dropdownStyle={styles.dropdownMenu}
              />
            </View>

            {/* Remarks Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description / Remarks</Text>
              <TextField
                placeholder="Describe the work shown in these photos..."
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

export default WorkProgressPhotoUpload;

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