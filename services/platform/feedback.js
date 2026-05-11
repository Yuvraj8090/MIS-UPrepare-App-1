import { Alert, Platform, ToastAndroid } from "react-native";

export const showFeedback = (message, title = "U-PREPARE") => {
  if (!message) {
    return;
  }

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }

  Alert.alert(title, message);
};
