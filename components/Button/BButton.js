import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");

const BButton = ({ Title, icon, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: width * 0.6,
        padding: "4%",
        flexDirection: "row",
        backgroundColor: "#1f2937",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        margin: "5%",
        borderRadius: 10,
        zIndex: 5,
      }}
    >
      <Text
        style={{
          fontFamily: "Jost-Medium",
          fontSize: 18,
          color: "#fff",
          marginHorizontal: "2%",
        }}
      >
        {Title}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

export default BButton;
