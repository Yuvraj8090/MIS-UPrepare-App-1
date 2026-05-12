import React, { useCallback, useMemo, useState } from "react";
import { View, Image, Text, StyleSheet, Pressable } from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAuth } from "./AuthContext/AuthContext";
import TabNavigation from "./TabNavigation";
import LoaderCard from "@/components/LoaderCard";
import { colors, radius, shadows, spacing } from "@/constants/theme";

const Drawer = createDrawerNavigator();
const FALLBACK_AVATAR = require("../assets/images/user.jpg");

const formatLabel = (value, fallback = "-") => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
};

const readNestedName = (value, fallback = "-") => {
  if (typeof value === "string") {
    return formatLabel(value, fallback);
  }

  if (value && typeof value === "object" && typeof value.name === "string") {
    return formatLabel(value.name, fallback);
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

  const drawerContent = useCallback(
    (props) => (
      <View style={styles.drawerContainer}>
        <View style={[styles.profileHeader, { paddingTop: insets.top + spacing.lg }]}>
          <Image source={profilePhoto} style={styles.avatar} />

          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.userName} numberOfLines={1}>
            {formatLabel(user?.name, "Guest User")}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
              <Text style={styles.metaChipText}>
                {readNestedName(user?.role, "User")}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <Ionicons name="business-outline" size={14} color={colors.success} />
              <Text style={styles.metaChipText}>
                {readNestedName(user?.department, "Department")}
              </Text>
            </View>
          </View>

          <Text style={styles.userEmail} numberOfLines={1}>
            {formatLabel(user?.email, "No email available")}
          </Text>
        </View>

        <View style={styles.navList}>
          <DrawerItemList {...props} />
        </View>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <DrawerItem
            label="Logout"
            labelStyle={styles.logoutLabel}
            onPress={handleLogOut}
            icon={({ color }) => (
              <Ionicons name="log-out-outline" size={22} color={color} />
            )}
            style={styles.logoutItem}
            inactiveTintColor={colors.danger}
          />
        </View>

        <LoaderCard show={logoutPending || loading} text="Logging Out..." />
      </View>
    ),
    [insets.bottom, loading, logoutPending, profilePhoto, user, handleLogOut]
  );

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={drawerContent}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        swipeEdgeWidth: 60,
        drawerStyle: styles.drawerStyle,
        drawerActiveBackgroundColor: "rgba(79, 152, 243, 0.12)",
        drawerActiveTintColor: "#4f98f3",
        drawerInactiveTintColor: colors.textMuted,
        drawerLabelStyle: styles.drawerLabel,
        drawerItemStyle: styles.drawerItem,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigation}
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />
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
    width: 74,
    height: 74,
    borderRadius: 37,
    marginBottom: spacing.md,
    backgroundColor: colors.border,
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
    paddingTop: spacing.sm,
  },
  drawerItem: {
    marginHorizontal: spacing.sm,
    marginVertical: 4,
    borderRadius: radius.md,
  },
  drawerLabel: {
    marginLeft: -8,
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  logoutItem: {
    borderRadius: radius.md,
  },
  logoutLabel: {
    marginLeft: -8,
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
  },
});

export default DrawerNavigation;
