import React, { useState, useCallback } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Context & Services
import { useAuth } from "./AuthContext/AuthContext";
import { removeAllData } from "../services/storage/AsyncStorage";
import { userLogOut } from "../services/api/fetch";
import { deleteFromSS, getFromSS } from "../services/storage/SecureStore";

// Components
import TabNavigation from "./TabNavigation";
import Navigation from "./Navigation"; // Your Stack Navigator
import LoaderCard from "@/components/LoaderCard";

// Mock Components (Replace with actual imports if needed)
const ProfileScreen = () => <View style={{ flex: 1, backgroundColor: "#fff" }} />;
const SettingsScreen = () => <View style={{ flex: 1, backgroundColor: "#fff" }} />;

const Drawer = createDrawerNavigator();

// Enforce capitalized first letter only
const formatUsername = (name) => {
  if (!name || typeof name !== "string") return "Guest User";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "Guest User";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const DrawerNavigation = () => {
  const { user, LogOut, setLoading } = useAuth();
  const [load, setLoad] = useState(false);
  const insets = useSafeAreaInsets();

  const handleLogOut = async () => {
    try {
      setLoad(true);
      setLoading(true);
      
      const token = await getFromSS("authToken");
      if (token) {
        await userLogOut(token);
      }
    } catch (error) {
      console.error("[DrawerNavigation] Logout Error:", error);
    } finally {
      // Always clear data and logout locally even if API fails
      LogOut();
      removeAllData();
      deleteFromSS("authToken");
      setLoad(false);
      setLoading(false);
    }
  };

  const CustomDrawerContent = useCallback((props) => {
    return (
      <View style={styles.drawerContainer}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require("../assets/images/user.jpg")}
            />
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName} numberOfLines={1}>
              {formatUsername(user?.name)}
            </Text>
            {/* Optional: Add Role or Department if available */}
            <Text style={styles.userRole} numberOfLines={1}>
               {user?.role?.name || user?.department || "User"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Scrollable Navigation List */}
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>

        {/* Fixed Footer for Logout */}
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <DrawerItem
            label="Logout"
            labelStyle={styles.logoutLabel}
            onPress={handleLogOut}
            icon={({ size }) => (
              <Ionicons name="log-out-outline" size={24} color="#EF4444" />
            )}
            style={styles.logoutItem}
            activeOpacity={0.7}
          />
          <Text style={styles.versionText}>App Version 1.0.0</Text>
        </View>

        {/* Ensure props match your LoaderCard implementation */}
        <LoaderCard visible={load} message={"Logging Out..."} />
      </View>
    );
  }, [user, load, insets]);

  return (
    <Drawer.Navigator
      initialRouteName="DashboardScreen"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "#EFF6FF", // Subtle Premium Blue
        drawerActiveTintColor: "#2563EB", // Primary Blue
        drawerInactiveTintColor: "#4B5563", // Dark Gray
        drawerLabelStyle: {
          fontFamily: "Jost-SemiBold",
          fontSize: 15,
          marginLeft: -10, // Aligns text perfectly with Ionicons
        },
        drawerItemStyle: {
          borderRadius: 10,
          marginHorizontal: 12,
          paddingVertical: 2,
          marginVertical: 4, 
        },
      }}
    >
      <Drawer.Screen
        name="DashboardScreen"
        component={TabNavigation}
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color }) => (
            <Ionicons name="grid" size={22} color={color} />
          ),
        }}
      />
      
      {/* 
        REDIRECT FIX: 
        Because you are using the same 'Navigation' stack for multiple Drawer screens, 
        you must pass initialParams to tell the stack WHICH screen to open.
        Replace "AllPackagesScreen" with your actual screen name inside Navigation.
      */}
      <Drawer.Screen
        name="Packages"
        component={Navigation}
        initialParams={{ screen: "AllPackagesScreen" }} 
        options={{
          drawerLabel: "Packages",
          drawerIcon: ({ color }) => (
            <Ionicons name="cube" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="UpdateProgress"
        component={Navigation}
        initialParams={{ screen: "UpdateProgressScreen" }} 
        options={{
          drawerLabel: "Update Progress",
          drawerIcon: ({ color }) => (
            <Ionicons name="cloud-upload" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Work"
        component={Navigation}
        initialParams={{ screen: "WorkProgressScreen" }} 
        options={{
          drawerLabel: "Work Progress",
          drawerIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={22} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "My Profile",
          drawerIcon: ({ color }) => (
            <Ionicons name="person-circle" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color }) => (
            <Ionicons name="settings" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// ------------------------------------------------------------------
// Professional Stylesheet
// ------------------------------------------------------------------
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: "#F9FAFB",
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  avatar: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: "center",
  },
  welcomeText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  userName: {
    fontFamily: "Jost-Bold",
    fontSize: 18,
    color: "#111827",
  },
  userRole: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#3B82F6",
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  logoutItem: {
    borderRadius: 10,
    marginVertical: 0,
    backgroundColor: "#FEF2F2", // Very light red background
  },
  logoutLabel: {
    fontFamily: "Jost-SemiBold",
    color: "#EF4444", 
    fontSize: 15,
    marginLeft: -10, 
  },
  versionText: {
    fontFamily: "Jost-Medium",
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 16,
  },
});

export default DrawerNavigation;