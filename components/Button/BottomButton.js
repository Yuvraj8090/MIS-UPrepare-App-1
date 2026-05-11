import { Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const BottomButton = ({ onPress = () => {}, Title, active }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!active}
      style={[styles.button, active ? styles.buttonActive : styles.buttonMuted]}
    >
      <Text style={styles.text}>
        {Title}
      </Text>
    </TouchableOpacity>
  );
};

export default BottomButton;

const styles = StyleSheet.create({
  button: {
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: radius.md,
    ...shadows.card,
  },
  buttonActive: {
    backgroundColor: colors.primary,
  },
  buttonMuted: {
    backgroundColor: colors.borderStrong,
  },
  text: {
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    color: "#fff",
  },
});
