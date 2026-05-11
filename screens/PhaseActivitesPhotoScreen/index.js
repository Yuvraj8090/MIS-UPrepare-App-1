import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import ActivitiesPhotos from "../../components/TableComponents/ActivitiesPhotos";
import AddPhotoPopUp from "../../components/AddPhotoPopUp";
import { getFromSS } from "@/services/storage/SecureStore";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import {
  fetchActivitiesImages,
  uploadActivitiesImage,
} from "@/services/api/fetch";
import { useIsFocused } from "@react-navigation/native";
import { saveSqlPhaseActivitiesImage } from "@/services/database/database";
import { showFeedback } from "@/services/platform/feedback";

const PhaseActivitiesPhotoScreen = (props) => {
  // console.log("PORPSSS ::", props?.route?.params);
  const data = props?.route?.params?.data;
  const parentData = props?.route?.params?.parentData;

  // console.log("PHASEEE ::", data?.id);
  // console.log("PARENETTT ::", parentData?.project_id);

  const activity_id = data?.id;
  const project_id = parentData?.project_id;

  const isFocused = useIsFocused();

  const NetConnected = NetInfo.useNetInfo();
  const [load, setLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activitesPhoto, setActivitiesPhoto] = useState([]);

  const [selectedImage, setSelectedImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [source, setSource] = useState(null);
  const [startUpload, setStartUpload] = useState(false);
  const [saveLocally, setSaveLocally] = useState(false);

  useEffect(() => {
    FetchImages();
  }, [data, parentData, isVisible, isFocused]);

  const FetchImages = async () => {
    const authToken = await getFromSS("authToken");

    var formData = {
      project_id: project_id,
      activity_id: activity_id,
    };

    try {
      const res = await fetchActivitiesImages(formData, authToken);
      // console.log("RESSss ::", res?.data);

      if (res?.data?.ok) setActivitiesPhoto(res?.data?.images);
    } catch (error) {
      console.log("ERROR ::", error);
    } finally {
      setLoad(false);
      setRefresh(false);
    }
  };

  const handleRefresh = () => {
    setRefresh(true);
    setSelectedImage(null);
    setIsVisible(false);
    setProgress(0);
    setStartUpload(false);
    FetchImages();
  };

  const handleSubmit = async () => {
    setStartUpload(true);
    const authToken = await getFromSS("authToken");
    const source = axios.CancelToken.source();
    setSource(source);

    var formData = new FormData();

    formData.append("project_id", project_id);
    formData.append("activity_id", activity_id);

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
        console.log(`Upload progress: ${percentCompleted}%`);
        setProgress(percentCompleted);
      },
    };

    try {
      if (NetConnected?.isConnected) {
        const res = await uploadActivitiesImage(formData, config);
        console.log("RESSS ::", res);
        if (res?.data?.ok) {
          showFeedback("Photo Uploaded Successfully!");
          // setIsVisible(false);
        } else {
          showFeedback(res?.data?.msg);
        }
      } else {
        const storeSql = {
          project_id: project_id,
          activities_id: activity_id,
          imageUri: selectedImage,
        };
        const res = await saveSqlPhaseActivitiesImage(storeSql);
        console.log("SQL IMAGEE RESSS ::", res);
        if (res?.changes) {
          showFeedback(
            "Save images locally; they'll upload automatically when you're online."
          );
          setSaveLocally(true);
        }

        // await storeImage("Images", localStore);
        // ToastAndroid.show(
        //   "You Have Internet Connectivity So You Can't Upload Image Now!",
        //   ToastAndroid.LONG
        // );
      }
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setTimeout(() => {
        // setShowLoad(false);
        handleRefresh();
      }, 2000);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Activities Photo Gallery"} GoBack={true} />

      {load ? (
        <>
          <ActivityIndicator size="small" color="#000" />
        </>
      ) : (
        <>
          <ActivitiesPhotos
            Title={`${parentData?.name} | ${data?.name}`}
            handleRefresh={handleRefresh}
            refresh={refresh}
            setVisible={setIsVisible}
            data={activitesPhoto}
          />
        </>
      )}
      <AddPhotoPopUp
        visible={isVisible}
        setVisible={setIsVisible}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        startUpload={startUpload}
        setStartUpload={setStartUpload}
        progress={progress}
        handleSubmit={handleSubmit}
        source={source}
        saveLocally={saveLocally}
      />
    </View>
  );
};

export default PhaseActivitiesPhotoScreen;
