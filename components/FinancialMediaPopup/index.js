import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { width } from "@/services/helper";

const { height } = Dimensions.get("window");

const FinancialMediaPopUp = ({ data, visible, setVisible }) => {
  if (!data?.media_files?.length) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const mediaList = data.media_files.map((file) => {
    const mime =
      file?.type?.toLowerCase() || file?.meta_data?.mime?.toLowerCase() || "";
    const isPdf = mime.includes("pdf");
    const isImage = mime.startsWith("image/");
    const url = `https://u-prepare.com/storage/app/public/${file.path}`;
    return { file, isPdf, isImage, url };
  });

  console.log("MEDIAA LISTT :", mediaList);

  const currentFile = mediaList[currentIndex];
  const totalFiles = mediaList.length;

  // Filter only images for image viewer
  const imageUrls = mediaList
    .filter((f) => f.isImage)
    .map((f) => ({ uri: f.url }));

  console.log("Image URLs for viewer =>", imageUrls);

  const openImageViewer = (index) => {
    setCurrentIndex(index);
    setImageViewerVisible(true);
    // setVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        isVisible={visible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0.6}
        onBackdropPress={() => setVisible(false)}
        style={{ margin: 0, justifyContent: "center" }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 15,
            padding: 15,
            marginHorizontal: 10,
            maxHeight: height * 0.9,
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Attached Media</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Text style={styles.closeBtn}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* File Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Amount: ₹{Number(data.finance_amount).toLocaleString()}
            </Text>
            <Text style={styles.infoText}>Bill No: {data.bill_serial_no}</Text>
            <Text style={styles.infoText}>
              Size: {(currentFile?.file?.meta_data?.size / 1024).toFixed(1)} KB
            </Text>
            <Text style={styles.infoText}>
              Uploaded:
              {new Date(
                currentFile?.file?.meta_data?.uploaded_at
              ).toLocaleDateString()}
            </Text>
          </View>

          {/* Media Viewer */}
          <View
            style={{
              width: "100%",
              // height: height * 0.55,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
            }}
          >
            {currentFile.isImage && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL(currentFile.url)}
                // onPress={() =>
                //   openImageViewer(
                //     mediaList
                //       .filter((m) => m.isImage)
                //       .findIndex((m) => m.url === currentFile.url)
                //   )
                // }
              >
                <Image
                  source={{ uri: currentFile.url }}
                  style={{
                    width: width * 0.5,
                    height: 200,
                    borderRadius: 10,
                    marginVertical: "4%",
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}

            {currentFile.isPdf && (
              <TouchableOpacity
                onPress={() => Linking.openURL(currentFile.url)}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: "4%",
                }}
              >
                <Image
                  source={require("@/assets/images/pdf.png")}
                  style={{ width: 100, height: 100, marginBottom: 8 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    fontWeight: "500",
                  }}
                >
                  {currentFile?.file?.meta_data.name}
                </Text>
                <Text style={{ color: "#007bff", marginTop: 5 }}>
                  Tap to open PDF
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {/* Navigation (for multiple files) */}
          {totalFiles > 1 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                disabled={currentIndex === 0}
                onPress={() => setCurrentIndex(currentIndex - 1)}
              >
                <Ionicons
                  name="chevron-back-circle"
                  size={36}
                  color={currentIndex === 0 ? "#ccc" : "#007bff"}
                />
              </TouchableOpacity>

              <Text>
                {currentIndex + 1} / {totalFiles}
              </Text>

              <TouchableOpacity
                disabled={currentIndex === totalFiles - 1}
                onPress={() => setCurrentIndex(currentIndex + 1)}
              >
                <Ionicons
                  name="chevron-forward-circle"
                  size={36}
                  color={currentIndex === totalFiles - 1 ? "#ccc" : "#007bff"}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FinancialMediaPopUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    width: "92%",
    // height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1%",
    marginBottom: 8,
    borderBottomColor: "#ccc",
    borderBottomWidth: 0.8,
  },
  title: { fontSize: 16, fontWeight: "600", flex: 1 },
  closeBtn: { fontSize: 22, color: "red", paddingHorizontal: 10 },
  infoBox: { marginTop: 5 },
  infoText: {
    fontSize: 15,
    color: "#555",
    marginVertical: 2,
    fontFamily: "Jost-SemiBold",
  },
  mediaWrapper: {
    height: "38%",
    // flex: 1,
    // marginTop: 10,
    padding: "2%",
    // backgroundColor: "red",
  },
  pdf: {
    flex: 1,
    width: "100%",
  },
  image: {
    flex: 1,
    width: "100%",
    borderRadius: 8,
  },
});
