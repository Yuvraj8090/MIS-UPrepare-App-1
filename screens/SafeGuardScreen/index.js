import React, { useState, useCallback, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./style";
import DropDownPicker from "react-native-dropdown-picker";
import EntryCard from "@/components/SafeguardComponent/EntryCard";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { width } from "@/services/helper";
import SelectDropdown from "react-native-select-dropdown";
import CalenderField from "@/components/TextField/CalenderField/CalenderField";
import {
  fetchSafeGuardEntries,
  saveSafeGuardEntries,
  saveSafeGuardEntriesImage,
} from "@/services/api/fetch";
import { getFromSS } from "@/services/storage/SecureStore";
import EntrySkeletonCard from "@/components/SkeletonDesign/EntryCardSkeleton";
import LoaderCard from "@/components/LoaderCard";

const SafeguardScreen = (props) => {
  console.log("PROPSSS ::", props?.route?.params);
  const { data } = props?.route?.params;
  // const data = {
  //   id: 31,
  //   name: "Construction of 60 M Span  Intermediate Lane Steel Truss Bridge over Jimba River at Km-01 of Seraghat-Golpha-Bona Motor Road, Block-Munsyari, District Pithoragarh",
  //   contract_value: "65164329.00",
  // };
  const [filterCompliance, setFilterCompliance] = useState({
    label: "Environmental",
    value: "1",
  }); // Environmental = 1
  const [filterPhase, setFilterPhase] = useState("1"); // Pre-Construction = 1
  const [filterDate, setFilterDate] = useState(new Date()); // Today
  const [entries, setEntries] = useState([]);

  const [items, setItems] = useState([
    { label: "Pre Construction", value: "1" },
    { label: "Construction", value: "2" },
    { label: "Post Construction", value: "3" },
  ]);

  const [uploadFile, setUploadFile] = useState(null);

  const [expandedTitle, setExpandedTitle] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 🔹 API call
  const getSafeguardEntries = async (
    compliance = filterCompliance?.value,
    phase = filterPhase,
    date = filterDate
  ) => {
    const authToken = await getFromSS("authToken");

    let payload = `${data?.id}/${compliance}/${phase}`;
    console.log("Payload for API:", payload);

    setLoading(true);
    try {
      const res = await fetchSafeGuardEntries(authToken, payload);
      console.log("RESS ::", res);

      setEntries(res?.entries || []);
      setLoading(false);
    } catch (error) {
      console.log("GET SAFEGUARD API ERROR ::", error);
    }
  };

  // 🔹 Load default data when screen opens
  useEffect(() => {
    if (data?.id) {
      getSafeguardEntries();
    }
  }, [data?.id]);

  // 🔹 Whenever filters change, re-fetch API
  useEffect(() => {
    if (data?.id) {
      getSafeguardEntries(filterCompliance?.value, filterPhase, filterDate);
    }
  }, [filterCompliance, filterPhase, filterDate]);

  const handleSaveEntry = async (entry) => {
    const authToken = await getFromSS("authToken");
    const formData = new FormData();
    try {
      formData.append("entry_id", entry?.entry_id);
      formData.append("yes_no", entry?.yes_no);
      formData.append("remarks", entry?.remarks);
      formData.append("validity_date", entry?.validity_date);
      formData.append("date_of_entry", entry?.date_of_entry);
      formData.append("sub_package_project_id", data?.id);
      formData.append("social_compliance_id", filterCompliance?.value);
      formData.append("contraction_phase_id", filterPhase);

      console.log("FORMDATA ::", JSON.stringify(formData));

      // const payload = {
      //   // entry_id: entry?.id,
      //   sub_package_project_id: data?.id,
      //   social_compliance_id: filterCompliance?.value,
      //   contraction_phase_id: filterPhase,
      //   ...entry, // send full entry if required

      //   // yes_no:1
      //   // remarks:Test entry
      //   // validity_date:2025-12-31
      //   // date_of_entry:2025-09-06
      // };

      // console.log("PAYLOADDD :;", payload);

      const savedData = await saveSafeGuardEntries(authToken, formData);
      console.log("RESS SAVEEEDATA :", savedData);

      setEntries((prev) =>
        prev.map((e) =>
          e.id === savedData?.id ? { ...e, _saved: savedData } : e
        )
      );

      Alert.alert(
        "Success",
        `Entry ${savedData?.social_id} saved successfully.`
      );
    } catch (err) {
      Alert.alert("Error", "Failed to save entry. Please try again.");
    }
  };

  const handleUploadPress = async (entry) => {
    console.log("NETRYY :;", entry);
    const authToken = await getFromSS("authToken");
    try {
      // Ask permission
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert("Permission required", "We need camera roll permissions.");
        return;
      }

      // Pick file (image/video)
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled) {
        const pickedAsset = result.assets[0]; // contains uri, fileName, etc.

        // Alert.alert("File selected", `Entry ${entry.id}: ${pickedAsset.uri}`);

        // Example: send to server
        let localUri = pickedAsset.uri;
        let filename = localUri.split("/").pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append("media_files[]", {
          uri: localUri,
          name: filename,
          type,
        });
        // formData.append("entry_id", entry.id);
        formData.append("social_id", entry.social?.id);
        console.log("FORMDATAB :", JSON.stringify(formData));

        setUploading(true);

        const res = await saveSafeGuardEntriesImage(authToken, formData);
        console.log("RESS UPLOAD IMAGE::", res);

        if (res?.status) {
          Alert.alert(
            "Files uploaded successfully.",
            `Entry ${res?.social_id} of ${entry?.item_description}`
          );
        }
        setUploading(false);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while picking the file.");
      setUploading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <EntryCard
        entry={item}
        onSave={handleSaveEntry}
        onUploadPress={handleUploadPress}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <CustomHeader Title={"Environmental Safeguard Entries"} GoBack={true} />

      <View style={{ backgroundColor: "#fff" }}>
        {/* Project & filters */}
        <View style={[styles.projectCard]}>
          <View style={{ flexDirection: "row", gap: 4, width: width * 0.85 }}>
            <FontAwesome
              name="folder-open"
              size={12}
              color="#007BFF"
              style={{ marginTop: 2.5 }}
            />
            <Text
              style={styles.projectTitle}
              numberOfLines={expandedTitle ? undefined : 2}
            >
              {data?.name}
            </Text>
          </View>
          {data?.name?.length > 60 && (
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={() => setExpandedTitle(!expandedTitle)}
            >
              <Text
                style={{
                  fontFamily: "Jost-Regular",
                  fontSize: 12,
                  color: "#3488FD",
                }}
              >
                {expandedTitle ? "Hide ▲" : "View ▼"}
              </Text>
            </TouchableOpacity>
          )}

          {/* Filters */}
          <View style={styles.filterRow}>
            {/* safeguard */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Safeguard</Text>
              <View style={styles.filterValue}>
                <Text style={{ fontSize: 13, fontFamily: "Jost-Medium" }}>
                  {filterCompliance?.label}
                </Text>
              </View>
            </View>

            {/* phase */}
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Phase</Text>
              <View style={styles.filterValu}>
                <SelectDropdown
                  data={items}
                  defaultValue={items.find(
                    (item) => item.value === filterPhase
                  )}
                  onSelect={(selectedItem) =>
                    setFilterPhase(selectedItem?.value)
                  }
                  renderDropdownIcon={(isOpened) => (
                    <AntDesign
                      name={isOpened ? "up" : "down"}
                      size={14}
                      color="#000"
                    />
                  )}
                  renderButton={(selectedItem, isOpened) => (
                    <View style={styles.dropdownBtn}>
                      <Text style={styles.dropdownBtnText}>
                        {selectedItem?.label}
                      </Text>
                      <MaterialCommunityIcons
                        name={isOpened ? "chevron-up" : "chevron-down"}
                        size={15}
                      />
                    </View>
                  )}
                  renderItem={(item, index, isSelected) => (
                    <View
                      style={{
                        ...styles.dropdownMenu,
                        ...(isSelected && { backgroundColor: "#D2D9DF" }),
                      }}
                    >
                      <Text style={styles.dropdownItemTxtStyle}>
                        {item?.label}
                      </Text>
                    </View>
                  )}
                  dropdownIconPosition={"right"}
                  dropdownStyle={styles.dropdownMenu}
                />
              </View>
            </View>

            {/* date */}
            <View style={[styles.filterItem, { marginLeft: 3 }]}>
              <Text style={styles.filterLabel}>Date</Text>
              <CalenderField
                placeholder={"Date"}
                Cdate={filterDate}
                setCDate={setFilterDate}
              />
            </View>
          </View>
        </View>
        {/* Table header */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.headerCell,
              { flex: 1, fontFamily: "Jost-SemiBold" },
            ]}
          >
            SNo
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 1, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Item
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 1.3, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Yes/No
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 1.6, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Remarks
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 2, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Validity
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 1, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Date
          </Text>
          <Text
            style={[
              styles.headerCell,
              { flex: 1, fontFamily: "Jost-SemiBold" },
            ]}
          >
            Action
          </Text>
        </View>
      </View>
      <FlatList
        // data={ENTRIES}
        data={entries}
        keyExtractor={(i) => i.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        contentContainerStyle={{ paddingBottom: 20 }}
        // stickyHeaderIndices={[0]}
        // ListHeaderComponent={
        //   <View style={{ backgroundColor: "#fff" }}>
        //     {/* Project & filters */}
        //     <View style={[styles.projectCard]}>
        //       <View
        //         style={{ flexDirection: "row", gap: 4, width: width * 0.85 }}
        //       >
        //         <FontAwesome
        //           name="folder-open"
        //           size={12}
        //           color="#007BFF"
        //           style={{ marginTop: 2.5 }}
        //         />
        //         <Text
        //           style={styles.projectTitle}
        //           numberOfLines={expandedTitle ? undefined : 2}
        //         >
        //           {data?.name}
        //         </Text>
        //       </View>
        //       {data?.name?.length > 60 && (
        //         <TouchableOpacity
        //           style={{ alignSelf: "flex-end" }}
        //           onPress={() => setExpandedTitle(!expandedTitle)}
        //         >
        //           <Text
        //             style={{
        //               fontFamily: "Jost-Regular",
        //               fontSize: 12,
        //               color: "#3488FD",
        //             }}
        //           >
        //             {expandedTitle ? "Hide ▲" : "View ▼"}
        //           </Text>
        //         </TouchableOpacity>
        //       )}

        //       {/* Filters */}
        //       <View style={styles.filterRow}>
        //         {/* safeguard */}
        //         <View style={styles.filterItem}>
        //           <Text style={styles.filterLabel}>Safeguard</Text>
        //           <View style={styles.filterValue}>
        //             <Text style={{ fontSize: 13, fontFamily: "Jost-Medium" }}>
        //               {filterCompliance?.label}
        //             </Text>
        //           </View>
        //         </View>

        //         {/* phase */}
        //         <View style={styles.filterItem}>
        //           <Text style={styles.filterLabel}>Phase</Text>
        //           <View style={styles.filterValu}>
        //             <SelectDropdown
        //               data={items}
        //               defaultValue={items.find(
        //                 (item) => item.value === filterPhase
        //               )}
        //               onSelect={(selectedItem) =>
        //                 setFilterPhase(selectedItem?.value)
        //               }
        //               renderDropdownIcon={(isOpened) => (
        //                 <AntDesign
        //                   name={isOpened ? "up" : "down"}
        //                   size={14}
        //                   color="#000"
        //                 />
        //               )}
        //               renderButton={(selectedItem, isOpened) => (
        //                 <View style={styles.dropdownBtn}>
        //                   <Text style={styles.dropdownBtnText}>
        //                     {selectedItem?.label}
        //                   </Text>
        //                   <MaterialCommunityIcons
        //                     name={isOpened ? "chevron-up" : "chevron-down"}
        //                     size={15}
        //                   />
        //                 </View>
        //               )}
        //               renderItem={(item, index, isSelected) => (
        //                 <View
        //                   style={{
        //                     ...styles.dropdownMenu,
        //                     ...(isSelected && { backgroundColor: "#D2D9DF" }),
        //                   }}
        //                 >
        //                   <Text style={styles.dropdownItemTxtStyle}>
        //                     {item?.label}
        //                   </Text>
        //                 </View>
        //               )}
        //               dropdownIconPosition={"right"}
        //               dropdownStyle={styles.dropdownMenu}
        //             />
        //           </View>
        //         </View>

        //         {/* date */}
        //         <View style={[styles.filterItem, { marginLeft: 3 }]}>
        //           <Text style={styles.filterLabel}>Date</Text>
        //           <CalenderField
        //             placeholder={"Date"}
        //             Cdate={filterDate}
        //             setCDate={setFilterDate}
        //           />
        //         </View>
        //       </View>
        //     </View>
        //     {/* Table header */}
        //     <View style={styles.headerRow}>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         SNo
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Item
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1.3, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Yes/No
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1.6, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Remarks
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 2, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Validity
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Date
        //       </Text>
        //       <Text
        //         style={[
        //           styles.headerCell,
        //           { flex: 1, fontFamily: "Jost-SemiBold" },
        //         ]}
        //       >
        //         Action
        //       </Text>
        //     </View>
        //   </View>
        // }
        ListFooterComponent={
          <>
            {loading ? (
              <>
                {[...Array(2)].map((_, i) => (
                  <EntrySkeletonCard key={i} />
                ))}
              </>
            ) : (
              <>
                {entries?.length === 0 && (
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      marginVertical: "5%",
                    }}
                  >
                    <Text style={{ fontFamily: "Jost-SemiBold" }}>
                      No Entries Found!
                    </Text>
                  </View>
                )}
              </>
            )}
          </>
        }
      />
      <LoaderCard visible={uploading} message="Please wait — saving data..." />
    </SafeAreaView>
  );
};

export default SafeguardScreen;
