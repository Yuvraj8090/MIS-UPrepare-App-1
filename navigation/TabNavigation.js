import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Navigation from "./Navigation";
import AppHeader from "@/components/AppHeader/AppHeader"; 
import { colors, shadows } from "@/constants/theme";
import { animationTimings } from "@/constants/animations";

const Tab = createBottomTabNavigator();

const TAB_SCREENS = [
  {
    name: "Home",
    label: "Dashboard",
    component: Navigation,
    // Add the specific screen name from your Navigation stack here
    initialParams: { screen: "DashboardScreen" }, 
    activeIcon: "grid",
    inactiveIcon: "grid-outline",
  },
  {
    name: "Packages",
    label: "Packages",
    component: Navigation,
    initialParams: { screen: "AllPackagesScreen" },
    activeIcon: "cube",
    inactiveIcon: "cube-outline",
  },
  {
    name: "UpdateProgress",
    label: "Update",
    component: Navigation,
    initialParams: { screen: "UpdateProgressScreen" },
    activeIcon: "cloud-upload",
    inactiveIcon: "cloud-upload-outline",
  },
  {
    name: "Work",
    label: "Progress",
    component: Navigation,
    initialParams: { screen: "WorkProgressScreen" },
    activeIcon: "bar-chart",
    inactiveIcon: "bar-chart-outline",
  },
];

const TabNavigation = ({ route }) => {
  const insets = useSafeAreaInsets();
  const initialRoute = route?.name === "Update" ? "UpdateProgress" : "Home";

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      // Access navigation dynamically from screenOptions callback
      screenOptions={({ navigation }) => ({
        // Ensure GoBack and navigation are passed so the back button actually works
        header: () => (
          <AppHeader 
            Title="U-PREPARE" 
            GoBack={true} 
            navigation={navigation} 
          />
        ),
        headerShown: true,
        animation: "shift",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: animationTimings?.standard || 300,
          },
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#2563EB", // Standardized to your premium blue
        tabBarInactiveTintColor: "#6B7280", // Standardized to your premium gray
        tabBarStyle: {
          backgroundColor: colors.surface || "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: colors.border || "#E5E7EB",
          height: 65 + (insets.bottom || 0),
          paddingBottom: insets.bottom ? insets.bottom : 8,
          paddingTop: 8,
          ...shadows?.soft,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Jost-Medium",
          marginTop: 2,
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      })}
    >
      {TAB_SCREENS.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          initialParams={screen.initialParams}
          options={{
            tabBarLabel: screen.label,
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? screen.activeIcon : screen.inactiveIcon}
                size={24}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

export default TabNavigation;