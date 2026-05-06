import AsyncStorage from "@react-native-async-storage/async-storage";

const sessionStore = new Map();

// Session-only storage: values live in memory and are wiped on startup/logout.
const saveStorageData = async (key, value) => {
  sessionStore.set(key, value);
};

const storeExpoToken = async (value) => {
  await saveStorageData("expoToken", value);
};

const getStorageData = async (key) => {
  return sessionStore.has(key) ? sessionStore.get(key) : null;
};

const getExpoToken = async () => {
  return await getStorageData("expoToken");
};

const removeAllData = async () => {
  sessionStore.clear();

  try {
    // Also purge any legacy persisted storage left by older builds.
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing async storage", error);
  }
};

const storeImage = async (key, uri) => {
  const existingQueue = sessionStore.get(key) || [];
  existingQueue.push(uri);
  sessionStore.set(key, existingQueue);
  return existingQueue;
};

export {
  getStorageData,
  getExpoToken,
  saveStorageData,
  storeExpoToken,
  removeAllData,
  storeImage,
};
