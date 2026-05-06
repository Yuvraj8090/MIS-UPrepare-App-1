import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  ToastAndroid,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialCommunityIcons, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "./AuthContext/AuthContext";
import { userLogOut } from "../services/api/fetch";
import AppHeader from "../components/AppHeader/AppHeader";
import TabNavigation from "./TabNavigation";
import LoaderCard from "@/components/LoaderCard";

import NetInfo from "@react-native-community/netinfo";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator();
const { width, height } = Dimensions.get("window");

const DrawerNavigation = () => {
  const { user, userToken, LogOut, setLoading } = useAuth();
  const [load, setLoad] = useState(false);
  const navigation = useNavigation();

  const netinfo = NetInfo.useNetInfo();
  console.log("INFOOO :", netinfo);

  const [image, setImage] = useState(
    `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/2048px-No_image_available.svg.png`
  );

  const handleLogOut = async (props) => {
    setLoad(true);
    setLoading(true);

    await userLogOut(userToken)
      .then((data) => {
        LogOut();
        setLoad(false);
      })
      .catch((error) => {
        console.error("Error::", error);
      });
    setLoad(false);
    setLoading(false);
  };

  function CustomDrawerContent(props) {
    return (
      <View
        style={{
          justifyContent: "space-between",
          flex: 1,
          // backgroundColor: "green",
          marginTop: "16.5%",
          padding: "2%",
        }}
      >
        <View style={{ backgroundColor: "", flex: 0.95 }}>
          <View style={styles.profile}>
            <View style={styles.imgview}>
              <Image
                style={styles.img}
                source={require("../assets/images/user.jpg")}
                // source={{
                //   uri: image,
                // }}
              />
            </View>
            <View style={styles.userView}>
              <Text style={{ fontFamily: "Jost-Medium" }}>Welcome, </Text>
              <Text style={{ fontFamily: "Jost-SemiBold" }}>
                Hi, {user ? user?.name : "Guest"}
                {/* Hi, {user?.name} */}
              </Text>
            </View>
          </View>
          <DrawerItemList {...props} />
          <DrawerItem
            style={
              {
                // backgroundColor: "green",
                // position: "absolute",
                // bottom: 0,
                // width: "100%",
              }
            }
            label="Logout"
            labelStyle={{
              fontFamily: "Jost-Medium",
              color: "#000",
              fontSize: 15,
            }}
            onPress={handleLogOut}
            icon={() => <MaterialCommunityIcons name={"logout"} size={24} />}
          />
        </View>

        <LoaderCard show={load} text={"Logging Out..."} />
      </View>
    );
  }

  const CustomDrawerLabel = ({ label }) => {
    return <Text style={{ fontFamily: "Jost-Medium" }}>{label}</Text>;
  };

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      //   screenOptions={{ header: AppHeader }}
      //   screenOptions={{ header: () => <AppHeader /> }}
      //   screenOptions={{ headerShown: true }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigation}
        options={{
          // header: () => <AppHeader Title={"U-PREPARE"} />,
          headerShown: false,
          drawerLabel: ({ focused, color }) => (
            <CustomDrawerLabel label="Dashboard" />
          ),
          drawerIcon: () => (
            <MaterialCommunityIcons name={"view-dashboard"} size={24} />
          ),
        }}
      />
      {/* <Drawer.Screen
        name="Update"
        component={TabNavigation}
        options={{
          header: () => <AppHeader Title={"U-PREPARE"} />,
          headerShown: true,
          drawerLabel: ({ focused, color }) => (
            <CustomDrawerLabel label="Update Progress" />
          ),
          drawerIcon: () => (
            <FontAwesome6 name="edit" size={20} color="black" />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  profile: {
    alignItems: "center",
    padding: 10,
    marginTop: "2%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  imgview: {
    borderRadius: 100,
    width: width * 0.2,
    height: width * 0.2,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  img: {
    resizeMode: "contain",
    width: "100%",
    height: "100%",
  },
  userView: {
    marginRight: 10,
    width: "60%",
  },
  username: {
    fontSize: 20,
    fontFamily: "Jost-Medium",
  },
  gmailtext: {
    fontSize: 12,
  },
  fieldSet: {
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    width: width * 0.6,
    alignSelf: "center",
  },
  legend: {
    position: "absolute",
    top: -10,
    left: 10,
    fontFamily: "Jost-SemiBold",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 5,
    zIndex: 1,
    fontSize: 12,
    color: "#ccc",
  },
});

export default DrawerNavigation;
