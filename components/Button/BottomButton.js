import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { width } from "../../services/helper";

const BottomButton = ({ onPress = () => {}, Title, active }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      disabled={active ? false : true}
      style={{
        width: width,
        backgroundColor: active ? "#000" : "#ccc",
        alignItems: "center",
        paddingVertical: "4%",
        position: "absolute",
        bottom: 0,
      }}
    >
      <Text style={{ fontFamily: "Jost-Medium", fontSize: 16, color: "#ffff" }}>
        {Title}
      </Text>
    </TouchableOpacity>
  );
};

export default BottomButton;
