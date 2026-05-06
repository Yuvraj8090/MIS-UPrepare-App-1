import React, { useState } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext/AuthContext";
import { userLogOut } from "../services/api/fetch";
import TabNavigation from "./TabNavigation";
import LoaderCard from "@/components/LoaderCard";
import { SafeAreaView } from "react-native-safe-area-context";

const Drawer = createDrawerNavigator();
const { width } = Dimensions.get("window");

const DrawerNavigation = () => {
  const { user, userToken, LogOut, setLoading } = useAuth();
  const [load, setLoad] = useState(false);

  const handleLogOut = async () => {
    setLoad(true);
    setLoading(true);

    await userLogOut(userToken)
      .then(() => {
        LogOut();
      })
      .catch((error) => {
        console.error("Error::", error);
      });
    setLoad(false);
    setLoading(false);
  };

  function CustomDrawerContent(props) {
    return (
      <SafeAreaView edges={["top", "bottom"]} style={styles.drawerSafeArea}>
        <View style={styles.drawerShell}>
          <View style={styles.profile}>
            <View style={styles.imgview}>
              <Image
                style={styles.img}
                source={require("../assets/images/user.jpg")}
              />
            </View>
            <View style={styles.userView}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.userNameText} numberOfLines={2}>
                Hi, {user ? user?.name : "Guest"}
              </Text>
            </View>
          </View>
          <View style={styles.drawerMenuBlock}>
            <DrawerItemList {...props} />
          </View>

          <View style={styles.footerBlock}>
            <DrawerItem
              style={styles.logoutItem}
              label="Logout"
              labelStyle={styles.logoutLabel}
              onPress={handleLogOut}
              icon={() => (
                <MaterialCommunityIcons name={"logout"} size={22} color="#b42318" />
              )}
            />
          </View>
        </View>
        <LoaderCard show={load} text={"Logging Out..."} />
      </SafeAreaView>
    );
  }

  const CustomDrawerLabel = ({ label }) => {
    return <Text style={styles.drawerLabel}>{label}</Text>;
  };

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        swipeEdgeWidth: 48,
        drawerStyle: styles.drawerStyle,
        drawerActiveBackgroundColor: "#e8f1fb",
        drawerActiveTintColor: "#0b57a4",
        drawerInactiveTintColor: "#475569",
        drawerItemStyle: styles.drawerItem,
        drawerLabelStyle: styles.drawerItemLabel,
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigation}
        options={{
          drawerLabel: () => <CustomDrawerLabel label="Dashboard" />,
          drawerIcon: () => (
            <MaterialCommunityIcons name={"view-dashboard-outline"} size={22} color="#0b57a4" />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerSafeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  drawerShell: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 8,
  },
  drawerStyle: {
    width: Math.min(width * 0.82, 320),
    backgroundColor: "#ffffff",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginTop: 4,
    marginBottom: 8,
    borderRadius: 18,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  drawerMenuBlock: {
    flex: 1,
    marginTop: 6,
  },
  footerBlock: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  drawerItem: {
    marginHorizontal: 2,
    marginVertical: 2,
    borderRadius: 14,
  },
  drawerItemLabel: {
    marginLeft: -12,
  },
  drawerLabel: {
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: "#0f172a",
  },
  logoutItem: {
    marginHorizontal: 2,
    marginVertical: 0,
    borderRadius: 14,
    backgroundColor: "#fff5f5",
  },
  logoutLabel: {
    marginLeft: -12,
    fontFamily: "Jost-SemiBold",
    fontSize: 15,
    color: "#b42318",
  },
  imgview: {
    borderRadius: 999,
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    backgroundColor: "#e2e8f0",
  },
  img: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  userView: {
    marginLeft: 12,
    marginRight: 6,
    flex: 1,
  },
  welcomeText: {
    fontFamily: "Jost-Medium",
    fontSize: 12,
    color: "#64748b",
  },
  userNameText: {
    marginTop: 2,
    fontFamily: "Jost-SemiBold",
    fontSize: 16,
    lineHeight: 21,
    color: "#0f172a",
  },
});

export default DrawerNavigation;
