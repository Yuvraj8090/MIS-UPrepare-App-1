import { View, TextInput, StyleSheet, Dimensions } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

export default function PasswordField({
  err,
  placeholder,
  setPassword,
  password,
  ...props
}) {
  const [isFocus, setIsFocus] = useState(false);

  const styles = StyleSheet.create({
    inputContainer: {
      width: width * 0.8,
      height: height * 0.05,
      backgroundColor: "#F3EEEA",
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      // borderColor: "#161A30",
      // borderBottomWidth: 1,
      marginVertical: "2%",
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 8,
      fontFamily: "Jost-Medium",
      color: "#000",
    },
    icon: {
      marginHorizontal: "5%",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
    setIsFocus(!isFocus);
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { borderWidth: err ? 1 : 0, borderColor: err ? "red" : "" },
      ]}
    >
      <MaterialIcons name="lock" size={24} color="#000" style={styles.icon} />

      {/* <TextInput
        style={styles.input}
        {...props}
        value={password}
        secureTextEntry={!showPassword}
        placeholder={placeholder}
        maxLength={15}
        minLength={8}
        placeholderTextColor="#555"
        onChangeText={(txt) => setPassword(txt)}
      /> */}
      <TextInput
        style={styles.input}
        {...props}
        value={password}
        secureTextEntry={!showPassword}
        placeholder={placeholder}
        maxLength={15}
        placeholderTextColor="#555"
        selectionColor="#000" // Add this line
        onChangeText={(txt) => setPassword(txt)}
        autoCapitalize="none"
        color="#000" // <-- Add this line explicitly
      />

      <MaterialCommunityIcons
        name={showPassword ? "eye-off" : "eye"}
        size={24}
        color="#000"
        style={styles.icon}
        onPress={toggleShowPassword}
      />
    </View>
  );
}
