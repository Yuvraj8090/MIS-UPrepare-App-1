import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/Login";
import RegisterScreen from "../screens/Auth/Register";
import OTPScreen from "../screens/Auth/OTP";
import ForgotScreen from "../screens/ForgotScreen";
import ResetPassword from "../screens/Auth/ResetPassword";
import { View, Platform, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { CheckInternet } from "@/services/helper";

import { LayoutAnimation, UIManager } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

const AuthStack = (props) => {
  const navigation = useNavigation();

  const NetConnected = NetInfo.useNetInfo();

  const [netCheck, setNetCheck] = useState(null);

  useEffect(() => {
    setNetCheck(NetConnected?.isConnected);
  }, [NetConnected?.isConnected]);

  // if (Platform.OS === "android") {
  //   if (UIManager.setLayoutAnimationEnabledExperimental) {
  //     UIManager.setLayoutAnimationEnabledExperimental(true);
  //   }
  // }

  // const toggleShow = () => {
  //   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  //   setNetCheck(NetConnected?.isConnected);
  // };

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: ({ current, next, layouts }) => ({
          cardStyle: {
            transform: [
              {
                translateX: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [layouts.screen.width, 0],
                }),
              },
              {
                scale: next
                  ? next.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0.9],
                    })
                  : 1,
              },
            ],
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5],
            }),
          },
        }),
      }}
    >
      <Stack.Screen
        name="LoginScreen"
        options={{
          headerShown: true,
          header: () => (
            <>
              {!netCheck && (
                <View
                  style={{
                    backgroundColor: "red",
                    alignItems: "center",
                    paddingVertical: "0.5%",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Jost-Medium",
                      color: "#fff",
                      fontSize: 12,
                    }}
                  >
                    No Internet Connectivity!!
                  </Text>
                </View>
              )}
            </>
          ),
        }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="RegisterScreen"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <View
              onTouchEnd={() => navigation.goBack()}
              style={{
                backgroundColor: "#fff",
                padding: "3%",
                borderRadius: 10,
                // alignSelf: "flex-start",
                marginLeft: "20%",
              }}
            >
              <Feather name="arrow-left-circle" size={28} color="black" />
            </View>
          ),
        }}
        component={RegisterScreen}
      />
      <Stack.Screen
        name="OTPScreen"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <View
              onTouchEnd={() => navigation.goBack()}
              style={{
                backgroundColor: "#fff",
                padding: "3%",
                borderRadius: 10,
                // alignSelf: "flex-start",
                marginLeft: "20%",
              }}
            >
              <Feather name="arrow-left-circle" size={28} color="black" />
            </View>
          ),
        }}
        component={OTPScreen}
      />
      <Stack.Screen
        name="ForgotScreen"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <View
              onTouchEnd={() => navigation.goBack()}
              style={{
                backgroundColor: "#fff",
                padding: "3%",
                borderRadius: 10,
                // alignSelf: "flex-start",
                marginLeft: "20%",
              }}
            >
              <Feather name="arrow-left-circle" size={28} color="black" />
            </View>
          ),
        }}
        component={ForgotScreen}
      />
      <Stack.Screen
        name="ResetPassword"
        options={{
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => (
            <View
              onTouchEnd={() => navigation.goBack()}
              style={{
                backgroundColor: "#fff",
                padding: "3%",
                borderRadius: 10,
                // alignSelf: "flex-start",
                marginLeft: "20%",
              }}
            >
              <Feather name="arrow-left-circle" size={28} color="black" />
            </View>
          ),
        }}
        component={ResetPassword}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
