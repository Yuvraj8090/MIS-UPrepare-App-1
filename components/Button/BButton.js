import { Text, TouchableOpacity } from "react-native";
import React from "react";

const BButton = ({ Title, icon, onPress = () => {} }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={{
        width: "100%",
        minHeight: 54,
        paddingHorizontal: 18,
        paddingVertical: 14,
        flexDirection: "row",
        backgroundColor: "#0b57a4",
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 14,
        borderRadius: 16,
        zIndex: 5,
      }}
    >
      <Text
        style={{
          fontFamily: "Jost-Medium",
          fontSize: 17,
          color: "#fff",
          marginHorizontal: 6,
        }}
      >
        {Title}
      </Text>
      {icon}
    </TouchableOpacity>
  );
};

export default BButton;
