import { Dimensions, Platform, View, Text } from "react-native";
import { LayoutAnimation, UIManager } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const width = Dimensions.get("screen").width;
export const height = Dimensions.get("screen").height;

export const CheckInternet = () => {
  const NetConnected = NetInfo.useNetInfo();

  const [netCheck, setNetCheck] = useState(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setNetCheck(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   toggleShow();
  // }, [NetConnected?.isConnected]);

  // if (Platform.OS === "android") {
  //   if (UIManager.setLayoutAnimationEnabledExperimental) {
  //     UIManager.setLayoutAnimationEnabledExperimental(true);
  //   }
  // }

  // const toggleShow = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setNetCheck(NetConnected?.isConnected);
  // };

  return (
    <>
      {!netCheck && (
        <View
          style={{
            backgroundColor: "red",
            alignItems: "center",
            paddingVertical: "0.5%",
          }}
        >
          <Text
            style={{
              fontFamily: "Jost-Medium",
              color: "#fff",
              fontSize: 12,
            }}
          >
            No Internet Connectivity!!
          </Text>
        </View>
      )}
    </>
  );
};

export const NetConnected = () => {
  const [isInternet, setIsInternet] = useState(null);

  // Subscribe to NetInfo to check internet connection status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsInternet(state.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  return isInternet;
};

export const convertToCr = (value) => {
  if (!value) return "₹0 Cr";
  return `₹${(Number(value) / 10000000).toFixed(2)} Cr`;
};

export const getNestedPercentFilter = (item, key) => {
  switch (key) {
    case "environmental_pre":
      return item?.safeguards?.[0]?.phases?.[0]?.percent ?? 0;
    case "environmental_during":
      return item?.safeguards?.[0]?.phases?.[1]?.percent ?? 0;
    case "social_pre":
      return item?.safeguards?.[1]?.phases?.[0]?.percent ?? 0;
    case "social_during":
      return item?.safeguards?.[1]?.phases?.[1]?.percent ?? 0;
    default:
      return item?.[key] ?? 0;
  }
};

export const formatDate = (date) => {
  if (!date) return null;

  if (typeof date === "string") {
    return date.includes("T") ? date.split("T")[0] : date;
  }

  return date.toISOString().split("T")[0];
};
