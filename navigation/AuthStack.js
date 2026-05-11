import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Auth/Login";
import RegisterScreen from "../screens/Auth/Register";
import OTPScreen from "../screens/Auth/OTP";
import ForgotScreen from "../screens/ForgotScreen";
import ResetPassword from "../screens/Auth/ResetPassword";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

const Stack = createStackNavigator();

const headerLeft = (navigation) => (
  <Pressable
    accessibilityRole="button"
    onPress={() => navigation.goBack()}
    style={{
      backgroundColor: "#fff",
      padding: 10,
      borderRadius: 10,
      marginLeft: 16,
    }}
  >
    <Feather name="arrow-left-circle" size={28} color="black" />
  </Pressable>
);

const AuthStack = () => {
  const NetConnected = NetInfo.useNetInfo();

  const [netCheck, setNetCheck] = useState(null);

  useEffect(() => {
    setNetCheck(NetConnected?.isConnected);
  }, [NetConnected?.isConnected]);

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
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => headerLeft(navigation),
        })}
        component={RegisterScreen}
      />
      <Stack.Screen
        name="OTPScreen"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => headerLeft(navigation),
        })}
        component={OTPScreen}
      />
      <Stack.Screen
        name="ForgotScreen"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => headerLeft(navigation),
        })}
        component={ForgotScreen}
      />
      <Stack.Screen
        name="ResetPassword"
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: "",
          headerTransparent: true,
          headerLeft: () => headerLeft(navigation),
        })}
        component={ResetPassword}
      />
    </Stack.Navigator>
  );
};

export default AuthStack;
