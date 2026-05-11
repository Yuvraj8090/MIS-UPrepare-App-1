import React from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";

const ImageViewerModal = ({
  images = [],
  imageIndex = 0,
  visible = false,
  onRequestClose = () => {},
  FooterComponent,
}) => {
  const selectedImage = images?.[imageIndex]?.uri || null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.92)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Pressable
          onPress={onRequestClose}
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
              height: "72%",
              resizeMode: "contain",
            }}
          />
        ) : null}

        {typeof FooterComponent === "function" ? FooterComponent(imageIndex) : null}
      </View>
    </Modal>
  );
};

export default ImageViewerModal;
