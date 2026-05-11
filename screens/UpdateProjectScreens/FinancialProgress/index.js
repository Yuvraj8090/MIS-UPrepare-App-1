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

const FinancialProgress = (props) => {
  const { data } = props?.route?.params;
  const navigation = useNavigation();
  const projectId = data?.id;

  // States
  const [financeAmount, setFinanceAmount] = useState("");
  const [noOfBills, setNoOfBills] = useState("");
  const [billSerialNo, setBillSerialNo] = useState("");
  const [submitDate, setSubmitDate] = useState(new Date());
  const [images, setImages] = useState([]);
  const [showLoader, setShowLoader] = useState(false);

  // 📸 Pick Camera
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

  // 🖼️ Pick Gallery
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
      console.log("SELECT PDF RESULT  ::", result);

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
      console.log("Error picking document:", err);
    }
  };

  // ✅ Submit Handler
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
    formData.append("project_id", projectId); // ✅ REQUIRED FIELD
    formData.append("finance_amount", financeAmount);
    formData.append("no_of_bills", noOfBills);
    formData.append("bill_serial_no", billSerialNo);

    // ✅ Convert Date object to string: YYYY-MM-DD
    formData.append("submit_date", formatDate(submitDate));

    // ✅ Append each media file properly
    images.forEach((file, index) => {
      let fileUri = file.uri;
      let fileName = file.name || `file_${index}`;
      let mimeType = file.type;

      // ✅ Detect type correctly
      if (!mimeType) {
        if (fileUri.endsWith(".jpg") || fileUri.endsWith(".jpeg"))
          mimeType = "image/jpeg";
        else if (fileUri.endsWith(".png")) mimeType = "image/png";
        else if (fileUri.endsWith(".pdf")) mimeType = "application/pdf";
        else mimeType = "application/octet-stream"; // fallback
      }

      // ✅ Ensure name has extension
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

    // console.log("FORMDATTA :", formData);

    for (let [key, value] of formData._parts) {
      console.log("FormData =>", key, value);
    }

    try {
      const res = await saveFinancialProgress(authToken, formData);
      if (res?.status) {
        Platform.OS === "ios" ? Alert.alert(res?.message) : showFeedback(res?.message);
        setTimeout(() => navigation.goBack(), 2000);
      } else {
        Alert.alert(res?.message || "Submission failed");
      }
    } catch (error) {
      console.log("Error submitting:", error);
      Alert.alert("Something went wrong. Try again.");
    } finally {
      setShowLoader(false);
    }
  };

  // ♻️ Reset
  const handleReset = () => {
    setFinanceAmount("");
    setNoOfBills("");
    setBillSerialNo("");
    setSubmitDate(new Date());
    setImages([]);
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Add Financial Progress"} GoBack={true} />

      <ScrollView style={{ margin: 12 }} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
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
              style={{
                fontFamily: "Jost-Medium",
                fontSize: 13,
                marginRight: 2,
              }}
            >
              {data?.name}
            </Text>
          </View>

          {/* Finance Amount */}
          <Text style={styles.label}>
            Finance Amount (₹) <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextField
            placeholder="Enter finance amount"
            value={financeAmount}
            setData={setFinanceAmount}
            keyboardType="numeric"
          />

          {/* Number of Bills */}
          <Text style={styles.label}>
            Number of Bills <Text style={{ color: "red" }}>*</Text>
          </Text>
          <TextField
            placeholder="Enter number of bills"
            value={noOfBills}
            setData={setNoOfBills}
            keyboardType="numeric"
          />

          {/* Bill Serial Numbers */}
          <Text style={styles.label}>Bill Serial Numbers (Optional)</Text>
          <TextField
            placeholder="Example: 123, 124, 125"
            value={billSerialNo}
            setData={setBillSerialNo}
          />

          {/* Submit Date */}
          <Text style={styles.label}>
            Submit Date <Text style={{ color: "red" }}>*</Text>
          </Text>
          <CalenderField
            placeholder="dd/mm/yyyy"
            setCDate={setSubmitDate}
            Cdate={submitDate}
            bigSize={true}
          />

          {/* Upload Files */}
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

          {/* Preview */}
          {images?.length > 0 && (
            <ScrollView
              horizontal
              style={{
                marginTop: 16,
                paddingVertical: 10,
              }}
            >
              {images.map((file, i) => (
                <View key={i} style={styles.filePreview}>
                  {/* Remove Button */}
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

          {/* Buttons */}
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
    </View>
  );
};

export default FinancialProgress;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    elevation: 2,
    marginBottom: 20,
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
    marginLeft: 16,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  fileBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    flex: 0.48,
    alignItems: "center",
    marginHorizontal: 6,
  },
  fileBtnText: {
    fontSize: 13,
    color: "#333",
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
    marginTop: 20,
  },
  button: {
    // width: width * 0.3,
    padding: 12,
    margin: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
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
    borderRadius: 8,
    backgroundColor: "#f2f2f2",
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
    backgroundColor: "red",
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
