import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, radius, shadows, spacing } from "@/constants/theme";

export default function CustomHeader({ GoBack, Title }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.mainContainer, { paddingTop:  insets.top }]}>
      <View style={styles.sideWrap}>
        {GoBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backButton,
              pressed && styles.backButtonPressed,
            ]}
          >
            <AntDesign name="arrowleft" size={20} color={colors.text} />
          </Pressable>
        ) : null}
      </View>

      <Text numberOfLines={1} style={styles.title}>
        {Title}
      </Text>

      <View style={styles.sideWrap} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    ...shadows.soft,
  },
  sideWrap: {
    width: 40,
    height: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  backButtonPressed: {
    opacity: 0.82,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    color: colors.text,
    paddingHorizontal: spacing.sm,
  },
});
