import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ToastAndroid,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "./styles";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import * as Location from "expo-location";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { height, width } from "../../../services/helper";
import CustomHeader from "../../../components/AppHeader/CustomHeader";
import {
  fetchLocationData,
  fetchMilestoneImage,
  uploadMilestoneImage,
} from "../../../services/api/fetch";
import ImageView from "react-native-image-viewing";
import { getFromSS } from "../../../services/storage/SecureStore";
import LoaderCard from "../../../components/LoaderCard";
import BottomButton from "../../../components/Button/BottomButton";
import ImageViewer from "@/components/ImageView";

import NetInfo from "@react-native-community/netinfo";
import { storeImage } from "@/services/storage/AsyncStorage";
import UploadProgress from "../../../components/UploadProgress";
import axios from "axios";
import { saveSqlMilestonePhyicalImage } from "@/services/database/database";

const dummyImages = [
  {
    id: 1,
    file: "https://picsum.photos/400/300?random=1",
    location: "Clock Tower, Dehradun",
    latitude: 30.25578554554,
    longitude: 45.25554545454,
    time: "2024-04-10T12:13:15.000000Z",
  },
  {
    id: 2,
    file: "https://picsum.photos/400/300?random=2",
    location: "India Gate, Delhi",
    latitude: 28.612912,
    longitude: 77.229509,
    time: "2024-04-12T14:45:10.000000Z",
  },
  {
    id: 3,
    file: "https://picsum.photos/400/300?random=3",
    location: "Marine Drive, Mumbai",
    latitude: 18.9432,
    longitude: 72.8238,
    time: "2024-04-15T09:20:05.000000Z",
  },
  {
    id: 4,
    file: "https://picsum.photos/400/300?random=4",
    location: "Charminar, Hyderabad",
    latitude: 17.3616,
    longitude: 78.4747,
    time: "2024-04-20T17:55:45.000000Z",
  },
  {
    id: 5,
    file: "https://picsum.photos/400/300?random=5",
    location: "Howrah Bridge, Kolkata",
    latitude: 22.5850,
    longitude: 88.3468,
    time: "2024-04-22T19:30:00.000000Z",
  },
];


const PhotoGallery = (props) => {
  const { mppr_id } = props?.route?.params;
  // console.log("MPPR ID ::", mppr_id);

  const NetConnected = NetInfo.useNetInfo();

  const [progress, setProgress] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [location, setLocation] = useState(null);
  const [time, setTime] = useState(new Date());
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 30.3165, // Dehradun latitude
    longitude: 78.0322, // Dehradun longitude
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  const [showLoad, setShowLoad] = useState(false);
  const [load, setLoad] = useState(true);
  const [address, setAddress] = useState([]);
  const [saveLocally, setSaveLocally] = useState(false);
  const maxImageWidth = 1920;
  const aspectRatio = [4, 3];

  // console.log("SELECTTED IAMGEE ::", selectedImage);
  // console.log("Location  ::", location);
  // console.log("IMAGESSS  ::", images);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
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
      console.log("ERROR ::", error);
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
      // console.log("RESSSS ::", res?.data?.features);
      // console.log("RESSSS ::", res?.data?.features[0].properties);

      if (res?.data) {
        // ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
        setAddress(res?.data?.features[0].properties);
      } else {
        ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
      }
    } catch (error) {
      console.log("Error ::", error);
    }
  };

  const takePhoto = async () => {
    let cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    let mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (cameraPermission.granted && mediaLibraryPermission.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: [ImagePicker.MediaType.image],
        // mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        // aspect: [4, 3],
        quality: 0.8,
        exif: true, // Enable EXIF data
        cameraType:ImagePicker.CameraType.back
      });

      if (!result.cancelled) {
        // console.log("Captured Image Result:", result?.assets[0]?.uri);
        // console.log("Captured Image Result:", result);
        // console.log("Location Data:", location);

        // const { width, height } = result?.assets[0];

        // // Calculate the new dimensions while maintaining aspect ratio
        // let newWidth, newHeight;
        // if (width > maxImageWidth) {
        //   newWidth = maxImageWidth;
        //   newHeight = Math.round(maxImageWidth * (height / width));
        // } else {
        //   newWidth = width;
        //   newHeight = height;
        // }

        // console.log("Width :::", newWidth);
        // console.log("Height :::", newHeight);

        // // Resize the image using ImageManipulator
        // const resizedImage = await ImageManipulator.manipulateAsync(
        //   result?.assets[0]?.uri,
        //   [{ resize: { width: newWidth, height: newHeight } }],
        //   { compress: 0.8, format: ImageManipulator.SaveFormat.PNG }
        // );

        // // resizedImage.uri now contains the URI of the resized image
        // console.log("RESIZEEEE :::", resizedImage);

        try {
          setSelectedImage(result.assets[0].uri);
          // setSelectedImage(resizedImage?.uri);
          fetchLocation();
        } catch (error) {
          console.log("Error saving image:", error);
          alert("Failed to save image.");
        }
      }
    } else {
      ToastAndroid.show(
        "Permissions not granted to access camera or media library.",
        ToastAndroid.LONG
      );
    }
  };

  const [source, setSource] = useState(null);
  // console.log("SOURCCEE ::", source);

  const handleSubmit = async () => {
    setShowLoad(true);
    const authToken = await getFromSS("authToken");
    const source = axios.CancelToken.source();
    setSource(source);

    var formData = new FormData();
    var localStore = {
      mppr_id: mppr_id,
      image: selectedImage,
    };

    formData.append("mppr_id", mppr_id);

    let phyImage = selectedImage.split("/");
    let phyImageName = phyImage[phyImage.length - 1];

    formData.append("image", {
      uri: selectedImage,
      name: phyImageName,
      type: "image/png",
      fileName: phyImageName,
    });

    console.log("FORMDATAAA :::", formData);

    const AuthStr = "Bearer ".concat(authToken);

    const config = {
      headers: {
        Authorization: AuthStr,
        "Content-Type": "multipart/form-data",
      },
      // onprogress: (progress) => {
      //   console.log("PROGRESS :::", progress);
      //   setProgress(progress);
      // },
      cancelToken: source.token,

      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
        setProgress(percentCompleted);
      },
    };

    try {
      if (NetConnected?.isConnected) {
        const res = await uploadMilestoneImage(formData, config);
        if (res?.data?.ok) {
          ToastAndroid.show("Photo Uploaded Successfully!", ToastAndroid.LONG);
          setShowLoad(false);
        } else {
          ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
        }
      } else {
        const storeSql = {
          mppr_id: mppr_id,
          imageUri: selectedImage,
        };
        const res = await saveSqlMilestonePhyicalImage(storeSql);
        console.log("SQL IMAGEE RESSS ::", res);
        if (res?.changes) {
          ToastAndroid.show(
            "Save images locally; they'll upload automatically when you're online.",
            ToastAndroid.LONG
          );
          setSaveLocally(true);
        }

        // await storeImage("Images", localStore);
        // ToastAndroid.show(
        //   "You Have No Internet Connectivity So You Can't Upload Image Now!",
        //   ToastAndroid.LONG
        // );
      }
    } catch (error) {
      console.log("Error uploading image:", error);
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
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Milestone Photos"} GoBack={true} />

      <View style={styles.container}>
        <View>
          {selectedImage ? (
            <>
              <View style={styles.imageContainer}>
                <View
                  onTouchEnd={handleRefresh}
                  style={{
                    backgroundColor: "#fff",
                    position: "absolute",
                    zIndex: 99,
                    right: 8,
                    top: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 20,
                    padding: 6,
                    alignItems: "center",
                    // justifyContent: "center",
                    elevation: 5,
                  }}
                >
                  <Ionicons name="close" size={24} color="black" />
                </View>
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.image}
                  resizeMode="cover"
                />
                <View
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.3)",
                    position: "absolute",
                    bottom: 0,
                    padding: 10,
                  }}
                >
                  <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                    {address?.formatted}
                  </Text>

                  <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                    latitude: {address?.lat} Longitude: {address?.lon}
                  </Text>

                  <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                    {time.toDateString()}
                  </Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={takePhoto}
                style={{
                  alignItems: "center",
                  width: width * 0.5,
                  borderRadius: 10,
                  borderWidth: 0.5,
                  borderColor: "#ccc",
                  elevation: 2,
                  backgroundColor: "#fff",
                  alignSelf: "center",
                  padding: 10,
                  marginVertical: 16,
                }}
              >
                <MaterialCommunityIcons
                  name="camera-plus-outline"
                  size={50}
                  color="#ccc"
                />
                <View>
                  <Text
                    style={{
                      fontFamily: "Jost-Medium",
                      fontSize: 18,
                    }}
                  >
                    Add Images
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}

          <View
            style={{ width: width, height: 0.5, backgroundColor: "#ccc" }}
          />
          <ImageViewer
            Title={"Project Uploaded Images"}
            images={dummyImages}
            // images={images}
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
      {/* <LoaderCard show={showLoad} text={"Uploading..."} /> */}
      <UploadProgress
        show={showLoad}
        progress={progress}
        text={"Uploading..."}
        source={source}
        setShow={setShowLoad}
        saveLocally={saveLocally}
      />
    </View>
  );
};

export default PhotoGallery;
