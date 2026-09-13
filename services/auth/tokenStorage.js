import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import endpoints from "@/services/api/endpoints";
import { refreshUserToken } from "@/services/api/fetch";

const ACCESS_TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const SESSION_META_KEY = "authSessionMeta";
const USER_DETAILS_KEY = "userDetails";

const FIFTEEN_DAYS_IN_MS = 15 * 24 * 60 * 60 * 1000;
const TOKEN_EXPIRY_BUFFER_MS = 60 * 1000;
const isWeb = Platform.OS === "web";

const getWebStorage = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  return window.localStorage;
};

const parseJson = (value) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

const writePlainValue = async (key, value) => {
  if (isWeb) {
    const storage = getWebStorage();

    if (!storage) {
      return;
    }

    storage.setItem(key, value);
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

const readPlainValue = async (key) => {
  if (isWeb) {
    const storage = getWebStorage();
    return storage ? storage.getItem(key) : null;
  }

  return await SecureStore.getItemAsync(key);
};

const deletePlainValue = async (key) => {
  if (isWeb) {
    const storage = getWebStorage();

    if (storage) {
      storage.removeItem(key);
    }

    return;
  }

  await SecureStore.deleteItemAsync(key);
};

const writeJsonValue = async (key, value) => {
  const serialisedValue = JSON.stringify(value);

  if (isWeb) {
    const storage = getWebStorage();

    if (!storage) {
      return;
    }

    storage.setItem(key, serialisedValue);
    return;
  }

  await AsyncStorage.setItem(key, serialisedValue);
};

const readJsonValue = async (key) => {
  if (isWeb) {
    const storage = getWebStorage();
    return parseJson(storage ? storage.getItem(key) : null);
  }

  return parseJson(await AsyncStorage.getItem(key));
};

const deleteJsonValue = async (key) => {
  if (isWeb) {
    const storage = getWebStorage();

    if (storage) {
      storage.removeItem(key);
    }

    return;
  }

  await AsyncStorage.removeItem(key);
};

const normaliseSessionPayload = (sessionData = {}) => {
  const token = sessionData?.token || sessionData?.access_token || null;
  const refreshToken =
    sessionData?.refresh_token || sessionData?.refreshToken || null;
  const user = sessionData?.user || null;

  return {
    token,
    refreshToken,
    user,
    raw: sessionData,
  };
};

export const saveAuthSession = async (sessionData, options = {}) => {
  const { token, refreshToken, user, raw } = normaliseSessionPayload(sessionData);

  if (!token) {
    throw new Error("Cannot store auth session without an access token.");
  }

  const storedAt = Date.now();
  const expiresAt =
    options?.expiresAt || storedAt + (options?.ttlMs || FIFTEEN_DAYS_IN_MS);

  await writePlainValue(ACCESS_TOKEN_KEY, token);

  if (refreshToken) {
    await writePlainValue(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    await deletePlainValue(REFRESH_TOKEN_KEY);
  }

  await writeJsonValue(SESSION_META_KEY, {
    storedAt,
    expiresAt,
    hasRefreshToken: Boolean(refreshToken),
  });

  if (raw && Object.keys(raw).length > 0) {
    await writeJsonValue(USER_DETAILS_KEY, raw);
  } else if (user) {
    await writeJsonValue(USER_DETAILS_KEY, { user });
  }

  return {
    token,
    refreshToken,
    user,
    storedAt,
    expiresAt,
  };
};

export const clearAuthSession = async () => {
  await Promise.allSettled([
    deletePlainValue(ACCESS_TOKEN_KEY),
    deletePlainValue(REFRESH_TOKEN_KEY),
    deleteJsonValue(SESSION_META_KEY),
    deleteJsonValue(USER_DETAILS_KEY),
  ]);
};

export const getStoredSessionMeta = async () => {
  return (await readJsonValue(SESSION_META_KEY)) || null;
};

export const isStoredTokenValid = async () => {
  const meta = await getStoredSessionMeta();

  if (!meta?.expiresAt) {
    return false;
  }

  return Date.now() + TOKEN_EXPIRY_BUFFER_MS < Number(meta.expiresAt);
};

export const getStoredUserDetails = async () => {
  return await readJsonValue(USER_DETAILS_KEY);
};

export const getStoredRefreshToken = async () => {
  return await readPlainValue(REFRESH_TOKEN_KEY);
};

export const getStoredTokenIfValid = async () => {
  const tokenIsValid = await isStoredTokenValid();

  if (!tokenIsValid) {
    return null;
  }

  return await readPlainValue(ACCESS_TOKEN_KEY);
};

export const refreshAuthSession = async () => {
  const refreshToken = await getStoredRefreshToken();

  if (!refreshToken) {
    return {
      ok: false,
      status: 401,
      message: "No refresh token available.",
    };
  }

  if (!endpoints.refresh || typeof refreshUserToken !== "function") {
    return {
      ok: false,
      status: 501,
      message: "Refresh endpoint is not configured.",
    };
  }

  const response = await refreshUserToken(refreshToken);
  const responseData = response?.data ?? {};
  const nextToken = responseData?.token || responseData?.access_token;

  if (response?.status >= 200 && response?.status < 300 && nextToken) {
    const saved = await saveAuthSession(
      {
        ...responseData,
        refresh_token:
          responseData?.refresh_token ||
          responseData?.refreshToken ||
          refreshToken,
      },
      {
        ttlMs: FIFTEEN_DAYS_IN_MS,
      }
    );

    return {
      ok: true,
      status: response.status,
      token: saved.token,
      user: saved.user,
      message:
        responseData?.message ||
        responseData?.msg ||
        "Session refreshed successfully.",
    };
  }

  return {
    ok: false,
    status: response?.status || 500,
    message:
      responseData?.message ||
      responseData?.msg ||
      "Unable to refresh your session.",
  };
};

export const getValidAccessToken = async () => {
  const currentToken = await getStoredTokenIfValid();

  if (currentToken) {
    return {
      token: currentToken,
      refreshed: false,
      expired: false,
    };
  }

  const refreshResult = await refreshAuthSession();

  if (refreshResult.ok && refreshResult.token) {
    return {
      token: refreshResult.token,
      refreshed: true,
      expired: true,
      user: refreshResult.user || null,
    };
  }

  await clearAuthSession();

  return {
    token: null,
    refreshed: false,
    expired: true,
    refreshFailed: true,
    message: refreshResult.message,
  };
};

export const getAuthBootstrapState = async () => {
  const tokenState = await getValidAccessToken();
  const storedUserDetails = await getStoredUserDetails();

  return {
    ...tokenState,
    user:
      tokenState.user ||
      storedUserDetails?.user ||
      storedUserDetails ||
      null,
  };
};

export {
  ACCESS_TOKEN_KEY,
  FIFTEEN_DAYS_IN_MS,
  REFRESH_TOKEN_KEY,
  SESSION_META_KEY,
  USER_DETAILS_KEY,
};
