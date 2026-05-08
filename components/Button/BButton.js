import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import React from "react";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const BButton = ({ Title, icon, onPress = () => {}, style, disabled }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}
    >
      <View style={styles.content}>
        <Text style={styles.text}>
        {Title}
        </Text>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      </View>
    </TouchableOpacity>
  );
};

export default BButton;

const styles = StyleSheet.create({
  button: {
    width: "100%",
    minHeight: 54,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: colors.primary,
    alignSelf: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    borderRadius: radius.md,
    ...shadows.soft,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  iconWrap: {
    marginLeft: 8,
  },
});
