// AuthContext.js

import * as React from "react";

import { ToastAndroid, BackHandler, Platform } from "react-native";
import { userDetails, verifyOTP } from "../../services/api/fetch";
import {
  deleteFromSS,
  getFromSS,
  savetoSS,
} from "../../services/storage/SecureStore";
import {
  getStorageData,
  removeAllData,
  saveStorageData,
} from "../../services/storage/AsyncStorage";
import * as LocalAuthentication from "expo-local-authentication";
import {
  clearDB,
  fetchAccessToken,
  fetchUserData,
} from "@/services/database/database";
import NetInfo from "@react-native-community/netinfo";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [userToken, setUserToken] = React.useState(null);
  const [showLCard, setShowLCard] = React.useState(false);
  const [isAppStart, setIsAppStart] = React.useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // useEffect(() => {
  //   checkBiometricAvailability();
  // }, []);

  // React.useEffect(() => {
  //   if (!isInternet) {

  //     LocalCheck();
  //   }
  // }, [isInternet]);

  const LocalCheck = async () => {
    console.log("LOCALL CHECK");
    try {
      const res = await fetchUserData();
      console.log("USERRR RSSS ::", res);
      if (res) {
        setUser(res[0]);
        saveStorageData("userDetails", res[0]);
        fetchAccessToken().then((res) => {
          console.log("Tokennn RSSS ::", res);
          savetoSS("authToken", res?.access_token);
          setUserToken(res?.access_token);
        });
      }
    } catch (error) {
      console.log("Error :", error);
    }
  };

  const checkBiometricAvailability = async () => {
    const available =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());

    // const supportedTypes =
    //   await LocalAuthentication.supportedAuthenticationTypesAsync();
    // console.log(
    //   "Supportt TYpe ::",
    //   supportedTypes.includes(
    //     LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION
    //   )
    // );
    setIsBiometricAvailable(available);
  };

  const handleBiometricAuth = async () => {
    const userData = await getStorageData("userDetails");

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with biometrics",
        cancelLabel: "Cancel",
      });

      if (result?.success) {
        if (userData) checkLogin();
        ToastAndroid.show("Authentication succeeded", ToastAndroid.LONG);
      } else {
        ToastAndroid.show("Authentication Failed", ToastAndroid.LONG);
        BackHandler?.exitApp();
      }
    } catch (error) {
      console.error("Authentication error:", error);

      ToastAndroid.show(
        "Could not authenticate using biometrics",
        ToastAndroid.LONG
      );
    }
  };

  const LogIn = async (data) => {
    //   // Implement your login logic here
    console.log("USER DATA :", data);
    // setUserToken(data?.token);
    setUser(data);
    // setUser("Login");
    setIsAppStart(false);
  };

  React.useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    console.log("CALLING CHECKLOGIN API.......");
    setLoading(true);
    // setShowLCard(true);

    // const data = await getStorageData("userDetails");
    const authToken = await getFromSS("authToken");
    console.log("AUTH TOKENNNNNLL :", authToken);

    if (!authToken) {
      console.log("No token found, logging out...");
      LogOut();
      setLoading(false);
      return;
    }

    const isInternet = await NetInfo.fetch();

    try {
      if (isInternet?.isConnected) {
        const res = await userDetails(authToken);
        console.log("USER DATA :", res);

        if (res?.data?.user) {
          console.log("Access Token Received:-", authToken);
          console.log("User Data api/Me Received:-", res?.data?.user);
          await savetoSS("authToken", authToken);

          setUser(res?.data?.user);
          setUserToken(authToken);
          setShowLCard(false);
          setLoading(false);
        } else {
          // setUser(null);
          // setUserToken(null);
          // removeAllData();
          // deleteFromSS("authToken");
          // ToastAndroid.show(
          //   "Your Session Expired!! Please Log-In Again",
          //   ToastAndroid.LONG
          // );
          // setShowLCard(false);
          setLoading(false);
        }
      } else {
        // LocalCheck();
        console.log("CALL LOCAL");
        setLoading(false);
      }
    } catch (error) {
      console.log("Check User Method Error: ", error);
    } finally {
      setShowLCard(false);
      setLoading(false);
    }
  };

  // const validateOTP = async (data) => {
  //   setShowLCard(true);

  //   console.log("Data from Verify OTP Method of Auth Context!", data);

  //   try {
  //     const resp = await verifyOTP(data);

  //     ToastAndroid.show(resp.data.msg, ToastAndroid.LONG);

  //     if (resp?.authToken) {
  //       console.log("Access Token Received:-", resp.data.access_token);
  //       await savetoSS("authToken", resp.data.access_token);

  //       setUser(resp.data.user);
  //       setUserToken(resp.data.access_token);
  //     }
  //   } catch (error) {
  //     console.log("Validate OTP Method Error: ", error);
  //   } finally {
  //     setShowLCard(false);
  //   }
  // };

  const LogOut = async () => {
    // Implement your logout logic here
    setUser(null);
    setUserToken(null);
    setIsAppStart(false);
    removeAllData();
    deleteFromSS("authToken");
    clearDB();
    // ToastAndroid.show(
    //   "Your Session Expired!! Please Log-In Again",
    //   ToastAndroid.LONG
    // );
  };

  // value={{ user, setUser, signOut }}

  return (
    <AuthContext.Provider
      value={{
        user,
        LogIn,
        LogOut,
        setUser,
        showLCard,
        userToken,
        isAppStart,
        // validateOTP,
        setShowLCard,
        setUserToken,
        setIsAppStart,
        checkLogin,
        checkBiometricAvailability,
        handleBiometricAuth,
        isBiometricAvailable,
        LocalCheck,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  return React.useContext(AuthContext);
};

export { AuthProvider, useAuth };
