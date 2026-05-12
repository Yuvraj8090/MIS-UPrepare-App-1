import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons"; // Unified Icon Library

import Navigation from "./Navigation";
import { useAuth } from "./AuthContext/AuthContext";
import AppHeader from "@/components/AppHeader/AppHeader";

const Tab = createBottomTabNavigator();

// 1. Data-Driven Configuration with Active/Inactive States
const TAB_SCREENS = [
  {
    name: "Home",
    label: "Dashboard",
    component: Navigation,
    activeIcon: "grid",
    inactiveIcon: "grid-outline",
  },
  {
    name: "Packages",
    label: "Packages",
    component: Navigation,
    activeIcon: "cube",
    inactiveIcon: "cube-outline",
  },
  {
    name: "UpdateProgress",
    label: "Update Progress",
    component: Navigation,
    activeIcon: "cloud-upload",
    inactiveIcon: "cloud-upload-outline",
  },
  {
    name: "Work",
    label: "Work Progress",
    component: Navigation,
    activeIcon: "bar-chart",
    inactiveIcon: "bar-chart-outline",
  },
];

const TabNavigation = ({ route }) => {
  const { user } = useAuth();
  const insets = useSafeAreaInsets(); 

  // Secure fallback for initial route
  const initialRoute = route?.name === "Update" ? "UpdateProgress" : "Home";

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        header: () => <AppHeader Title={"U-PREPARE"} />,
        headerShown: true,
        tabBarShowLabel: true, 
        tabBarActiveTintColor: "#4f98f3",
        tabBarInactiveTintColor: "#8e8e93", // Standard iOS inactive gray for better contrast
        
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f0f0f0",
          height: 70 + (insets.bottom || 0), 
          paddingBottom: insets.bottom ? insets.bottom + 5 : 12,
          paddingTop: 10,
        },
        
        tabBarLabelStyle: {
          fontSize: 10, 
          fontFamily: "Jost-SemiBold",
          marginTop: 4,
          textAlign: "center",
        },
        
        tabBarItemStyle: {
          flex: 1, 
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {TAB_SCREENS.map((screen) => {
        const { name, label, component, activeIcon, inactiveIcon } = screen;
        
        return (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarLabel: label,
              tabBarLabelPosition: 'below-icon',
              // Dynamically switch icon based on 'focused' state
              tabBarIcon: ({ color, focused }) => (
                <Ionicons 
                  name={focused ? activeIcon : inactiveIcon} 
                  size={24} // Standard native tab bar icon size
                  color={color} 
                />
              ),
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default TabNavigation;