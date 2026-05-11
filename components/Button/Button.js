import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
const { width, height } = Dimensions.get("window");

const Button = ({ Title, color, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      style={{
        // width: width * 0.4,
        padding: "4%",
        // paddingHorizontal: "10%",
        backgroundColor: color,
        alignSelf: "center",
        alignItems: "center",
        margin: "15%",
        borderRadius: 10,
        zIndex: 5,
      }}
    >
      <Text style={{ fontFamily: "Jost-Medium", fontSize: 15, color: "#fff" }}>
        {Title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;
