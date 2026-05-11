import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/constants/theme";

const TextField = ({ err, otp, number, iconName, ...props }) => {
  return (
    <View
      style={[
        styles.inputContainer,
        {
          borderWidth: 1,
          borderColor: err ? colors.danger : colors.borderStrong,
        },
      ]}
    >
      <MaterialCommunityIcons
        name={iconName}
        size={22}
        color={colors.textMuted}
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
        selectionColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: "100%",
    minHeight: 54,
    alignItems: "center",
    borderRadius: radius.md,
    flexDirection: "row",
    marginVertical: spacing.xs,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Jost-Medium",
    paddingVertical: 12,
    color: colors.text,
  },
  icon: {
    marginRight: 10,
  },
});

export default TextField;
