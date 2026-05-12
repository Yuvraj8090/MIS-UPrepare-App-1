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
import CustomHeader from "@/components/AppHeader/CustomHeader";
import TextField from "@/components/TextField/TextField";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";
import LoaderCard from "@/components/LoaderCard";
import { getFromSS } from "@/services/storage/SecureStore";
import {
  saveECPPhycialProgressImage,
  saveFinancialProgress,
} from "@/services/api/fetch";
import { formatDate, width } from "@/services/helper";
import * as DocumentPicker from "expo-document-picker";
import { FontAwesome } from "@expo/vector-icons";
import { showFeedback } from "@/services/platform/feedback";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const FinancialProgress = (props) => {
  const { data } = props?.route?.params;
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
      if (!result.canceled) {
        setImages((prev) => [
          ...prev,
          {
            uri: result?.assets[0]?.uri,
            name: result?.assets[0]?.name,
            type: "application/pdf",
          },
        ]);
      }
    } catch (err) {
      console.log("Financial document picker error:", err);
    }
  };

  const handleSubmit = async () => {
    if (!financeAmount || !noOfBills || !submitDate || !projectId) {
      Alert.alert("All required fields must be filled");
      return;
    }

    if (images.length === 0) {
      Alert.alert("Please upload at least one file");
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
        if (fileUri.endsWith(".jpg") || fileUri.endsWith(".jpeg"))
          mimeType = "image/jpeg";
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
        Platform.OS === "ios" ? Alert.alert(res?.message) : showFeedback(res?.message);
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        Alert.alert(res?.message || "Submission failed");
      }
    } catch (error) {
      console.log("Financial progress submit error:", error);
      Alert.alert("Something went wrong. Try again.");
    } finally {
      setShowLoader(false);
    }
  };

  const handleReset = () => {
    setFinanceAmount("");
    setNoOfBills("");
    setBillSerialNo("");
    setSubmitDate(new Date());
    setImages([]);
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={["bottom"]}>
      <CustomHeader Title={"Add Financial Progress"} GoBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formCard}>
          <View style={styles.projectTag}>
            <FontAwesome
              name="folder-open"
              size={12}
              color={colors.primary}
              style={styles.projectTagIcon}
            />
            <Text style={styles.projectTagText}>{data?.name}</Text>
          </View>

          <Text style={styles.label}>
            Finance Amount (₹) <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextField
            placeholder="Enter finance amount"
            value={financeAmount}
            setData={setFinanceAmount}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Number of Bills <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextField
            placeholder="Enter number of bills"
            value={noOfBills}
            setData={setNoOfBills}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Bill Serial Numbers (Optional)</Text>
          <TextField
            placeholder="Example: 123, 124, 125"
            value={billSerialNo}
            setData={setBillSerialNo}
          />

          <Text style={styles.label}>
            Submit Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <CalenderField
            placeholder="dd/mm/yyyy"
            setCDate={setSubmitDate}
            Cdate={submitDate}
            bigSize={true}
          />

          <Text style={styles.label}>Upload Payment Slips</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromCamera}>
              <Text style={styles.fileBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromGallery}>
              <Text style={styles.fileBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromFiles}>
              <Text style={styles.fileBtnText}>📄 PDF</Text>
            </TouchableOpacity>
          </View>

          {images?.length > 0 && (
            <ScrollView
              horizontal
              style={styles.previewScroller}
              showsHorizontalScrollIndicator={false}
            >
              {images.map((file, i) => (
                <View key={i} style={styles.filePreview}>
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() =>
                      setImages((prev) =>
                        prev.filter((_, index) => index !== i)
                      )
                    }
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>

                  {file.type?.startsWith("image") ? (
                    <Image
                      source={{ uri: file.uri }}
                      style={styles.previewImg}
                    />
                  ) : (
                    <View style={styles.pdfPreview}>
                      <Text style={{ fontSize: 30 }}>📄</Text>
                      <Text numberOfLines={1} style={styles.pdfText}>
                        {file.name || "PDF File"}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#777" }]}
              onPress={handleReset}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "green" }]}
              onPress={handleSubmit}
            >
              <Text style={styles.btnText}>Save Financial Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoaderCard visible={showLoader} message={"Submitting..."} />
    </SafeAreaView>
  );
};

export default FinancialProgress;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    alignItems: "stretch",
    ...shadows.card,
  },
  projectTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  projectTagIcon: {
    marginTop: 1,
  },
  projectTagText: {
    flex: 1,
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: colors.text,
  },
  label: {
    fontFamily: "Jost-SemiBold",
    fontSize: 13,
    marginTop: 12,
    marginBottom: 4,
    color: colors.text,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: 8,
  },
  fileBtn: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 10,
    flex: 1,
    alignItems: "center",
  },
  fileBtnText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: colors.text,
  },
  previewScroller: {
    marginTop: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewImg: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginRight: 8,
  },
  btnRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: radius.md,
    alignItems: "center",
    ...shadows.soft,
  },
  btnText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
  },

  filePreview: {
    position: "relative",
    marginRight: 10,
    alignItems: "center",
  },
  previewImg: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  pdfPreview: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  pdfText: {
    fontSize: 12,
    marginTop: 4,
    maxWidth: 70,
    textAlign: "center",
  },
  removeBtn: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
    backgroundColor: colors.danger,
    borderRadius: 12,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  removeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
