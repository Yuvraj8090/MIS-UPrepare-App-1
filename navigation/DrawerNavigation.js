import React, { useCallback, useMemo, useState } from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";

import TabNavigation from "./TabNavigation";
import { useAuth } from "./AuthContext/AuthContext";
import LoaderCard from "@/components/LoaderCard";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const Drawer = createDrawerNavigator();
const FALLBACK_AVATAR = require("../assets/images/user.jpg");

const DRAWER_LINKS = [
  {
    key: "Home",
    label: "Dashboard",
    icon: "grid-outline",
  },
  {
    key: "Packages",
    label: "Packages",
    icon: "cube-outline",
  },
  {
    key: "UpdateProgress",
    label: "Update Progress",
    icon: "cloud-upload-outline",
  },
  {
    key: "Work",
    label: "Work Progress",
    icon: "bar-chart-outline",
  },
];

const readNestedName = (value, fallback = "User") => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (value && typeof value === "object" && typeof value.name === "string") {
    return value.name.trim() || fallback;
  }

  return fallback;
};

const DrawerNavigation = () => {
  const { user, LogOut, loading } = useAuth();
  const [logoutPending, setLogoutPending] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogOut = useCallback(async () => {
    setLogoutPending(true);

    try {
      await LogOut();
    } finally {
      setLogoutPending(false);
    }
  }, [LogOut]);

  const profilePhoto = useMemo(() => {
    if (typeof user?.profile_photo === "string" && user.profile_photo.trim()) {
      return { uri: user.profile_photo };
    }

    return FALLBACK_AVATAR;
  }, [user?.profile_photo]);

  const renderDrawerContent = useCallback(
    (props) => {
      const activeTab =
        getFocusedRouteNameFromRoute(props.state.routes[props.state.index]) || "Home";

      return (
        <View style={styles.drawerContainer}>
          <View style={[styles.profileHeader, { paddingTop: insets.top + spacing.lg }]}>
            <Image source={profilePhoto} style={styles.avatar} />
            <Text style={styles.welcomeText}>Welcome back</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || "Guest User"}
            </Text>
            <View style={styles.metaRow}>
              <View style={styles.metaChip}>
                <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
                <Text style={styles.metaChipText}>{readNestedName(user?.role, "User")}</Text>
              </View>
              <View style={styles.metaChip}>
                <Ionicons name="business-outline" size={14} color={colors.success} />
                <Text style={styles.metaChipText}>
                  {readNestedName(user?.department, "Department")}
                </Text>
              </View>
            </View>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || "No email available"}
            </Text>
          </View>

          <View style={styles.navList}>
            {DRAWER_LINKS.map((item) => {
              const isActive = activeTab === item.key;

              return (
                <Pressable
                  key={item.key}
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("MainTabs", {
                      screen: item.key,
                    });
                  }}
                  style={({ pressed }) => [
                    styles.drawerItem,
                    isActive && styles.drawerItemActive,
                    pressed && styles.drawerItemPressed,
                  ]}
                >
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={isActive ? colors.primary : colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.drawerLabel,
                      isActive && styles.drawerLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <Pressable
              onPress={handleLogOut}
              style={({ pressed }) => [
                styles.logoutItem,
                pressed && styles.drawerItemPressed,
              ]}
            >
              <Ionicons name="log-out-outline" size={22} color={colors.danger} />
              <Text style={styles.logoutLabel}>Logout</Text>
            </Pressable>
            <Text style={styles.versionText}>App Version 1.0.0</Text>
          </View>

          <LoaderCard visible={logoutPending || loading} message="Logging Out..." />
        </View>
      );
    },
    [handleLogOut, insets.bottom, insets.top, loading, logoutPending, profilePhoto, user]
  );

  return (
    <Drawer.Navigator
      initialRouteName="MainTabs"
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        swipeEdgeWidth: 48,
        overlayColor: "rgba(15, 23, 42, 0.22)",
        drawerStyle: styles.drawerStyle,
      }}
    >
      <Drawer.Screen name="MainTabs" component={TabNavigation} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerStyle: {
    width: 320,
    backgroundColor: colors.surface,
  },
  drawerContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  profileHeader: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  welcomeText: {
    fontFamily: "Jost-Medium",
    fontSize: 13,
    color: colors.textMuted,
  },
  userName: {
    marginTop: 4,
    fontFamily: "Jost-Bold",
    fontSize: 22,
    color: colors.text,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    ...shadows.soft,
  },
  metaChipText: {
    fontFamily: "Jost-SemiBold",
    fontSize: 12,
    color: colors.text,
  },
  userEmail: {
    marginTop: spacing.md,
    fontFamily: "Jost-Regular",
    fontSize: 13,
    color: colors.textMuted,
  },
  navList: {
    flex: 1,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    marginBottom: 6,
  },
  drawerItemActive: {
    backgroundColor: "rgba(79, 152, 243, 0.12)",
  },
  drawerItemPressed: {
    opacity: 0.82,
  },
  drawerLabel: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: colors.textMuted,
  },
  drawerLabelActive: {
    color: colors.primary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
  },
  logoutLabel: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: colors.danger,
  },
  versionText: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    textAlign: "center",
    fontFamily: "Jost-Regular",
    fontSize: 12,
    color: colors.textMuted,
  },
});

export default DrawerNavigation;
