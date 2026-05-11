import { View, Text, Modal, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons, AntDesign, Feather } from "@expo/vector-icons";
import { width } from "@/services/helper";
import * as Progress from "react-native-progress";

const AddPhotoPopUp = ({
  visible,
  setVisible,
  progress,
  source,
  selectedImage,
  setSelectedImage,
  startUpload,
  setStartUpload,
  handleSubmit,
  saveLocally,
}) => {
  const progr = progress / 100;
  const [cancel, setCancel] = useState(false);

  const takePhoto = async () => {
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    let mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.granted && mediaLibraryPermission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        exif: true, // Enable EXIF data
      });

      if (!result.canceled) {
        // console.log("Captured Image Result:", result?.assets[0]?.uri);

        try {
          setSelectedImage(result.assets[0].uri);
        } catch (error) {
          console.log("Error saving image:", error);
          alert("Failed to save image.");
        }
      }
    } else {
      alert("Permissions not granted to access camera or media library.");
    }
  };

  const cancelUpload = () => {
    setCancel(true);
    source.cancel("Uploading Canceled!!");
    setTimeout(() => {
      setVisible(false);
      setCancel(false);
    }, 2000);
  };

  const handleUpload = () => {
    if (startUpload) cancelUpload();
    else handleSubmit();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide">
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <View>
            <Text style={styles.label}>Upload Photo</Text>
          </View>
          <View
            style={{ position: "absolute", right: 10, top: 8 }}
            onTouchEnd={() => setVisible(false)}
          >
            <AntDesign name="closecircle" size={20} color="black" />
          </View>
          <View>
            {selectedImage ? (
              <>
                <View style={[styles.imageContainer]}>
                  {startUpload && (
                    <>
                      <View style={styles.uploadContainer}>
                        {saveLocally ? (
                          <>
                            <>
                              <View style={{ alignItems: "center" }}>
                                <AntDesign
                                  name="checkcircleo"
                                  size={24}
                                  color="green"
                                />
                                <Text
                                  style={{
                                    fontFamily: "Jost-Medium",
                                    fontSize: 18,
                                    color: "#fff",
                                  }}
                                >
                                  Image Save locally Now!!
                                </Text>
                              </View>
                            </>
                          </>
                        ) : cancel ? (
                          <>
                            <View style={{ alignItems: "center" }}>
                              <AntDesign name="close" size={40} color="red" />
                              <Text
                                style={{
                                  fontFamily: "Jost-Medium",
                                  fontSize: 18,
                                  color: "#fff",
                                }}
                              >
                                Upload canceled!!
                              </Text>
                            </View>
                          </>
                        ) : (
                          <>
                            {progress == 99 ? (
                              <Feather
                                name="check-circle"
                                size={26}
                                color="green"
                              />
                            ) : (
                              <Text
                                style={{
                                  fontFamily: "Jost-Medium",
                                  fontSize: 18,
                                  color: "#fff",
                                }}
                              >
                                {progress} %
                              </Text>
                            )}
                            <View style={{ marginVertical: "1%" }}>
                              <Progress.Bar
                                progress={progr}
                                size={15}
                                color="#ccc"
                              />
                            </View>
                            <Text style={[styles.label, { color: "#fff" }]}>
                              {progress == 99 ? (
                                <>Upload Image Successfully</>
                              ) : (
                                "Uploading..."
                              )}
                            </Text>
                          </>
                        )}
                      </View>
                    </>
                  )}
                  <Image
                    source={{ uri: selectedImage }}
                    style={styles.image}
                    resizeMode="cover"
                  />
                </View>
              </>
            ) : (
              <>
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={takePhoto}
                  style={{
                    alignItems: "center",
                    width: width * 0.3,
                    borderRadius: 10,
                    borderWidth: 0.5,
                    borderColor: "#ccc",
                    elevation: 2,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    padding: "2%",
                    marginVertical: "5%",
                  }}
                >
                  <MaterialCommunityIcons
                    name="camera-plus-outline"
                    size={30}
                    color="#ccc"
                  />
                  <View>
                    <Text
                      style={{
                        fontFamily: "Jost-Medium",
                        fontSize: 16,
                      }}
                    >
                      Add Photo
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={handleUpload}
              style={{
                width: width * 0.5,
                padding: "3%",
                backgroundColor: startUpload
                  ? "red"
                  : selectedImage
                  ? "#000"
                  : "#ccc",
                borderRadius: 10,
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  color: "#fff",
                  fontSize: 18,
                }}
              >
                {startUpload ? "Cancel Uploading" : "Upload"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddPhotoPopUp;
