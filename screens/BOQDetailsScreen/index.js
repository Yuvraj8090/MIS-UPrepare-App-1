// screens/BoqDetailScreen.js
import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  RefreshControl,
  Alert,
} from "react-native";
import {
  fetchOldSubpackageBoqEntries,
  saveBOQProgress,
} from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { Entypo, Feather, MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import ImageView from "react-native-image-viewing";
import { useFocusEffect } from "@react-navigation/native";

export default function BoqDetailScreen(props) {
  const { data } = props?.route?.params;
  console.log("PROPPSS DATAT:;", data);
  const [oldEntries, setOldEntries] = useState([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [qty, setQty] = useState("");
  const [remarks, setRemarks] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [error, setError] = useState("");
  const [viewImages, setViewImages] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedTitle, setExpandedTitle] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (data?.sub_package_project_id) {
        loadOldEntries(data?.sub_package_project_id);
      }
    }, [data?.sub_package_project_id])
  );

  const loadOldEntries = async (id) => {
    const authToken = await getFromSS("authToken");
    setLoading(true);
    try {
      const resp = await fetchOldSubpackageBoqEntries(authToken, id);
      console.log("RESS DETAILSS::", resp);
      const payload = resp.data.data || resp.data;
      const filtered = Array.isArray(payload)
        ? payload.filter((x) => String(x.boq_entry_id) === String(data?.id))
        : [];
      console.log("FILTERR :", JSON.stringify(filtered));
      setOldEntries(filtered);
    } catch (e) {
      console.error(e);
      alert("Failed to load progress history");
    } finally {
      setLoading(false);
    }
  };

  const handleQtyChange = (val) => {
    // allow only numbers + one decimal point
    const numeric = val.replace(/[^0-9.]/g, "");

    // prevent more than one decimal point
    const valid =
      numeric.split(".").length > 2 ? numeric.slice(0, -1) : numeric;

    setQty(valid);

    if (Number(valid) > Number(data?.remaining_qty)) {
      setError(
        `⚠ Quantity cannot exceed remaining (${
          data?.remaining_qty
            ? parseFloat(data.remaining_qty).toFixed(2)
            : "0.00"
        })`
      );
    } else {
      setError("");
    }
  };

  // 📸 Pick Camera
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setSelectedImages((prev) => [...prev, result.assets[0]]);
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
      setSelectedImages((prev) => [...prev, ...result.assets]);
    }
  };

  const pickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });
      console.log("RESULTT ::", result);

      if (!result.canceled) {
        setSelectedImages((prev) => [
          ...prev,
          {
            uri: result?.assets[0]?.uri,
            name: result?.assets[0].name,
            type: "application/pdf",
          },
        ]);
      }
    } catch (err) {
      console.log("Error picking document:", err);
    }
  };

  const removeImage = (index) =>
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));

  const submitProgress = async () => {
    if (!qty) {
      alert("Please enter Quantity");
      return;
    }
    setSubmitting(true);
    const authToken = await getFromSS("authToken");
    try {
      const fd = new FormData();
      fd.append("boq_entry_id", String(data?.id));
      fd.append("qty", String(qty));
      fd.append("remarks", remarks);

      selectedImages.forEach((img, idx) => {
        const uri =
          Platform.OS === "ios" ? img.uri.replace("file://", "") : img.uri;
        fd.append("media[]", {
          uri,
          name: img.fileName || `photo_${Date.now()}_${idx}.jpg`,
          type: img.type || "image/jpeg",
        });
      });

      console.log("BOQ FORMDATTA ::", fd);

      const resp = await saveBOQProgress(authToken, fd, (progressEvent) => {
        console.log("PROGRESSSS EVNETSS ::", progressEvent);
        if (progressEvent.total) {
          setUploadProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
        }
      });

      console.log("RESSS ::", resp);

      // --- Handle Success ---
      if (resp?.status) {
        const newSaved = {
          id: resp?.data?.id || Date.now(),
          sub_package_project_id:
            resp?.data?.sub_package_project_id || data?.sub_package_project_id,
          boq_entry_id: resp?.data?.boq_entry_id || data?.id,
          qty: resp?.data?.qty || qty,
          amount: resp?.data?.amount || "0",
          progress_submitted_date:
            resp?.data?.progress_submitted_date || new Date().toISOString(),
          media_files:
            resp?.data?.media_files ||
            selectedImages.map((a) => ({
              path: a.uri,
              type: a.type,
              meta_data: { name: a.fileName || "Uploaded File" },
            })),
        };

        setOldEntries((prev) => [newSaved, ...prev]);

        Alert.alert(
          "Success",
          resp?.message || "Progress uploaded successfully"
        );
        setQty("");
        setRemarks("");
        setSelectedImages([]);
      } else {
        Alert.alert("Upload failed", resp?.message || "Please try again");
      }
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const renderOld = ({ item }) => (
    <View style={styles.progressRow}>
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: "Jost-SemiBold" }}>
          {item.progress_submitted_date?.split("T")[0]}
        </Text>
        <Text style={{ fontFamily: "Jost-Medium" }}>
          Qty: {item.qty} Amount: {item.amount}
        </Text>
      </View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          setIsVisible(true), setViewImages(item?.media_files);
        }}
        style={{ width: 80 }}
      >
        {item.media_files && item.media_files.length > 0 ? (
          <Image
            source={{
              uri:
                `https://uprepare-storage-2026.s3.ap-south-1.amazonaws.com/${item?.media_files[0]?.path}` ||
                `https://uprepare-storage-2026.s3.ap-south-1.amazonaws.com/${item?.media_files[0]}`,
            }}
            style={{ width: 72, height: 48, borderRadius: 4 }}
          />
        ) : (
          <Text style={{ fontSize: 12 }}>No media</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const handleRefresh = () => {
    setRefresh(true);
    if (data?.id) {
      //   load();
    }
    setTimeout(() => setRefresh(false), 1000);
  };

  const imagesUrl = viewImages?.map((image) => ({
    uri: `https://uprepare-storage-2026.s3.ap-south-1.amazonaws.com/${image?.path}`,
  }));

  console.log("Image Url :;", imagesUrl);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomHeader Title={"BOQ Progress"} GoBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ padding: "5%", paddingVertical: "5%" }}>
          <Text
            style={styles.header}
            numberOfLines={expandedTitle ? undefined : 2}
          >
            {data?.sl_no} — {data?.item_description}
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

          {/* Two-column info layout */}
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.iconRow}>
                <Entypo name="ruler" size={15} color="#4CAF50" />
                <Text style={styles.label}>Unit:</Text>
                <Text style={styles.value}>{data?.unit || "N/A"}</Text>
              </View>
              <View style={styles.iconRow}>
                <Feather name="package" size={15} color="#2196F3" />
                <Text style={styles.label}>Quantity:</Text>
                <Text style={styles.value}>
                  {data?.qty ? parseFloat(data.qty).toFixed(2) : "0.00"}
                </Text>
              </View>
              <View style={styles.iconRow}>
                <MaterialIcons name="attach-money" size={20} color="#FF9800" />
                <Text style={styles.label}>Rate:</Text>
                <Text style={styles.value}>
                  {data?.rate ? parseFloat(data.rate).toFixed(2) : "0.00"}
                </Text>
              </View>
            </View>

            <View style={styles.col}>
              <View style={styles.iconRow}>
                <MaterialIcons
                  name="monetization-on"
                  size={20}
                  color="#9C27B0"
                />
                <Text style={styles.label}>Amount:</Text>
                <Text style={styles.value}>
                  {data?.amount ? parseFloat(data.amount).toFixed(2) : "0.00"}
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Feather name="trending-up" size={15} color="#F44336" />
                <Text style={styles.label}>Remaining:</Text>
                <Text style={styles.value}>
                  {data?.remaining_qty
                    ? parseFloat(data.remaining_qty).toFixed(2)
                    : "0.00"}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // justifyContent: "space-around",
              marginTop: "3%",
              marginBottom: "1%",
            }}
          >
            <Text
              style={{
                fontFamily: "Jost-SemiBold",
                // marginTop: 8,
                marginRight: 8,
              }}
            >
              Add Progress
            </Text>
            <Text style={{ marginBottom: 0, fontFamily: "Jost-Medium" }}>
              (Remaining:{" "}
              {data?.remaining_qty
                ? parseFloat(data.remaining_qty).toFixed(2)
                : "0.00"}
              )
            </Text>
          </View>
          <TextInput
            placeholder="Qty"
            value={qty}
            onChangeText={handleQtyChange}
            keyboardType="numeric"
            style={styles.input}
            maxLength={10}
            placeholderTextColor={"#555"}
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TextInput
            placeholder="Remarks"
            value={remarks}
            onChangeText={setRemarks}
            style={[styles.input, { height: 80, marginTop: "4%" }]}
            multiline
            placeholderTextColor={"#555"}
          />
          <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
            <TouchableOpacity onPress={pickFromCamera} style={styles.btn}>
              <Text style={styles.btnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickFromGallery} style={styles.btn}>
              <Text style={styles.btnText}>🖼️ Gallery</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.btn} onPress={pickFromFiles}>
            <Text style={styles.btnText}>📄 PDF</Text>
          </TouchableOpacity> */}
          </View>
          {selectedImages?.length > 0 && (
            <ScrollView
              horizontal
              style={{
                marginTop: "2%",
                paddingVertical: "5%",
              }}
            >
              {selectedImages?.map((file, i) => (
                <View key={i} style={styles.filePreview}>
                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(i)}
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

          <TouchableOpacity
            onPress={submitProgress}
            style={[styles.submitBtn, submitting && { opacity: 0.7 }]}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700" }}>
                {uploadProgress
                  ? `Uploading ${uploadProgress}%`
                  : "Submit Progress"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : (
          <View style={{ flex: 1 }}>
            <View
              style={{
                backgroundColor: "#16A14A",
                paddingHorizontal: "4%",
                paddingVertical: "2%",
                borderColor: "#ccc",
                borderWidth: 1,
                //   marginVertical: "2%",
                borderRadius: 8,
              }}
            >
              <Text style={{ fontFamily: "Jost-SemiBold", color: "#fff" }}>
                Physical Progress History
              </Text>
            </View>

            {/* <FlatList
            data={oldEntries}
            keyExtractor={(i) => String(i.id)}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
            }
            renderItem={renderOld}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
            contentContainerStyle={{
              paddingBottom: 20,
              marginVertical: "2%",
              backgroundColor: "#fff",
            }}
            ListEmptyComponent={
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                  height: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Jost-Medium",
                    fontSize: 20,
                    color: "#000",
                    opacity: 0.2,
                  }}
                >
                  No found !
                </Text>
              </View>
            }
          /> */}
            {oldEntries?.length > 0 ? (
              oldEntries?.map((item, index) => (
                <View key={String(item.id || index)}>
                  {renderOld({ item })}

                  {/* Separator */}
                  {index !== oldEntries.length - 1 && (
                    <View style={{ height: 2 }} />
                  )}
                </View>
              ))
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 100,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Jost-Medium",
                    fontSize: 20,
                    color: "#000",
                    opacity: 0.2,
                  }}
                >
                  No found !
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {isVisible && (
        <ImageView
          images={imagesUrl}
          // imageIndex={selectedImageIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          // FooterComponent={(index) => (
          //   <View
          //     key={index}
          //     style={{
          //       width: width,
          //       height: height * 0.15,
          //       // backgroundColor: "red",
          //       backgroundColor: "rgba(255,255,255,0.4 )",
          //       flexDirection: "row",
          //       alignItems: "center",
          //       padding: "2%",
          //     }}
          //   >

          //     <View style={{ marginLeft: "5%" }}>

          //     </View>
          //   </View>
          // )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { fontSize: 16, fontFamily: "Jost-SemiBold", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    // marginBottom: 8,
    backgroundColor: "#fff",
    fontFamily: "Jost-Medium",
  },
  btn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    flex: 0.48,
    alignItems: "center",
  },
  btnText: { fontWeight: "600" },
  submitBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "5%",
  },
  progressRow: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
    elevation: 1,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
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
  errorText: {
    // marginTop: 4,
    color: "red",
    fontFamily: "Jost-Medium",
    fontSize: 13,
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
