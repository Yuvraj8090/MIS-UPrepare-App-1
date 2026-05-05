import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import styles from "./styles";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import DropDown from "@/components/DropDown";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchMilestoneImagesByPID, fetchProjects } from "@/services/api/fetch";
import { width } from "@/services/helper";
import ImageViewer from "../../components/ImageView";
import { FontAwesome } from "@expo/vector-icons";

const ProjectImages = () => {
  const [projectData, setProjectData] = React.useState([]);
  const [imageData, setImageData] = React.useState([]);
  const [projectSelect, setProjectSelect] = React.useState("");
  const [load, setLoad] = React.useState(false);
  const [imageLoad, setImageLoad] = useState(false);

  const [images, setImages] = useState([]);

  React.useEffect(() => {
    getProjectsData();
  }, []);

  const getProjectsData = async () => {
    const authToken = await getFromSS("authToken");

    try {
      const res = await fetchProjects(authToken);
      //   console.log("RESSSS  ::", res?.data);
      if (res?.data) {
        setProjectData(res?.data?.projects);
      }
    } catch (error) {
      console.log("error ::", error);
    }
  };

  useEffect(() => {
    if (projectSelect) fetchImage();
  }, [projectSelect]);

  const fetchImage = async () => {
    setImageLoad(true);
    setImages([]);
    const authToken = await getFromSS("authToken");
    const formData = {
      project_id: projectSelect,
    };

    try {
      const res = await fetchMilestoneImagesByPID(formData, authToken);
      if (res?.data) {
        setImages(res?.data?.images);
      }
    } catch (error) {
      console.log("Error fetching images:", error);
    } finally {
      setImageLoad(false);
    }
  };

  // const extractImages = (data) => {
  //   let extractedImages = [];

  //   data?.milestones?.forEach((milestone) => {
  //     milestone?.values?.forEach((value) => {
  //       value?.media?.forEach((media) => {
  //         extractedImages.push({
  //           id: media?.id,
  //           name: media?.name,
  //           file: `https://uprepdisaster.com/images/milestone/site/${media?.name}`,
  //           created_at: media?.created_at,
  //           updated_at: media?.updated_at,
  //         });
  //       });
  //     });
  //   });
  //   // console.log("EXTTARACCT ::", extractedImages);
  //   setImages(extractedImages);
  // };

  return (
    <View style={styles.mainContainer}>
      <CustomHeader Title={"Project Images"} />

      {load ? (
        <>
          <ActivityIndicator size="small" color="#000" />
        </>
      ) : (
        <>
          <View style={styles.container}>
            <DropDown data={projectData} setSelect={setProjectSelect} />
            <>
              {projectSelect ? (
                <ImageViewer
                  Title={"Project Uploaded Images"}
                  images={images}
                  setImages={setImages}
                  FetchImages={fetchImage}
                  load={imageLoad}
                  setLoad={setImageLoad}
                />
              ) : (
                <>
                  <View
                    style={{
                      alignItems: "center",
                      alignSelf: "center",
                      marginTop: "20%",
                    }}
                  >
                    <FontAwesome name="image" size={200} color="#ccc" />
                    <Text
                      style={{
                        fontFamily: "Jost-Medium",
                        fontSize: 25,
                        color: "#ccc",
                      }}
                    >
                      Project Images
                    </Text>
                  </View>
                </>
              )}
            </>
          </View>
        </>
      )}
    </View>
  );
};

export default ProjectImages;
