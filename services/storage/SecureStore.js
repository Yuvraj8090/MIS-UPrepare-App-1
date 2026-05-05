import * as SecureStore from "expo-secure-store";

export async function savetoSS(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export async function getFromSS(key) {
  let result = await SecureStore.getItemAsync(key);

  console.log(`SS for key: ${key} —`, result);
  return result;
}

export async function deleteFromSS(key) {
  await SecureStore.deleteItemAsync(key);
}
