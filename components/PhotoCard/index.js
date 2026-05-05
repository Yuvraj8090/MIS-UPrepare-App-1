import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as Progress from "react-native-progress";
import { NetConnected, width } from "@/services/helper";
import {
  clearMilestonesImages,
  clearPhaseActivitiesImages,
  fetchMilestonePhyicalImages,
  fetchPhasesActivitiesImages,
} from "@/services/database/database";
import { getFromSS } from "@/services/storage/SecureStore";
import {
  uploadActivitiesImage,
  uploadMilestoneImage,
} from "@/services/api/fetch";
import { useAuth } from "@/navigation/AuthContext/AuthContext";
import axios from "axios";

const PhotoCard = ({ navPath }) => {
  const navigation = useNavigation();
  const isInternet = NetConnected();
  const { user } = useAuth();

  console.log("USERR :", user?.username);

  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(0);
  console.log("IMGEE LENGTHH :", images?.length);

  useEffect(() => {
    if (isInternet)
      if (user?.username == "PWD3") {
        fetchPhysicalImageLocal();
      } else {
        fetchLocal();
      }
  }, [isInternet]);

  const fetchLocal = async () => {
    const imagesData = await fetchPhasesActivitiesImages();
    console.log("IMAGEEE DATATA ::", imagesData);
    setImages(imagesData);
    console.log("Phiycalal Imagee");
  };

  const fetchPhysicalImageLocal = async () => {
    console.log("Phiycalal Imagee");
    const imagesData = await fetchMilestonePhyicalImages();
    console.log("IMAGEEE DATATA ::", imagesData);
    setImages(imagesData);
  };

  const handleUpload = async () => {
    setUploading(true);
    const authToken = await getFromSS("authToken");

    for (const [index, item] of images.entries()) {
      const selectedImage = item?.images;
      const source = axios.CancelToken.source();
      const formData = new FormData();

      formData.append("project_id", item?.project_id);
      formData.append("activity_id", item?.activities_id);

      let phyImage = selectedImage.split("/");
      let phyImageName = phyImage[phyImage.length - 1];

      formData.append("image", {
        uri: selectedImage,
        name: phyImageName,
        type: "image/png",
        fileName: phyImageName,
      });

      console.log("FORMDATAAA :::", formData);

      const AuthStr = `Bearer ${authToken}`;
      console.log("AuthTOKENN :::", AuthStr);

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
          console.log(`Upload Activites Image progress: ${percentCompleted}%`);
        },
      };

      try {
        if (isInternet) {
          const res = await uploadActivitiesImage(formData, config);
          console.log("RESSS ::", res);
          if (res?.data?.ok) {
            ToastAndroid.show(
              "Photo Uploaded Successfully!",
              ToastAndroid.LONG
            );
            setProgress(0);
          } else {
            ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
          }
        } else {
          // const storeSql = {
          //   project_id,
          //   activities_id: activity_id,
          //   imageUri: selectedImage,
          // };
          // const res = await saveSqlPhaseActivitiesImage(storeSql);
          // console.log("SQL IMAGEE RESSS ::", res);
          // if (res?.changes) {
          //   ToastAndroid.show(
          //     "Save images locally; they'll upload automatically when you're online.",
          //     ToastAndroid.LONG
          //   );
          // }
        }
      } catch (error) {
        console.log("Error uploading image:", error);
      } finally {
        setUploadIndex(index + 1);
      }
    }
    // Clear the images array once all uploads are complete
    await clearPhaseActivitiesImages();
    setImages([]);
    setUploading(false);
  };

  const handlePhysicalUpload = async () => {
    setUploading(true);
    const authToken = await getFromSS("authToken");

    for (const [index, item] of images.entries()) {
      const selectedImage = item?.images;
      const source = axios.CancelToken.source();
      const formData = new FormData();

      formData.append("mppr_id", item?.mppr_id);

      let phyImage = selectedImage.split("/");
      let phyImageName = phyImage[phyImage.length - 1];

      formData.append("image", {
        uri: selectedImage,
        name: phyImageName,
        type: "image/png",
        fileName: phyImageName,
      });

      console.log("FORMDATAAA :::", formData);

      const AuthStr = `Bearer ${authToken}`;
      console.log("AuthTOKENN :::", AuthStr);

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
          console.log(`Upload Physical Image progress: ${percentCompleted}%`);
        },
      };

      try {
        if (isInternet) {
          const res = await uploadMilestoneImage(formData, config);
          console.log("RESSS ::", res);
          if (res?.data?.ok) {
            ToastAndroid.show(
              "Photo Physical Uploaded Successfully!",
              ToastAndroid.LONG
            );
            setProgress(0);
          } else {
            ToastAndroid.show(res?.data?.msg, ToastAndroid.LONG);
          }
        } else {
          // const storeSql = {
          //   project_id,
          //   activities_id: activity_id,
          //   imageUri: selectedImage,
          // };
          // const res = await saveSqlPhaseActivitiesImage(storeSql);
          // console.log("SQL IMAGEE RESSS ::", res);
          // if (res?.changes) {
          //   ToastAndroid.show(
          //     "Save images locally; they'll upload automatically when you're online.",
          //     ToastAndroid.LONG
          //   );
          // }
        }
      } catch (error) {
        console.log("Error uploading image:", error);
      } finally {
        setUploadIndex(index + 1);
      }
    }

    // Clear the images array once all uploads are complete
    await clearMilestonesImages();
    setImages([]);
    setUploading(false);
  };

  useEffect(() => {
    if (isInternet && images.length > 0) {
      if (user?.username == "PWD3") {
        handlePhysicalUpload();
      } else {
        handleUpload();
      }
    }
  }, [images, isInternet]);

  return (
    <>
      {images?.length > 0 && (
        <View
          style={{
            alignItems: "center",
            paddingVertical: "3%",
            width: width,
            backgroundColor: "#f1f1f1",
          }}
        >
          {uploading ? (
            <View style={{ alignSelf: "center" }}>
              <Progress.Bar
                progress={progress / 100}
                size={20}
                width={width * 0.9}
                color="green"
              />
              <Text style={{ fontFamily: "Jost-Regular", marginTop: "2%" }}>
                Uploading {uploadIndex} of {images?.length} images...
              </Text>
            </View>
          ) : (
            <Text style={{ fontFamily: "Jost-Regular", marginTop: "2%" }}>
              No images for uploading!!
            </Text>
          )}
        </View>
      )}
    </>
  );

  // return (
  //   <>
  //     <TouchableOpacity
  //       style={{ margin: "2%" }}
  //       activeOpacity={0.95}
  //       onPress={() => navigation.navigate(navPath)}
  //     >
  //       <ImageBackground
  //         source={require("../../assets/images/uprepare.jpeg")}
  //         style={styles.mainContainer}
  //       >
  //         <View style={styles.labelView}>
  //           <Text style={styles.labelText}>Project Images</Text>
  //           <Ionicons name="images" size={26} color="black" />
  //         </View>
  //       </ImageBackground>
  //     </TouchableOpacity>
  //   </>
  // );
};

export default PhotoCard;
