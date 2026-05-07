import { Dimensions, View, Text, StyleSheet } from "react-native";
import NetInfo from "@react-native-community/netinfo";

export const width = Dimensions.get("screen").width;
export const height = Dimensions.get("screen").height;

export const CheckInternet = () => {
  const netInfo = NetInfo.useNetInfo();
  const isOffline = netInfo?.isConnected === false;

  return isOffline ? (
    <View style={styles.banner}>
      <Text style={styles.bannerText}>
        Offline mode: some data may be saved content.
      </Text>
    </View>
  ) : null;
};

export const NetConnected = () => {
  const netInfo = NetInfo.useNetInfo();
  return netInfo?.isConnected ?? null;
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

const styles = StyleSheet.create({
  banner: {
    backgroundColor: "#fff4e5",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#f5d0a7",
  },
  bannerText: {
    fontFamily: "Jost-Medium",
    color: "#8a4b08",
    fontSize: 12,
    textAlign: "center",
  },
});
