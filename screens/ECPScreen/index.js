import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { use, useCallback, useEffect, useState } from "react";
import styles from "./styles";
import CustomHeader from "@/components/AppHeader/CustomHeader";
import { height, width } from "@/services/helper";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getFromSS } from "@/services/storage/SecureStore";
import { fetchECPPhycialProgress } from "@/services/api/fetch";
import SkeletonLoader from "@/components/SkeletonDesign/EntryCardSkeleton";

const ECPScreen = (props) => {
  console.log("PROPSSS ECP ::", props?.route?.params);
  const { data } = props?.route?.params;
  const navigation = useNavigation();

  const [entries, setEntries] = useState([]);
  const [expandedTitle, setExpandedTitle] = useState(false);
  const [load, setLoad] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [imgLoad, setImgLoad] = useState(false);

  // 🔹 API call
  const getEntries = async (id) => {
    const authToken = await getFromSS("authToken");

    setLoad(true);
    try {
      const res = await fetchECPPhycialProgress(authToken, id);
      console.log("RESS ::", res);

      setEntries(res?.data || []);
      setLoad(false);
    } catch (error) {
      console.log("GET SAFEGUARD API ERROR ::", error);
      setLoad(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (data?.id) {
        getEntries(data?.id);
      }
    }, [data?.id])
  );

  const renderItem = ({ item }) => {
    console.log("ITEMEMM :;", item?.image_urls);
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>SNo:</Text>
          <Text style={styles.value}>{item?.epcentry_data?.sl_no}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Activity:</Text>
          <Text style={styles.value}>{item?.epcentry_data?.activity_name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stage:</Text>
          <Text style={styles.value}>{item?.epcentry_data?.stage_name}</Text>
        </View>
        {item?.percent > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Percent:</Text>
            <Text style={styles.value}>{item?.percent}%</Text>
          </View>
        )}
        <View style={styles.row}>
          <Text style={styles.label}>Items Done:</Text>
          <Text style={styles.value}>{item?.items}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Submitted:</Text>
          <Text style={styles.value}>
            {new Date(item?.progress_submitted_date)?.toLocaleDateString("en-GB")}
          </Text>
        </View>
        {/* Attractive Button */}
        {item?.image_urls?.length > 0 && (
          <TouchableOpacity
            style={styles.imageButton}
            //   onPress={() => console.log("View Image Pressed")}
            onPress={() => {
              setSelectedImage(item?.image_urls[0]); // 👈 store selected image
              setModalVisible(true);
            }}
          >
            <Ionicons name="image-outline" size={18} color="#fff" />
            <Text style={styles.imageButtonText}>View Image</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderSkeleton = () => {
    return (
      <>
        {[...Array(1)].map((_, i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              //   marginVertical: 10,
              //   paddingHorizontal: 10,
            }}
          >
            <SkeletonLoader
              width={width * 0.5}
              height={15}
              style={{ marginBottom: 6 }}
            />
          </View>
        ))}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <CustomHeader
          Title={"Physical EPC Progress Management"}
          GoBack={true}
        />

        {load ? (
          <>{renderSkeleton()}</>
        ) : (
          <>
            <FlatList
              data={entries}
              keyExtractor={(i) => i?.id?.toString()}
              renderItem={renderItem}
              ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
              contentContainerStyle={{ paddingBottom: 20, height: height }}
              stickyHeaderIndices={[0]}
              ListHeaderComponent={
                <View style={{ backgroundColor: "#fff" }}>
                  <View style={[styles.projectCard]}>
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
                        style={styles.projectTitle}
                        numberOfLines={expandedTitle ? undefined : 2}
                      >
                        {data?.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <TouchableOpacity
                        activeOpacity={0.5}
                        style={{
                          alignSelf: "flex-start",
                          flexDirection: "row",
                          alignItems: "center",
                          backgroundColor: "#28A745",
                          borderRadius: 10,
                          paddingVertical: "1.5%",
                          paddingHorizontal: "2.5%",
                          gap: 5,
                        }}
                        onPress={() =>
                          navigation.navigate("ECPPhysicalProgressForm", {
                            data,
                          })
                        }
                      >
                        <FontAwesome5
                          name="plus-circle"
                          size={16}
                          color="#fff"
                        />
                        <Text
                          style={{
                            fontFamily: "Jost-SemiBold",
                            fontSize: 12,
                            color: "#ffff",
                          }}
                        >
                          Add Progress Entry
                        </Text>
                      </TouchableOpacity>

                      {data?.name?.length > 60 && (
                        <TouchableOpacity
                          style={{ position: "absolute", right: 0, top: 1 }}
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
                    </View>
                  </View>
                  {/* Table header */}
                  <View style={styles.headerRow}>
                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 0.6, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      SNo
                    </Text>
                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 0.8, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      Activity
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 0.9, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      Stage
                    </Text>
                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 1, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      Percent
                    </Text>
                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 1.4, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      Items Done
                    </Text>
                    <Text
                      style={[
                        styles.headerCell,
                        { flex: 1.6, fontFamily: "Jost-SemiBold" },
                      ]}
                    >
                      Submitted Date
                    </Text>

                    {/* <Text
                  style={[
                    styles.headerCell,
                    { flex: 1, fontFamily: "Jost-SemiBold" },
                  ]}
                >
                  Action
                </Text> */}
                  </View>
                </View>
              }
              ListFooterComponent={
                <>
                  {load ? (
                    <>
                      {[...Array(2)].map((_, i) => (
                        <Text>Loading...</Text>
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
          </>
        )}

        {/* Popup Modal */}

        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalCard}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => {
                  setModalVisible(false), setSelectedImage(null);
                }}
              >
                <Ionicons name="close-circle" size={26} color="#ff4444" />
              </TouchableOpacity>

              {/* Image */}
              <View style={styles.imgcontainer}>
                {imgLoad && (
                  <ActivityIndicator
                    size="large"
                    color="#ccc"
                    style={styles.loader}
                  />
                )}
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.previewImage}
                  resizeMode="cover"
                  onLoadStart={() => setImgLoad(true)}
                  onLoadEnd={() => setImgLoad(false)}
                />
              </View>

              <Text style={styles.previewLabel}>Preview</Text>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ECPScreen;
