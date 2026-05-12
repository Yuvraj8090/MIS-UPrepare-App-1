import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { height, width } from "../../../services/helper";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import {
  fetchLocationData,
  fetchMilestoneImage,
  uploadMilestoneImage,
} from "../../../services/api/fetch";
import { getFromSS } from "../../../services/storage/SecureStore";
import BottomButton from "../../../components/Button/BottomButton";
import ImageViewer from "@/components/ImageView";
import { SafeAreaView } from "react-native-safe-area-context";

import NetInfo from "@react-native-community/netinfo";
import UploadProgress from "../../../components/UploadProgress";
import axios from "axios";
import { saveSqlMilestonePhyicalImage } from "@/services/database/database";
import { showFeedback } from "@/services/platform/feedback";
import { colors } from "@/constants/theme";


const PhotoGallery = (props) => {
  const { mppr_id } = props?.route?.params;

  const NetConnected = NetInfo.useNetInfo();

  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState(new Date());

  const [showLoad, setShowLoad] = useState(false);
  const [load, setLoad] = useState(true);
  const [address, setAddress] = useState([]);
  const [saveLocally, setSaveLocally] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Location permission is required to tag the captured photo.");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    FetchImages();
  }, [mppr_id, showLoad]);

  const FetchImages = async () => {
    const authToken = await getFromSS("authToken");

    var formData = {
      mppr_id: mppr_id,
    };

    try {
      const res = await fetchMilestoneImage(formData, authToken);

      if (res?.data?.ok) setImages(res?.data?.images);
    } catch (error) {
      console.log("Milestone image fetch error ::", error);
    } finally {
      setLoad(false);
    }
  };

  const fetchLocation = async () => {
    var formData = {
      latitude: location?.coords?.latitude,
      longitude: location?.coords?.longitude,
    };

    try {
      const res = await fetchLocationData(formData);

      if (res?.data) {
        setAddress(res?.data?.features[0].properties);
      } else {
        showFeedback(res?.data?.msg);
      }
    } catch (error) {
      console.log("Location lookup error ::", error);
    }
  };

  const takePhoto = async () => {
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    let mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.granted && mediaLibraryPermission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
        exif: true,
        cameraType: ImagePicker.CameraType.back,
      });

      if (!result.canceled) {
        try {
          setSelectedImage(result.assets[0].uri);
          fetchLocation();
        } catch (error) {
          console.log("Captured image save error:", error);
          Alert.alert("Failed to save the captured image.");
        }
      }
    } else {
      showFeedback("Permissions not granted to access camera or media library.");
    }
  };

  const [source, setSource] = useState(null);

  const handleSubmit = async () => {
    setShowLoad(true);
    const authToken = await getFromSS("authToken");
    const source = axios.CancelToken.source();
    setSource(source);

    var formData = new FormData();

    formData.append("mppr_id", mppr_id);

    let phyImage = selectedImage.split("/");
    let phyImageName = phyImage[phyImage.length - 1];

    formData.append("image", {
      uri: selectedImage,
      name: phyImageName,
      type: "image/png",
      fileName: phyImageName,
    });

    const AuthStr = "Bearer ".concat(authToken);

    const config = {
      headers: {
        Authorization: AuthStr,
        "Content-Type": "multipart/form-data",
      },
      cancelToken: source.token,

      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setProgress(percentCompleted);
      },
    };

    try {
      if (NetConnected?.isConnected) {
        const res = await uploadMilestoneImage(formData, config);
        if (res?.data?.ok) {
          showFeedback("Photo Uploaded Successfully!");
          setShowLoad(false);
        } else {
          showFeedback(res?.data?.msg);
        }
      } else {
        const storeSql = {
          mppr_id: mppr_id,
          imageUri: selectedImage,
        };
        const res = await saveSqlMilestonePhyicalImage(storeSql);
        if (res?.changes) {
          showFeedback(
            "Save images locally; they'll upload automatically when you're online."
          );
          setSaveLocally(true);
        }
      }
    } catch (error) {
      console.log("Milestone image upload error:", error);
    } finally {
      setTimeout(() => {
        setShowLoad(false);
        handleRefresh();
      }, 2000);
    }
  };

  const handleRefresh = () => {
    setSelectedImage(null);
    FetchImages();
  };

  return (
    <SafeAreaView style={styles.mainContainer} edges={["bottom"]}>
      <CustomHeader Title={"Milestone Photos"} GoBack={true} />

      <View style={styles.container}>
        <View>
          {selectedImage ? (
            <View style={styles.imageContainer}>
                <TouchableOpacity
                  onPress={handleRefresh}
                  activeOpacity={0.85}
                  style={styles.dismissButton}
                >
                  <Ionicons name="close" size={24} color="black" />
                </TouchableOpacity>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View style={styles.imageMetaOverlay}>
                  <Text style={styles.imageMetaText}>
                    {address?.formatted}
                  </Text>

                  <Text style={styles.imageMetaText}>
                    latitude: {address?.lat} Longitude: {address?.lon}
                  </Text>

                  <Text style={styles.imageMetaText}>
                    {time.toDateString()}
                  </Text>
                </View>
              </View>
          ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={takePhoto}
                style={styles.captureCard}
              >
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={50}
                  color={colors.primary}
                />
                <Text style={styles.captureTitle}>Add Images</Text>
                <Text style={styles.captureSubtitle}>
                  Capture a geotagged milestone photo before uploading it.
                </Text>
              </TouchableOpacity>
          )}

          <View style={styles.divider} />
          <ImageViewer
            Title={"Project Uploaded Images"}
            images={images}
            setImages={setImages}
            FetchImages={FetchImages}
            load={load}
            setLoad={setLoad}
          />
        </View>
      </View>

      <BottomButton
        onPress={handleSubmit}
        Title={"Upload Image"}
        active={selectedImage}
      />
      <UploadProgress
        show={showLoad}
        progress={progress}
        text={"Uploading..."}
        source={source}
        setShow={setShowLoad}
        saveLocally={saveLocally}
      />
    </SafeAreaView>
  );
};

export default PhotoGallery;
