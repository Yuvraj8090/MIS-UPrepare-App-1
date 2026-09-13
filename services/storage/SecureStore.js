import * as SecureStore from "expo-secure-store";

export async function savetoSS(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getFromSS(key) {
  return await SecureStore.getItemAsync(key);
}

export async function deleteFromSS(key) {
  await SecureStore.deleteItemAsync(key);
}

const SESSION_KEYS = ["authToken", "refreshToken", "authSessionMeta"];

export async function clearSecureSessionStore() {
  await Promise.allSettled(SESSION_KEYS.map((key) => deleteFromSS(key)));
}
