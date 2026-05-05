import React from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native";

export default function LoaderCard({
  visible = false,
  message = "Loading...",
  spinnerSize = "large",
  spinnerColor = "#ffffff",
  backgroundColor = "rgba(0,0,0,0.2)",
  modalProps = {},
  containerStyle = {},
  textStyle = {},
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType={modalProps.animationType ?? "fade"}
      onRequestClose={modalProps.onRequestClose ?? (() => {})}
      statusBarTranslucent={modalProps.statusBarTranslucent ?? true}
      {...modalProps}
    >
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={[styles.overlay, { backgroundColor }]}>
          <View style={[styles.container, containerStyle]}>
            <ActivityIndicator size={spinnerSize} color={spinnerColor} />
            {message ? (
              <Text style={[styles.message, textStyle]}>{message}</Text>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    minWidth: 160,
    maxWidth: 320,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
  },
});
