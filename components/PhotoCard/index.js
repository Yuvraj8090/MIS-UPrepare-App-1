import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
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
import { showFeedback } from "@/services/platform/feedback";

const PhotoCard = () => {
  const isInternet = NetConnected();
  const { user } = useAuth();

  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadIndex, setUploadIndex] = useState(0);
  const [queueMessage, setQueueMessage] = useState("");

  useEffect(() => {
    if (!user?.username) {
      return;
    }

    if (user?.username == "PWD3") {
      fetchPhysicalImageLocal();
    } else {
      fetchLocal();
    }
  }, [isInternet, user?.username]);

  useEffect(() => {
    if (!user?.username) {
      setQueueMessage("");
      return;
    }

    if (images?.length > 0 && isInternet === false) {
      setQueueMessage(
        `${images.length} photo${images.length > 1 ? "s are" : " is"} queued and will upload automatically when you reconnect.`
      );
      return;
    }

    if (images?.length > 0 && isInternet) {
      setQueueMessage(
        `${images.length} pending photo${images.length > 1 ? "s" : ""} ready for sync.`
      );
      return;
    }

    setQueueMessage("");
  }, [images?.length, isInternet, user?.username]);

  const fetchLocal = async () => {
    const imagesData = await fetchPhasesActivitiesImages();
    setImages(imagesData);
  };

  const fetchPhysicalImageLocal = async () => {
    const imagesData = await fetchMilestonePhyicalImages();
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

      const AuthStr = `Bearer ${authToken}`;

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
          if (res?.data?.ok) {
            showFeedback("Photo Uploaded Successfully!");
            setProgress(0);
          } else {
            showFeedback(res?.data?.msg);
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

      const AuthStr = `Bearer ${authToken}`;

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
          if (res?.data?.ok) {
            showFeedback("Photo Physical Uploaded Successfully!");
            setProgress(0);
          } else {
            showFeedback(res?.data?.msg);
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
    if (isInternet && images.length > 0 && !uploading) {
      if (user?.username == "PWD3") {
        handlePhysicalUpload();
      } else {
        handleUpload();
      }
    }
  }, [images, isInternet, uploading, user?.username]);

  return (
    <>
      {images?.length > 0 && (
        <View style={styles.uploadBanner}>
          {uploading ? (
            <View style={{ alignSelf: "stretch", alignItems: "center" }}>
              <Progress.Bar
                progress={progress / 100}
                size={20}
                width={width * 0.9}
                color="green"
              />
              <Text style={styles.uploadText}>
                Uploading {uploadIndex} of {images?.length} images...
              </Text>
            </View>
          ) : (
            <Text style={styles.uploadText}>
              {queueMessage || "Pending images are ready for sync."}
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
