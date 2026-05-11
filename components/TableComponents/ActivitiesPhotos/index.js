import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import styles from "./styles";
import { width, height } from "@/services/helper";
import ImageView from "react-native-image-viewing";

const ActivitiesPhotos = ({
  data,
  handleRefresh,
  Title,
  refresh,
  setVisible,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingStates, setLoadingStates] = useState(data?.map(() => true));

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setIsVisible(true);
  };

  const handleLoadStart = (index) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = true;
    setLoadingStates(newLoadingStates);
  };

  const handleLoadEnd = (index) => {
    const newLoadingStates = [...loadingStates];
    newLoadingStates[index] = false;
    setLoadingStates(newLoadingStates);
  };

  return (
    <View style={styles.table}>
      {/* Data rows */}
      <FlatList
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={handleRefresh} />
        }
        ListHeaderComponent={
          <>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: "1%",
                paddingVertical: "2%",
              }}
            >
              <View style={{ width: width * 0.7 }}>
                <Text
                  style={{
                    fontFamily: "Jost-Medium",
                    fontSize: 15,
                    color: "#777",
                  }}
                  numberOfLines={1}
                >
                  {Title}
                </Text>
              </View>
              <View>
                <View
                  style={{
                    backgroundColor: "#007bff",
                    padding: "2%",
                    borderRadius: 3,
                    alignItems: "center",
                  }}
                  onTouchEnd={() => setVisible(true)}
                >
                  <Text
                    style={{
                      fontFamily: "Jost-Medium",
                      fontSize: 15,
                      color: "#fff",
                    }}
                  >
                    Add Photo
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.headerSnoCell}>S.No.</Text>
              <Text style={styles.headerImgCell}>Image</Text>
              <Text style={styles.headerCell}>Created Date</Text>
              <Text style={styles.headerCell}>Updated Date</Text>
              <Text style={styles.headerCell}>Action</Text>
            </View>
          </>
        }
        renderItem={({ item, index }) => {
          return (
            <View style={styles.row}>
              <View style={styles.snocellView}>
                <Text style={styles.snocell}>{index + 1}</Text>
              </View>

              <View style={styles.cellImgView}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.imgContainer}
                  onPress={() => handleImagePress(index)}
                >
                  {loadingStates[index] && (
                    <ActivityIndicator
                      size="small"
                      color="green"
                      style={styles.loader}
                    />
                  )}
                  <Image
                    source={{ uri: item?.name }}
                    style={styles.img}
                    onLoadStart={() => handleLoadStart(index)}
                    onLoadEnd={() => handleLoadEnd(index)}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.cellView}>
                <Text style={styles.cell}>
                  {item?.created_at != null
                    ? item?.created_at
                    : "Not Mentioned"}
                </Text>
              </View>
              <View style={styles.cellView}>
                <Text style={styles.cell}>
                  {item?.updated_at != null
                    ? item?.updated_at
                    : "Not Mentioned"}
                </Text>
              </View>

              <View style={styles.cellView}>
                <View
                  style={styles.buttonView}
                  // onTouchEnd={() =>
                  //   navigation.navigate("PhaseActivitiesPhotoScreen", {
                  //     data: item,
                  //     parentData: parentData,
                  //   })
                  // }
                >
                  <Text
                    style={{
                      fontFamily: "Jost-Medium",
                      color: "#fff",
                      fontSize: 13,
                    }}
                  >
                    -
                  </Text>
                </View>

                {/* <View
                          style={[
                            styles.buttinView,
                            {
                              backgroundColor: "#68f168",
                              marginVertical: "4%",
                            },
                          ]}
                          onTouchEnd={() =>
                            navigation.navigate("PhotoGalleryScreen", {
                              mppr_id: item?.id,
                            })
                          }
                        >
                          <Text
                            style={{
                              fontFamily: "Jost-Medium",
                              fontSize: 13,
                            }}
                          >
                            View Image
                          </Text>
                        </View> */}
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          data?.length == 0 && (
            <View
              style={{
                alignSelf: "center",
                margin: "5%",
              }}
            >
              <Text
                style={{
                  fontFamily: "Jost-Medium",
                  fontSize: 18,
                }}
              >
                No Activities Images Available Now!!
              </Text>
            </View>
          )
        }
        ListFooterComponent={<View style={{ marginBottom: "20%" }} />}
      />
      {isVisible && (
        <ImageView
          images={data?.map((image) => ({ uri: image?.name }))}
          imageIndex={selectedImageIndex}
          visible={isVisible}
          onRequestClose={() => setIsVisible(false)}
          FooterComponent={(index) => (
            <View
              key={index}
              style={{
                width: width,
                height: height * 0.15,
                // backgroundColor: "red",
                backgroundColor: "rgba(255,255,255,0.4 )",
                flexDirection: "row",
                alignItems: "center",
                padding: "2%",
              }}
            >
              {/* <MapView
                style={{ width: 100, height: 100, borderRadius: 20 }}
                region={currentLocation}
                showsUserLocation={false}
                followsUserLocation={false}
                //   customMapStyle={customMapStyle}
              >
                <Marker
                  draggable={true}
                  coordinate={currentLocation}
                  title="Taxi"
                  onDrag={(e) =>
                    setCurrentLocation({ x: e.nativeEvent.coordinate })
                  }
                />
              </MapView> */}
              <View style={{ marginLeft: "5%" }}>
                <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                  Clock Tower, Dehradun
                </Text>
                <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                  latitude: 30.25578554554
                </Text>
                <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                  location: 45.25554545454
                </Text>
                <Text style={{ color: "#fff", fontFamily: "Jost-Medium" }}>
                  Time: 2024-04-10T12:13:15.000000Z
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ActivitiesPhotos;
