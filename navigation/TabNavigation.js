import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Octicons, MaterialIcons, FontAwesome6 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Navigation from "./Navigation";
import AppHeader from "@/components/AppHeader/AppHeader";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon, label }) => (
  <View style={styles.tabIconWrap}>
    {icon(focused)}
    <Text
      style={[
        styles.tabLabel,
        focused ? styles.tabLabelActive : styles.tabLabelInactive,
      ]}
      numberOfLines={2}
    >
      {label}
    </Text>
  </View>
);

const TabNavigation = (props) => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName={props?.route?.name == "Update" ? "UpdateProgress" : "Home"}
      screenOptions={{
        header: () => <AppHeader Title={"U-PREPARE"} />,
        headerShown: true,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 66 + Math.max(insets.bottom, 8),
            paddingTop: 7,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ],
      }}
    >
      <Tab.Screen
        name="Home"
        component={Navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Dashboard"
              icon={(active) => (
                <MaterialIcons
                  name="space-dashboard"
                  size={24}
                  color={active ? "#0b57a4" : "#7b8794"}
                />
              )}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Packages"
        component={Navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Packages"
              icon={(active) => (
                <Octicons
                  name="package"
                  size={22}
                  color={active ? "#0b57a4" : "#7b8794"}
                />
              )}
            />
          ),
        }}
      />

      <Tab.Screen
        name="UpdateProgress"
        component={Navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Update Progress"
              icon={(active) => (
                <Octicons
                  name="upload"
                  size={22}
                  color={active ? "#0b57a4" : "#7b8794"}
                />
              )}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Work"
        component={Navigation}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label="Work Progress"
              icon={(active) => (
                <FontAwesome6
                  name="chart-line"
                  size={22}
                  color={active ? "#0b57a4" : "#7b8794"}
                />
              )}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  tabIconWrap: {
    minWidth: 74,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 4,
  },
  tabLabel: {
    fontFamily: "Jost-SemiBold",
    fontSize: 11,
    lineHeight: 14,
    textAlign: "center",
  },
  tabLabelActive: {
    color: "#0b57a4",
  },
  tabLabelInactive: {
    color: "#7b8794",
  },
});

export default TabNavigation;
