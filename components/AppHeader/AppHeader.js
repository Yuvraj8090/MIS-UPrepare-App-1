import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckInternet } from "@/services/helper";
import { colors, radius, shadows, spacing } from "@/constants/theme";

export default function AppHeader({ Title }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={[styles.mainContainer, { paddingTop: Math.max(insets.top, 10) }]}>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={({ pressed }) => [
            styles.menuButton,
            pressed && styles.menuButtonPressed,
          ]}
        >
          <Feather name="align-left" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.titleWrap}>
          <Text numberOfLines={1} style={styles.title}>
            {Title}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>
      <CheckInternet />
    </>
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceMuted,
  },
  menuButtonPressed: {
    opacity: 0.82,
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  title: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    color: colors.text,
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
