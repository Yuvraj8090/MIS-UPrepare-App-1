import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect } from "react";
import styles from "./styles";
import ImageView from "react-native-image-viewing";
import { height, width } from "@/services/helper";

const ImageViewer = ({
  images,
  setImages,
  FetchImages,
  Title,
  load,
  setLoad,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [isVisible, setIsVisible] = useState(false);
  // const [refreshing, setRefreshing] = useState(load);
  const [loadingStates, setLoadingStates] = useState(images?.map(() => true));

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

  const handleRefresh = () => {
    setLoad(true);
    FetchImages();
  };

  return (
    <View>
      <FlatList
        //   contentContainerStyle={{ flexDirection: "row" }}
        refreshControl={
          <RefreshControl refreshing={load} onRefresh={handleRefresh} />
        }
        numColumns={3}
        showsVerticalScrollIndicator={false}
        data={images}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <View>
            <View style={{ margin: "3%" }}>
              <Text style={{ fontFamily: "Jost-SemiBold", fontSize: 16 }}>
                {Title}
              </Text>
            </View>
            <View
              style={{ width: width, height: 0.5, backgroundColor: "#ccc" }}
            />
          </View>
        }
        renderItem={({ item, index }) => {
          // console.log("ITEM URI:", item.file);
          return (
            <>
              <View key={index} style={styles.subView}>
                <TouchableOpacity
                  activeOpacity={0.8}
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
                    source={{ uri: item?.file }}
                    style={styles.subimage}
                    onLoadStart={() => handleLoadStart(index)}
                    onLoadEnd={() => handleLoadEnd(index)}
                  />
                </TouchableOpacity>
              </View>
            </>
          );
        }}
        ListEmptyComponent={
          load ? (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{ marginTop: 20 }}
            />
          ) : (
            <>
              <Image
                source={require("../../assets/images/Notavailable.png")}
                style={{ width: width, height: height * 0.3 }}
              />
              {/* <Text style={{ alignSelf: "center", marginTop: 20 }}>
                  No Image
                </Text> */}
            </>
          )
        }
        ListFooterComponent={<View style={{ marginBottom: "50%" }} />}
      />

      {isVisible && (
        <ImageView
          images={images?.map((image) => ({ uri: image?.file }))}
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

export default ImageViewer;
