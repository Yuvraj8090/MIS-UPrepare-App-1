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
    label: "Update",
    component: Navigation,
    activeIcon: "cloud-upload",
    inactiveIcon: "cloud-upload-outline",
  },
  {
    name: "Work",
    label: "Progress",
    component: Navigation,
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
      screenOptions={{
        header: () => <AppHeader Title="U-PREPARE" />,
        headerShown: true,
        animation: "shift",
        transitionSpec: {
          animation: "timing",
          config: {
            duration: animationTimings.standard,
          },
        },
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#4f98f3",
        tabBarInactiveTintColor: "#8e8e93",
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 72 + (insets.bottom || 0),
          paddingBottom: insets.bottom ? insets.bottom + 6 : 12,
          paddingTop: 10,
          ...shadows.soft,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Jost-SemiBold",
          marginTop: 2,
          textAlign: "center",
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      {TAB_SCREENS.map((screen) => (
        <Tab.Screen
          key={screen.name}
          name={screen.name}
          component={screen.component}
          options={{
            tabBarLabel: screen.label,
            tabBarLabelPosition: "below-icon",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? screen.activeIcon : screen.inactiveIcon}
                size={22}
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
