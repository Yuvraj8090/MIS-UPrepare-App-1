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
import { SafeAreaView } from "react-native-safe-area-context";
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
import { colors, radius, shadows, spacing } from "@/constants/theme";

const EPCPhysicalProgressForm = (props) => {
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

  const getActivity = async (id) => {
    const authToken = await getFromSS("authToken");

    setLoad(true);
    try {
      const res = await fetchECPActivityStages(authToken, id);
      setAcitvity(res?.data || []);
      setLoad(false);
    } catch (error) {
      console.log("EPC activity fetch error ::", error);
      setLoad(false);
    }
  };

  useEffect(() => {
    if (data?.id) {
      getActivity(data?.id);
    }
  }, [data?.id]);

  const pickFromCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0]]);
    }
  };

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

  const handleSubmit = async () => {
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
    formData.append("remarks", items);

    let localUri = images[0]?.uri;
    let filename = localUri.split("/").pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    formData.append("images[]", {
      uri: localUri,
      name: filename,
      type,
    });

    try {
      const res = await saveECPPhycialProgressImage(authToken, formData);
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
      console.log("EPC progress submit error ::", error);
      setShowLCard(false);
    } finally {
      setShowLCard(false);
    }
  };

  const handleReset = () => {
    setDate(new Date());
    setProgress("");
    setItems("");
    setImages([]);
  };

  return (
    <SafeAreaView style={styles.mainConatiner} edges={["bottom"]}>
      <CustomHeader Title={"Add Physical EPC Progress"} GoBack={true} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        <View style={styles.formCard}>
          <View style={styles.projectTag}>
            <FontAwesome
              name="folder-open"
              size={12}
              color={colors.primary}
              style={styles.projectTagIcon}
            />
            <Text style={styles.projectTagText}>{data?.name}</Text>
          </View>

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
            dropdownStyle={styles.dropdownMenu}
          />

          <Text style={styles.label}>Items</Text>
          <TextField
            placeholder="Enter items description"
            value={items}
            setData={setItems}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Upload Images</Text>
          <View style={styles.rowBetween}>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromCamera}>
              <Text style={styles.fileBtnText}>📷 Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.fileBtn} onPress={pickFromGallery}>
              <Text style={styles.fileBtnText}>🖼️ Gallery</Text>
            </TouchableOpacity>
          </View>

          {images.length > 0 && (
            <ScrollView horizontal style={styles.previewScroller} showsHorizontalScrollIndicator={false}>
              {images.map((img, i) => (
                <Image
                  key={i}
                  source={{ uri: img.uri }}
                  style={styles.previewImg}
                />
              ))}
            </ScrollView>
          )}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainConatiner: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
  },
  formCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radius.lg,
    alignSelf: "stretch",
    ...shadows.card,
  },
  projectTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: spacing.sm,
  },
  projectTagIcon: {
    marginTop: 1,
  },
  projectTagText: {
    flex: 1,
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: colors.text,
  },
  label: {
    fontSize: 13,
    fontFamily: "Jost-SemiBold",
    marginTop: 10,
    marginBottom: 4,
    color: colors.text,
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
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: 10,
    marginTop: 5,
    flex: 0.48,
    alignItems: "center",
  },
  fileBtnText: {
    fontSize: 13,
    color: colors.text,
    fontFamily: "Jost-Medium",
  },
  previewScroller: {
    marginTop: spacing.sm,
  },
  previewImg: {
    width: 84,
    height: 84,
    borderRadius: radius.md,
    marginRight: spacing.sm,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: 20,
  },
  button: {
    flex: 0.48,
    padding: 12,
    borderRadius: radius.md,
    alignItems: "center",
    ...shadows.soft,
  },
  btnText: {
    color: "#fff",
    fontFamily: "Jost-SemiBold",
  },

  dropdownBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    minHeight: 48,
    paddingHorizontal: 16,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1000,
  },
  dropdownBtnText: {
    fontSize: 14,
    color: colors.text,
    textAlign: "left",
    fontFamily: "Jost-Medium",
    flex: 1,
    marginRight: spacing.sm,
  },
  dropdownMenu: {
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    zIndex: 2000,
    padding: 6,
    ...shadows.card,
  },
  dropdownItemTxtStyle: {
    padding: 10,
    fontSize: 13,
    marginVertical: 2,
    fontFamily: "Jost-Medium",
  },
});

export default EPCPhysicalProgressForm;
