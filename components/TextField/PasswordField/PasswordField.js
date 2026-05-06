import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

export default function PasswordField({
  err,
  placeholder,
  setPassword,
  password,
  ...props
}) {
  const styles = StyleSheet.create({
    inputContainer: {
      width: "100%",
      minHeight: 54,
      backgroundColor: "#f8fafc",
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 6,
      paddingHorizontal: 14,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 12,
      fontFamily: "Jost-Medium",
      color: "#0f172a",
    },
    icon: {
      marginRight: 10,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View
      style={[
        styles.inputContainer,
        { borderWidth: 1, borderColor: err ? "#dc2626" : "#cbd5e1" },
      ]}
    >
      <MaterialIcons
        name="lock"
        size={22}
        color="#475569"
        style={styles.icon}
      />

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
        placeholderTextColor="#64748b"
        selectionColor="#0b57a4"
        onChangeText={(txt) => setPassword(txt)}
        autoCapitalize="none"
        color="#0f172a"
      />

      <MaterialCommunityIcons
        name={showPassword ? "eye-off" : "eye"}
        size={22}
        color="#475569"
        style={styles.icon}
        onPress={toggleShowPassword}
      />
    </View>
  );
}
