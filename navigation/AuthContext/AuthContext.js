import * as React from "react";
import { BackHandler, ToastAndroid } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import NetInfo from "@react-native-community/netinfo";
import { userDetails } from "../../services/api/fetch";
import { getFromSS } from "../../services/storage/SecureStore";
import { getStorageData } from "../../services/storage/AsyncStorage";
import { validateApiAvailability } from "@/services/api/fetch";
import { clearRuntimeAppData } from "@/services/session/runtimeCleanup";

const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [userToken, setUserToken] = React.useState(null);
  const [showLCard, setShowLCard] = React.useState(false);
  const [isAppStart, setIsAppStart] = React.useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [apiAvailable, setApiAvailable] = React.useState(true);
  const [apiStatusLoading, setApiStatusLoading] = React.useState(false);
  const [apiErrorMessage, setApiErrorMessage] = React.useState("");

  const clearSession = React.useCallback(async () => {
    await clearRuntimeAppData();
    setUser(null);
    setUserToken(null);
  }, []);

  const runApiValidation = React.useCallback(async (token = null) => {
    setApiStatusLoading(true);

    const response = await validateApiAvailability(token);
    setApiAvailable(response.ok);
    setApiErrorMessage(response.ok ? "" : response.message);

    if (!response.ok) {
      await clearRuntimeAppData();
      setUser(null);
      setUserToken(null);
    }

    setApiStatusLoading(false);
    return response;
  }, []);

  const bootstrapApp = React.useCallback(async () => {
    setLoading(true);

    // Always start from a clean runtime to avoid stale cached tokens/data.
    await clearSession();
    await runApiValidation();

    setIsAppStart(false);
    setLoading(false);
  }, [clearSession, runApiValidation]);

  React.useEffect(() => {
    bootstrapApp();
  }, [bootstrapApp]);

  React.useEffect(() => {
    if (user && userToken) {
      runApiValidation(userToken);
    }
  }, [runApiValidation, user, userToken]);

  const checkBiometricAvailability = async () => {
    const available =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());

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
        if (userData) {
          checkLogin();
        }
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
    setUser(data?.user ?? data);
    setUserToken(data?.token ?? null);
    setIsAppStart(false);
  };

  const checkLogin = async () => {
    setLoading(true);

    const authToken = await getFromSS("authToken");

    if (!authToken) {
      await clearSession();
      setLoading(false);
      return;
    }

    const networkState = await NetInfo.fetch();

    try {
      if (networkState?.isConnected) {
        const apiStatus = await runApiValidation(authToken);

        if (!apiStatus.ok) {
          setLoading(false);
          return;
        }

        const res = await userDetails(authToken);

        if (res?.data?.user) {
          setUser(res?.data?.user);
          setUserToken(authToken);
        } else {
          await clearSession();
        }
      } else {
        setApiAvailable(false);
        setApiErrorMessage("No internet connection. API validation failed.");
      }
    } catch (error) {
      console.log("Check User Method Error: ", error);
    } finally {
      setShowLCard(false);
      setLoading(false);
    }
  };

  const LogOut = async () => {
    await clearSession();
    setIsAppStart(false);
  };

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
        setShowLCard,
        setUserToken,
        setIsAppStart,
        checkLogin,
        checkBiometricAvailability,
        handleBiometricAuth,
        isBiometricAvailable,
        loading,
        setLoading,
        apiAvailable,
        apiStatusLoading,
        apiErrorMessage,
        runApiValidation,
        clearSession,
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
