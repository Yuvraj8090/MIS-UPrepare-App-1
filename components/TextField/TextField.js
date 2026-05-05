import React from "react";
import { Text, View, TextInput, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");

const TextField = ({ err, otp, number, iconName, ...props }) => {
  //   console.log("Propss :", props);
  return (
    <View
      style={[
        styles.inputContainer,
        { borderWidth: err ? 1 : 0, borderColor: err ? "red" : "transparent" },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color="#000"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        {...props}
        maxLength={number ? number : 50}
        onChangeText={(txt) => props.setData(txt.trim())}
        keyboardType={number ? "numeric" : otp ? "numeric" : "default"}
        editable={!props.disable}
        placeholderTextColor="#555"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: width * 0.8,
    height: height * 0.05,
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
    marginVertical: "2%",
    backgroundColor: "#F3EEEA",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Jost-Medium",
    paddingVertical: 8,
    textTransform: "uppercase",
    color: "#000",
  },
  icon: {
    marginHorizontal: "5%",
  },
});

export default TextField;
