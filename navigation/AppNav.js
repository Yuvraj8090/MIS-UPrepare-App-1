// AppNav.js

import AuthStack from "./AuthStack";
import { useAuth } from "./AuthContext/AuthContext";
import NetInfo from "@react-native-community/netinfo";
import DrawerNavigation from "./DrawerNavigation";
import { useEffect, useState } from "react";
import { getStorageData } from "@/services/storage/AsyncStorage";
import { ToastAndroid } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import {
  fetchAccessToken,
  fetchUserData,
  initDB,
} from "@/services/database/database";
import { getFromSS } from "@/services/storage/SecureStore";
import { NavigationContainer } from "@react-navigation/native";
import AnimatedSplash from "./SplashScreen";

const AppNav = () => {
  const {
    user,
    userToken,
    checkLogin,
    checkBiometricAvailability,
    handleBiometricAuth,
    isBiometricAvailable,
    setUser,
    LocalCheck,
    loading,
    setLoading,
  } = useAuth();

  // console.log("first USER ::", user);
  console.log("TOKENN USER AppNav::", userToken);

  const [isInternet, setIsInternet] = useState(true);

  // Subscribe to NetInfo to check internet connection status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsInternet(state?.isConnected);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    initDB();
    // checkBiometricAvailability();
    // checkLogin();
    // fetchUserData().then((res) => {
    //   console.log("USERR RSSS ::", res);
    // });
    // fetchAccessToken().then((res) => {
    //   console.log("Tokennn RSSS ::", res);
    // });
  }, []);

  // const AppStatup = async () => {
  //   try {
  //     // const userData = await getStorageData("userDetails");
  //     const authToken = await getFromSS("authToken");
  //     console.log("User Data:", authToken);

  //     if (isInternet) {
  //       console.log("Internet connection available");
  //       // Perform biometric or login check if userData exists
  //       if (authToken) {
  //         if (isBiometricAvailable) {
  //           await handleBiometricAuth();
  //         } else {
  //           await checkLogin();
  //         }
  //       }
  //     } else {
  //       console.log("No internet connection");
  //       LocalCheck();
  //     }
  //   } catch (error) {
  //     console.error("Error during app startup:", error);
  //   }
  // };

  // useEffect(() => {
  //   AppStatup();
  // }, [isBiometricAvailable, isInternet]);

  if (loading) {
    return <AnimatedSplash onFinish={() => setLoading(false)} />;
  }

  console.log("LOADINGG ::", loading);

  return (
    <>
      <SQLiteProvider databaseName="u_prepare_app.db">
        <NavigationContainer>
          {user ? <DrawerNavigation /> : <AuthStack />}
        </NavigationContainer>
      </SQLiteProvider>
    </>
  );
};

export default AppNav;
