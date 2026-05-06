import * as SecureStore from "expo-secure-store";

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  getStoredRefreshToken,
  getValidAccessToken,
} from "@/services/auth/tokenStorage";

const parseStoredValue = (value) => {
  if (typeof value !== "string") {
    return value ?? null;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export async function savetoSS(key, value) {
  try {
    const serialisedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await SecureStore.setItemAsync(key, serialisedValue);
  } catch (error) {
    console.log(`Unable to save secure key ${key}`, error);
  }
}

export async function getFromSS(key) {
  try {
    if (key === ACCESS_TOKEN_KEY) {
      const tokenState = await getValidAccessToken();
      return tokenState.token;
    }

    if (key === REFRESH_TOKEN_KEY) {
      return await getStoredRefreshToken();
    }

    return parseStoredValue(await SecureStore.getItemAsync(key));
  } catch (error) {
    console.log(`Unable to read secure key ${key}`, error);
    return null;
  }
}

export async function deleteFromSS(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(`Unable to delete secure key ${key}`, error);
  }
}

export async function clearSecureSessionStore() {
  await Promise.allSettled(
    [ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY].map((key) =>
      SecureStore.deleteItemAsync(key)
    )
  );
}
