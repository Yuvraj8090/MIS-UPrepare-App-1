import React, { useEffect, useState } from "react";
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
  fetchECPActivityStages,
  saveECPPhycialProgressImage,
} from "@/services/api/fetch";
import SelectDropdown from "react-native-select-dropdown";
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { width } from "@/services/helper";
import { showFeedback } from "@/services/platform/feedback";

const EPCPhysicalProgressForm = (props) => {
  console.log("PORPSPPSPSPSP ::", props?.route?.params);
  const { data, remainProgress } = props?.route?.params;
  const navigation = useNavigation();

  const [stage, setStage] = useState("");
  const [date, setDate] = useState(new Date());
  const [progress, setProgress] = useState("");
  const [items, setItems] = useState("");
  const [images, setImages] = useState([]);
  const [showLCard, setShowLCard] = useState(false);

  const [activity, setAcitvity] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(false);

  // 🔹 API call
  const getActivity = async (id) => {
    const authToken = await getFromSS("authToken");

    setLoad(true);
    try {
      const res = await fetchECPActivityStages(authToken, id);
      //   console.log("RESS ::", res);

      setAcitvity(res?.data || []);
      setLoad(false);
    } catch (error) {
      console.log("GET API ERROR ::", error);
      setLoad(false);
    }
  };

  // 🔹 Load default data when screen opens
  useEffect(() => {
    if (data?.id) {
      getActivity(data?.id);
    }
  }, [data?.id]);

  // 📸 Pick from Camera
  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

  // 🖼️ Pick from Gallery
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

  // ✅ Submit
  const handleSubmit = async () => {
    // if (!progress || !date) {
    //   Platform.OS === "android"
    //     ? ToastAndroid.show("Please fill required fields", ToastAndroid.SHORT)
    //     : Alert.alert("Please fill required fields");
    //   return;
    // }
    if (!stage) {
      Alert.alert("Stage is required");
      return;
    }

    if (!images || images.length === 0) {
      Alert.alert("Image is required");
      return;
    }
    setShowLCard(true);
    const authToken = await getFromSS("authToken");

    const formData = new FormData();
    formData.append("epcentry_data_id", stage?.id);
    // formData.append("progress", progress);
    formData.append("remarks", items);
    // formData.append("date", date);

    // images.forEach((img, index) => {
    //   formData.append("images[]", {
    //     uri: img.uri,
    //     type: "image/jpeg",
    //     name: `photo_${index}.jpg`,
    //   });
    // });

    let localUri = images[0]?.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append("images[]", {
      uri: localUri,
      name: filename,
      type,
    });

    console.log("FORMDATA PROHERSTS ::", JSON.stringify(formData));

    try {
      const res = await saveECPPhycialProgressImage(authToken, formData);
      console.log("RESS UDPALED IMAHESS ::", res);
      if (res?.status) {
        Platform.OS === "ios" ? Alert.alert(res?.message) : showFeedback(res?.message);
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      } else {
        Platform.OS === "ios" ? Alert.alert(res?.message) : showFeedback(res?.message);
      }
      setShowLCard(false);
    } catch (error) {
      console.log("Error ::", error);
      setShowLCard(false);
    } finally {
      setShowLCard(false);
    }
  };

  // ♻️ Reset
  const handleReset = () => {
    setDate(new Date());
    setProgress("");
    setItems("");
    setImages([]);
  };

  return (
    <View style={styles.mainConatiner}>
      <CustomHeader Title={"Add Physical EPC Progress"} GoBack={true} />

      <ScrollView style={{ margin: 8 }}>
        {/* <Text style={styles.headerTitle}>
          Update Progress for Milestone: {data?.milestone?.name}
        </Text> */}

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

          {/* Activity */}
          <Text style={styles.label}>Activity Name & Stage</Text>
          <SelectDropdown
            data={activity}
            defaultValue="Select Activity & Stage"
            onSelect={(selectedItem) => setStage(selectedItem)}
            renderDropdownIcon={(isOpened) => (
              <AntDesign
                name={isOpened ? "up" : "down"}
                size={14}
                color="#000"
              />
            )}
            renderButton={(selectedItem, isOpened) => {
              return (
                <View style={styles.dropdownBtn}>
                  <Text style={styles.dropdownBtnText} numberOfLines={1}>
                    {selectedItem
                      ? `${selectedItem?.activity_name} - ${selectedItem?.stage_name} `
                      : "Select Activity & Stage"}
                  </Text>
                  <MaterialCommunityIcons
                    name={isOpened ? "chevron-up" : "chevron-down"}
                    size={15}
                  />
                </View>
              );
            }}
            renderItem={(item, index, isSelected) => {
              return (
                <View
                  style={{
                    ...styles.dropdownMenu,
                    ...(isSelected && { backgroundColor: "#D2D9DF" }),
                  }}
                >
                  <Text style={styles.dropdownItemTxtStyle}>
                    {item?.activity_name} - {item?.stage_name}
                  </Text>
                </View>
              );
            }}
            dropdownIconPosition={"right"}
            dropdownStyle={styles.dropdownMenu} // 👈 added
          />

          {/* Progress */}
          {/* <View style={styles.rowBetween}>
            <Text style={styles.label}>Progress (%)</Text>
            <Text style={[styles.label, { color: "green" }]}>
              Remaining: {remainProgress}%
            </Text>
          </View>
          <TextField
            placeholder="Enter percent"
            value={progress}
            setData={setProgress}
            number={3}
          /> */}

          {/* Items */}
          <Text style={styles.label}>Items</Text>
          <TextField
            placeholder="Enter items description"
            value={items}
            setData={setItems}
            multiline
            numberOfLines={3}
          />

          {/* Date */}
          {/* <Text style={styles.label}>Progress Submitted Date</Text>
          <CalenderField
            placeholder="dd/mm/yyyy"
            setCDate={setDate}
            Cdate={date}
          /> */}

          {/* Images */}
          <Text style={styles.label}>Upload Images</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromCamera}>
              <Text style={styles.fileBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromGallery}>
              <Text style={styles.fileBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Preview */}
          {images.length > 0 && (
            <ScrollView horizontal style={{ marginTop: 8 }}>
              {images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img.uri }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                />
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
              <Text style={styles.btnText}>Save Progress</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <LoaderCard visible={showLCard} message={"Updating Progress..."} />
    </View>
  );
};

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 10,
    elevation: 2,
    // width: width * 0.85,
    alignSelf: "center",
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 4,
  },
  readonlyBox: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  fileBtn: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
    flex: 0.48,
    alignItems: "center",
  },
  fileBtnText: {
    fontSize: 13,
    color: "#333",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 0.48,
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.8,
    height: 40,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 2,
    zIndex: 1000,
  },
  dropdownBtnText: {
    fontSize: 14,
    color: "#000",
    textAlign: "left",
    fontFamily: "Jost-Medium",
  },
  dropdownMenu: {
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "#fff",
    zIndex: 2000,
    padding: 6,
  },
  dropdownItemTxtStyle: {
    padding: 10,
    fontSize: 13,
    marginVertical: 2,
    fontFamily: "Jost-Medium",
  },
});

export default EPCPhysicalProgressForm;
