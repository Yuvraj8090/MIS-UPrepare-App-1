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
} from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons"; // Unified Icon Library
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Context & Services
import { useAuth } from "./AuthContext/AuthContext";
import { removeAllData } from "../services/storage/AsyncStorage";
import { userLogOut } from "../services/api/fetch";
import { deleteFromSS, getFromSS } from "../services/storage/SecureStore";

// Components
import TabNavigation from "./TabNavigation";
import Navigation from "./Navigation"; // Used for your inner screens
import LoaderCard from "@/components/LoaderCard";

// Mock Components for extra routes (Replace these with your actual screen imports if needed)
const ProfileScreen = () => <View style={{ flex: 1, backgroundColor: "#fff" }} />;
const SettingsScreen = () => <View style={{ flex: 1, backgroundColor: "#fff" }} />;

const Drawer = createDrawerNavigator();

// Utility function to strictly enforce capitalized first letter only
const formatUsername = (name) => {
  if (!name || typeof name !== "string") return "Guest User";
  const trimmed = name.trim();
  if (trimmed.length === 0) return "Guest User";
  
  // Capitalizes the first letter, and makes the rest of the string lowercase
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
      
      LogOut();
      removeAllData();
      deleteFromSS("authToken");
    } catch (error) {
      console.error("[DrawerNavigation] Logout Error:", error);
      LogOut(); 
      removeAllData();
      deleteFromSS("authToken");
    } finally {
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
            <Text style={styles.welcomeText}>Welcome,</Text>
            {/* Formatted Username Display */}
            <Text style={styles.userName} numberOfLines={1}>
              {formatUsername(user?.name)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Scrollable Navigation List */}
        <View style={styles.navList}>
          <DrawerItemList {...props} />
        </View>

        {/* Fixed Footer for Logout */}
        <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
          <DrawerItem
            label="Logout"
            labelStyle={styles.logoutLabel}
            onPress={handleLogOut}
            icon={({ size }) => (
              <Ionicons name="log-out-outline" size={24} color="#DC2626" />
            )}
            style={styles.logoutItem}
            activeOpacity={0.7}
          />
        </View>

        <LoaderCard show={load} text={"Logging Out..."} />
      </View>
    );
  }, [user, load, insets, handleLogOut]);

  return (
    <Drawer.Navigator
      initialRouteName="DashboardScreen"
      drawerContent={CustomDrawerContent}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: "rgba(79, 152, 243, 0.1)",
        drawerActiveTintColor: "#4f98f3",
        drawerInactiveTintColor: "#4B5563",
        drawerLabelStyle: {
          fontFamily: "Jost-Medium",
          fontSize: 15,
          marginLeft: -10, // Perfect visual alignment for Ionicons
        },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: 12,
          paddingVertical: 2,
          marginVertical: 4, 
        },
      }}
    >
      {/* Route 1: Dashboard (Main Tab Navigator) */}
      <Drawer.Screen
        name="DashboardScreen"
        component={TabNavigation}
        options={{
          drawerLabel: "Dashboard",
          drawerIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={22} color={color} />
          ),
        }}
      />
      
      {/* Route 2: Packages */}
      <Drawer.Screen
        name="Packages"
        component={Navigation}
        options={{
          drawerLabel: "Packages",
          drawerIcon: ({ color }) => (
            <Ionicons name="cube-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Route 3: Update Progress */}
      <Drawer.Screen
        name="UpdateProgress"
        component={Navigation}
        options={{
          drawerLabel: "Update Progress",
          drawerIcon: ({ color }) => (
            <Ionicons name="cloud-upload-outline" size={24} color={color} />
          ),
        }}
      />

      {/* Route 4: Work Progress */}
      <Drawer.Screen
        name="Work"
        component={Navigation}
        options={{
          drawerLabel: "Work Progress",
          drawerIcon: ({ color }) => (
            <Ionicons name="bar-chart-outline" size={22} color={color} />
          ),
        }}
      />

      {/* Visual Separator conceptually ends here, additional app routes below */}

      {/* Route 5: Profile */}
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          drawerLabel: "My Profile",
          drawerIcon: ({ color }) => (
            <Ionicons name="person-outline" size={22} color={color} />
          ),
        }}
      />

      {/* Route 6: Settings */}
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerLabel: "App Settings",
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

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
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  userName: {
    fontFamily: "Jost-SemiBold",
    fontSize: 18,
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginBottom: 8,
  },
  navList: {
    flex: 1,
    paddingTop: 8,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  logoutItem: {
    borderRadius: 8,
    marginVertical: 0,
  },
  logoutLabel: {
    fontFamily: "Jost-SemiBold",
    color: "#DC2626", 
    fontSize: 15,
    marginLeft: -10, 
  },
});

export default DrawerNavigation;