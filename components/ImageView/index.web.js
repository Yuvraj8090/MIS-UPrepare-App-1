import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";

import styles from "./styles";
import { height, width } from "@/services/helper";

const ImageViewer = ({
  images,
  FetchImages,
  Title,
  load,
  setLoad,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [loadingStates, setLoadingStates] = useState([]);

  useEffect(() => {
    setLoadingStates((images || []).map(() => true));
  }, [images]);

  const handleImagePress = (index) => {
    setSelectedImageIndex(index);
    setIsVisible(true);
  };

  const handleLoadStart = (index) => {
    setLoadingStates((current) => {
      const next = [...current];
      next[index] = true;
      return next;
    });
  };

  const handleLoadEnd = (index) => {
    setLoadingStates((current) => {
      const next = [...current];
      next[index] = false;
      return next;
    });
  };

  const handleRefresh = () => {
    if (typeof setLoad === "function") {
      setLoad(true);
    }

    if (typeof FetchImages === "function") {
      FetchImages();
    }
  };

  const selectedImage = images?.[selectedImageIndex]?.file || null;

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={Boolean(load)} onRefresh={handleRefresh} />
        }
        numColumns={3}
        showsVerticalScrollIndicator={false}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={
          <View>
            <View style={{ margin: "3%" }}>
              <Text style={{ fontFamily: "Jost-SemiBold", fontSize: 16 }}>
                {Title}
              </Text>
            </View>
            <View style={{ width, height: 0.5, backgroundColor: "#ccc" }} />
          </View>
        }
        renderItem={({ item, index }) => (
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
        )}
        ListEmptyComponent={
          load ? (
            <ActivityIndicator
              size="small"
              color="#000"
              style={{ marginTop: 20 }}
            />
          ) : (
            <Image
              source={require("../../assets/images/Notavailable.png")}
              style={{ width, height: height * 0.3 }}
            />
          )
        }
        ListFooterComponent={<View style={{ marginBottom: "50%" }} />}
      />

      <Modal visible={isVisible} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(15, 23, 42, 0.92)",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Pressable
            onPress={() => setIsVisible(false)}
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              zIndex: 2,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              backgroundColor: "rgba(255,255,255,0.14)",
            }}
          >
            <Text style={{ color: "#fff", fontFamily: "Jost-SemiBold" }}>
              Close
            </Text>
          </Pressable>

          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                maxWidth: 920,
                height: height * 0.72,
                resizeMode: "contain",
              }}
            />
          ) : null}
        </View>
      </Modal>
    </View>
  );
};

export default ImageViewer;
