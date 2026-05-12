import React, { useState } from "react";
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
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

// Components & Services
import CustomHeader from "@/components/AppHeader/CustomHeader";
import TextField from "@/components/TextField/TextField";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";
import LoaderCard from "@/components/LoaderCard";
import { getFromSS } from "@/services/storage/SecureStore";
import { saveFinancialProgress } from "@/services/api/fetch";
import { formatDate } from "@/services/helper";
import { showFeedback } from "@/services/platform/feedback";

const FinancialProgress = (props) => {
  const { data } = props?.route?.params || {};
  const navigation = useNavigation();
  const projectId = data?.id;

  const [financeAmount, setFinanceAmount] = useState("");
  const [noOfBills, setNoOfBills] = useState("");
  const [billSerialNo, setBillSerialNo] = useState("");
  const [submitDate, setSubmitDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

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

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setImages((prev) => [
          ...prev,
          {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
            type: "application/pdf",
          },
        ]);
      }
    } catch (err) {
      console.log("Financial document picker error:", err);
    }
  };
const [expandedTitle, setExpandedTitle] = useState(false);
  const handleSubmit = async () => {
    if (!financeAmount || !noOfBills || !submitDate || !projectId) {
      Alert.alert("Required Fields Missing", "Please fill in all mandatory fields marked with an asterisk (*).");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Attachment Required", "Please upload at least one payment slip or bill document.");
      return;
    }

    setShowLoader(true);
    const authToken = await getFromSS("authToken");

    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("finance_amount", financeAmount);
    formData.append("no_of_bills", noOfBills);
    formData.append("bill_serial_no", billSerialNo);
    formData.append("submit_date", formatDate(submitDate));

    images.forEach((file, index) => {
      let fileUri = file.uri;
      let fileName = file.name || `file_${index}`;
      let mimeType = file.type;

      if (!mimeType) {
        if (fileUri.endsWith(".jpg") || fileUri.endsWith(".jpeg")) mimeType = "image/jpeg";
        else if (fileUri.endsWith(".png")) mimeType = "image/png";
        else if (fileUri.endsWith(".pdf")) mimeType = "application/pdf";
        else mimeType = "application/octet-stream";
      }

      if (!fileName.includes(".")) {
        if (mimeType === "image/jpeg") fileName += ".jpg";
        else if (mimeType === "image/png") fileName += ".png";
        else if (mimeType === "application/pdf") fileName += ".pdf";
      }

      formData.append("media[]", {
        uri: fileUri,
        type: mimeType,
        name: fileName,
      });
    });

    try {
      const res = await saveFinancialProgress(authToken, formData);
      if (res?.status) {
        Platform.OS === "ios" ? Alert.alert("Success", res?.message) : showFeedback(res?.message);
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        Alert.alert("Error", res?.message || "Submission failed");
      }
    } catch (error) {
      console.log("Financial progress submit error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    } finally {
      setShowLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["bottom"]}>
      <View style={styles.container}>
        <CustomHeader Title={"Add Financial Progress"} GoBack={true} />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formCard}>
            
            {/* Project Context Card */}
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
    
    {/* Only show the toggle indicator if the name is long */}
    {data?.name?.length > 50 && (
      <Text style={styles.expandText}>
        {expandedTitle ? "Hide ▲" : "View full name ▼"}
      </Text>
    )}
  </View>
</TouchableOpacity>

            {/* Input Fields */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Finance Amount (₹) <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextField
                placeholder="e.g. 50000"
                value={financeAmount}
                setData={setFinanceAmount}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Number of Bills <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextField
                placeholder="e.g. 5"
                value={noOfBills}
                setData={setNoOfBills}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bill Serial Numbers (Optional)</Text>
              <TextField
                placeholder="Example: 123, 124, 125"
                value={billSerialNo}
                setData={setBillSerialNo}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Submit Date <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <CalenderField
                placeholder="dd/mm/yyyy"
                setCDate={setSubmitDate}
                Cdate={submitDate}
                bigSize={true}
              />
            </View>

            {/* File Upload Section */}
            <View style={styles.uploadSection}>
              <Text style={styles.label}>
                Upload Payment Slips <Text style={styles.requiredAsterisk}>*</Text>
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

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7} onPress={pickFromFiles}>
                  <View style={[styles.iconCircle, { backgroundColor: '#FEE2E2' }]}>
                    <Ionicons name="document-text" size={22} color="#DC2626" />
                  </View>
                  <Text style={styles.actionBtnText}>PDF File</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preview Section */}
            {images?.length > 0 && (
              <ScrollView
                horizontal
                style={styles.previewScroller}
                contentContainerStyle={{ paddingRight: 20 }}
                showsHorizontalScrollIndicator={false}
              >
                {images.map((file, i) => (
                  <View key={i} style={styles.filePreviewContainer}>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      activeOpacity={0.8}
                      onPress={() => setImages((prev) => prev.filter((_, index) => index !== i))}
                    >
                      <Ionicons name="close" size={14} color="#FFF" />
                    </TouchableOpacity>

                    {file.type?.startsWith("image") ? (
                      <Image source={{ uri: file.uri }} style={styles.previewImg} />
                    ) : (
                      <View style={styles.pdfPreview}>
                        <Ionicons name="document-text" size={32} color="#EF4444" />
                        <Text numberOfLines={1} style={styles.pdfText}>
                          {file.name || "PDF File"}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </ScrollView>
            )}

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.saveButton}
                activeOpacity={0.8}
                onPress={handleSubmit}
              >
                <Ionicons name="checkmark-circle-outline" size={18} color="#FFF" />
                <Text style={styles.saveBtnText}>Save Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <LoaderCard visible={showLoader} message={"Submitting..."} />
      </View>
    </SafeAreaView>
  );
};

export default FinancialProgress;

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
    backgroundColor: "#F3F4F6", // Light gray matching the reference
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
    alignItems: "center",
    backgroundColor: "#EFF6FF", // Subtle blue tint
    borderWidth: 1,
    width: "100%",
    borderColor: "#BFDBFE",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    gap: 12,
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
    width: "90%",
    color: "#1E3A8A",
  },
  projectTextContainer: {
    flex: 1,
  },
  expandText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 4,
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
  pdfPreview: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },
  pdfText: {
    fontFamily: "Jost-Medium",
    fontSize: 10,
    color: "#991B1B",
    marginTop: 6,
    textAlign: "center",
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