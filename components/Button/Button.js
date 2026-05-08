import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const Button = ({ Title, color, onPress = () => {}, style, textStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.button,
        { backgroundColor: color || colors.primary },
        style,
      ]}
    >
      <Text style={[styles.text, textStyle]}>
        {Title}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: spacing.xl,
    paddingVertical: 14,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    marginTop: spacing.md,
    ...shadows.soft,
  },
  text: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: colors.surface,
  },
});
