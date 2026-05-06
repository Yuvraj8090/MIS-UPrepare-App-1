import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TextField = ({ err, otp, number, iconName, ...props }) => {
  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderWidth: 1,
          borderColor: err ? "#dc2626" : "#cbd5e1",
        },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={22}
        color="#475569"
        style={styles.icon}
      />
      <TextInput
        style={styles.input}
        {...props}
        maxLength={number ? number : 50}
        onChangeText={(txt) =>
          props.setData(number || otp ? txt : txt.replace(/^\s+/, ""))
        }
        keyboardType={number ? "numeric" : otp ? "numeric" : "default"}
        editable={!props.disable}
        placeholderTextColor="#64748b"
        autoCapitalize="none"
        selectionColor="#0b57a4"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    minHeight: 54,
    alignItems: "center",
    borderRadius: 16,
    flexDirection: "row",
    marginVertical: 6,
    backgroundColor: "#f8fafc",
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Jost-Medium",
    paddingVertical: 12,
    color: "#0f172a",
  },
  icon: {
    marginRight: 10,
  },
});

export default TextField;
