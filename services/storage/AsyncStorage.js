import AsyncStorage from "@react-native-async-storage/async-storage";

const saveStorageData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {}
};

const storeExpoToken = async (value) => {
  try {
    await saveStorageData("expoToken", value);
  } catch (e) {}
};

const getStorageData = async (key) => {
  try {
    var data = await AsyncStorage.getItem(key);
    console.log("DATA ASYNC:", data);
    return JSON.parse(data);
  } catch (e) {}
};

const getExpoToken = async () => {
  return await getStorageData("expoToken");
};

const removeAllData = async () => {
  try {
    // if (!key) {
    //   return;
    // }
    await AsyncStorage.clear();
    // await AsyncStorage.removeItem();
  } catch (e) {
    console.log("Error for " + key, e);
  }
};

const storeImage = async (key, uri) => {
  try {
    const existingQueue = await AsyncStorage.getItem(key);
    let newQueue = JSON.parse(existingQueue) || [];
    newQueue.push(uri);
    await AsyncStorage.setItem(key, JSON.stringify(newQueue));
    setImageQueue(newQueue);
    console.log("Image added to upload queue");
  } catch (error) {
    console.error("Error adding image to queue: ", error);
  }
};

export {
  getStorageData,
  getExpoToken,
  saveStorageData,
  storeExpoToken,
  removeAllData,
  storeImage,
};
