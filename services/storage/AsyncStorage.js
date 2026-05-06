import AsyncStorage from "@react-native-async-storage/async-storage";

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

const saveStorageData = async (key, value) => {
  try {
    const serialisedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, serialisedValue);
  } catch (error) {
    console.log(`Error saving async storage key ${key}`, error);
  }
};

const storeExpoToken = async (value) => {
  await saveStorageData("expoToken", value);
};

const getStorageData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return parseStoredValue(value);
  } catch (error) {
    console.log(`Error reading async storage key ${key}`, error);
    return null;
  }
};

const getExpoToken = async () => {
  return await getStorageData("expoToken");
};

const removeAllData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log("Error clearing async storage", error);
  }
};

const storeImage = async (key, uri) => {
  const existingQueue = (await getStorageData(key)) || [];
  const nextQueue = [...existingQueue, uri];
  await saveStorageData(key, nextQueue);
  return nextQueue;
};

export {
  getStorageData,
  getExpoToken,
  saveStorageData,
  storeExpoToken,
  removeAllData,
  storeImage,
};
