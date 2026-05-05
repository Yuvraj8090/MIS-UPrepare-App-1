import { View, Text } from "react-native";
import React from "react";
import SkeletonLoader from "./PackageTableRow";
import { Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

const BOQPhysicalProgressSkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <View
          key={i}
          style={{
            marginVertical: 2,
            paddingHorizontal: "5%",
            paddingVertical: "4%",
            gap: 5,
            backgroundColor: "#fff",
          }}
        >
          <SkeletonLoader width={screenWidth * 0.9} height={20} />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SkeletonLoader width={screenWidth * 0.3} height={20} />
            <SkeletonLoader width={screenWidth * 0.3} height={20} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <SkeletonLoader width={screenWidth * 0.25} height={20} />
            <SkeletonLoader width={screenWidth * 0.3} height={20} />
          </View>
          <SkeletonLoader width={screenWidth * 0.5} height={20} />
        </View>
      ))}
    </>
  );
};

export default BOQPhysicalProgressSkeleton;
