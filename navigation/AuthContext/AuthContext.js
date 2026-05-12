import * as React from "react";
import { Alert, BackHandler, Platform, ToastAndroid } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";

import { userDetails } from "../../services/api/fetch";
import {
  getStorageData,
  removeAllData,
  saveStorageData,
} from "../../services/storage/AsyncStorage";
import {
  clearDB,
  fetchAccessToken,
  fetchUserData,
} from "@/services/database/database";
import {
  clearAuthSession,
  getAuthBootstrapState,
  saveAuthSession,
} from "@/services/auth/tokenStorage";
import { getCurrentRouteSnapshot } from "@/navigation/navigationRef";

const AuthContext = React.createContext();
const AUTH_REDIRECT_STATE_KEY = "authRedirectState";
const EXPIRED_TOKEN_MESSAGE = "Invalid or expired token";

const showFeedbackMessage = (message) => {
  if (!message) {
    return;
  }

  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.LONG);
    return;
  }

  Alert.alert("U-PREPARE", message);
};

const normaliseExpiry = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 10_000_000_000 ? value : Date.now() + value * 1000;
  }

  if (typeof value === "string") {
    const parsedDate = Date.parse(value);

    if (!Number.isNaN(parsedDate)) {
      return parsedDate;
    }

    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return numeric > 10_000_000_000 ? numeric : Date.now() + numeric * 1000;
    }
  }

  return null;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [userToken, setUserToken] = React.useState(null);
  const [showLCard, setShowLCard] = React.useState(false);
  const [isAppStart, setIsAppStart] = React.useState(true);
  const [isBiometricAvailable, setIsBiometricAvailable] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState("");
  const authExpiryHandledRef = React.useRef(false);

  const clearSessionState = React.useCallback(() => {
    setUser(null);
    setUserToken(null);
    setShowLCard(false);
    setIsAppStart(false);
  }, []);

  const clearSession = React.useCallback(async () => {
    await Promise.allSettled([clearAuthSession(), removeAllData(), clearDB()]);
    clearSessionState();
  }, [clearSessionState]);

  const LocalCheck = React.useCallback(async () => {
    try {
      const res = await fetchUserData();

      if (res?.[0]) {
        setUser(res[0]);
        await saveStorageData("userDetails", { user: res[0] });
      }

      const tokenData = await fetchAccessToken();
      if (tokenData?.access_token) {
        setUserToken(tokenData.access_token);
      }
    } catch (error) {
      console.log("Local session recovery error:", error);
    }
  }, []);

  const checkBiometricAvailability = React.useCallback(async () => {
    const available =
      (await LocalAuthentication.hasHardwareAsync()) &&
      (await LocalAuthentication.isEnrolledAsync());

    setIsBiometricAvailable(available);
  }, []);

  const runApiValidation = React.useCallback(async (tokenArg = null) => {
    const activeToken = tokenArg || userToken;

    if (!activeToken) {
      return {
        ok: false,
        status: 401,
        message: "No authentication token available.",
      };
    }

    try {
      const response = await userDetails(activeToken);
      const nextUser = response?.data?.user ?? null;

      if (nextUser) {
        return {
          ok: true,
          status: response?.status || 200,
          user: nextUser,
        };
      }

      return {
        ok: false,
        status: response?.status || 401,
        message:
          response?.data?.msg ||
          response?.data?.message ||
          "Session validation failed.",
      };
    } catch (error) {
      return {
        ok: false,
        status: error?.response?.status || 500,
        message:
          error?.response?.data?.msg ||
          error?.message ||
          "Unable to validate your session right now.",
      };
    }
  }, [userToken]);

  const completeLoginSession = React.useCallback(async (sessionData) => {
    const token = sessionData?.token || sessionData?.access_token || null;
    const nextUser = sessionData?.user || null;

    if (!token || !nextUser) {
      throw new Error("Login response is missing a user or token.");
    }

    const expiresAt = normaliseExpiry(
      sessionData?.expires || sessionData?.expires_at || sessionData?.expiresAt
    );

    await saveAuthSession(sessionData, expiresAt ? { expiresAt } : {});

    setUserToken(token);
    setUser(nextUser);
    setAuthError("");
    setIsAppStart(false);

    return {
      token,
      user: nextUser,
    };
  }, []);

  const LogIn = React.useCallback(async (data) => {
    if (data?.token || data?.access_token) {
      return await completeLoginSession(data);
    }

    setUser(data?.user ?? data);
    setIsAppStart(false);
    return {
      token: null,
      user: data?.user ?? data,
    };
  }, [completeLoginSession]);

  const LogOut = React.useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const handleSessionExpired = React.useCallback(
    async (message) => {
      if (authExpiryHandledRef.current) {
        return;
      }

      authExpiryHandledRef.current = true;
      const routeSnapshot = getCurrentRouteSnapshot();

      await clearSession();

      if (routeSnapshot?.name && routeSnapshot.name !== "LoginScreen") {
        await saveStorageData(AUTH_REDIRECT_STATE_KEY, {
          route: routeSnapshot,
          triggeredAt: Date.now(),
        });
      }

      setAuthError(message || "Your session has expired. Please log in again.");

      setTimeout(() => {
        authExpiryHandledRef.current = false;
      }, 400);
    },
    [clearSession]
  );

  const checkLogin = React.useCallback(async () => {
    setLoading(true);
    setAuthError("");

    try {
      const bootstrapState = await getAuthBootstrapState();
      const networkState = await NetInfo.fetch();

      if (!bootstrapState?.token) {
        clearSessionState();
        return;
      }

      setUserToken(bootstrapState.token);
      setUser(bootstrapState.user || null);

      if (!networkState?.isConnected) {
        setIsAppStart(false);
        return;
      }

      const validation = await runApiValidation(bootstrapState.token);

      if (validation.ok && validation.user) {
        await completeLoginSession({
          ...(bootstrapState.user ? { user: validation.user } : {}),
          token: bootstrapState.token,
          user: validation.user,
          expiresAt: bootstrapState.expiresAt,
        });
        return;
      }

      setAuthError(validation.message || "Your session has expired.");
      await clearSession();
    } catch (error) {
      console.log("Check User Method Error:", error);
      setAuthError(
        error?.message || "We could not restore your session. Please log in again."
      );
      clearSessionState();
    } finally {
      setShowLCard(false);
      setLoading(false);
      setIsAppStart(false);
    }
  }, [clearSession, clearSessionState, completeLoginSession, runApiValidation]);

  const handleBiometricAuth = React.useCallback(async () => {
    const userData = await getStorageData("userDetails");

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate with biometrics",
        cancelLabel: "Cancel",
      });

      if (result?.success) {
        if (userData) {
          await checkLogin();
        }
        showFeedbackMessage("Authentication succeeded");
      } else {
        showFeedbackMessage("Authentication failed");
        if (Platform.OS === "android") {
          BackHandler.exitApp();
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      showFeedbackMessage("Could not authenticate using biometrics");
    }
  }, [checkLogin]);

  React.useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  React.useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const statusCode = error?.response?.status;
        const responseMessage =
          error?.response?.data?.message ||
          error?.response?.data?.msg ||
          error?.message ||
          "";

        if (
          statusCode === 401 &&
          typeof responseMessage === "string" &&
          responseMessage
            .toLowerCase()
            .includes(EXPIRED_TOKEN_MESSAGE.toLowerCase())
        ) {
          await handleSessionExpired(responseMessage);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [handleSessionExpired]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userToken,
        loading,
        showLCard,
        isAppStart,
        isBiometricAvailable,
        authError,
        setUser,
        setUserToken,
        setLoading,
        setShowLCard,
        setIsAppStart,
        LogIn,
        LogOut,
        checkLogin,
        checkBiometricAvailability,
        handleBiometricAuth,
        LocalCheck,
        runApiValidation,
        completeLoginSession,
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
