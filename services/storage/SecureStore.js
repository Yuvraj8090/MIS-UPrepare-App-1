import * as SecureStore from "expo-secure-store";

const sessionSecrets = new Map();

// Sensitive values are held only in memory for the active session.
export async function savetoSS(key, value) {
  sessionSecrets.set(key, value);

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(`Unable to remove persisted secure key ${key}`, error);
  }
}

export async function getFromSS(key) {
  if (sessionSecrets.has(key)) {
    return sessionSecrets.get(key);
  }

  try {
    const legacyValue = await SecureStore.getItemAsync(key);

    if (legacyValue !== null) {
      await SecureStore.deleteItemAsync(key);
    }

    return legacyValue;
  } catch (error) {
    console.log(`Unable to read secure key ${key}`, error);
    return null;
  }
}

export async function deleteFromSS(key) {
  sessionSecrets.delete(key);

  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(`Unable to delete secure key ${key}`, error);
  }
}

export async function clearSecureSessionStore() {
  const keys = Array.from(sessionSecrets.keys());
  sessionSecrets.clear();

  await Promise.allSettled(keys.map((key) => SecureStore.deleteItemAsync(key)));
  await Promise.allSettled(["authToken"].map((key) => SecureStore.deleteItemAsync(key)));
}
