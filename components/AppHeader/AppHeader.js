import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckInternet } from "@/services/helper";

export default function AppHeader({ Title }) {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <View
          style={[
            styles.mainContainer,
            {
              minHeight: 56 + Math.max(insets.top * 0.15, 0),
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open navigation menu"
            hitSlop={10}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={styles.menuButton}
          >
            <Feather name="align-left" size={22} color="#0f172a" />
          </Pressable>

          <View style={styles.titleWrap}>
            <Text numberOfLines={1} style={styles.titleText}>
              {Title || "U-PREPARE"}
            </Text>
          </View>

          <View style={styles.trailingSpacer} />
        </View>
      </SafeAreaView>
      <CheckInternet />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#d9e2ec",
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  titleWrap: {
    flex: 1,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  titleText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    color: "#0f172a",
    textAlign: "center",
  },
  trailingSpacer: {
    width: 40,
    height: 40,
  },
});
