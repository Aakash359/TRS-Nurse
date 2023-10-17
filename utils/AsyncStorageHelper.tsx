import AsyncStorage from "@react-native-async-storage/async-storage";

export const USER_ACCESS_TOKEN = "userAccessToken";
export const USER_CATALYST_TOKEN = "userCatalystToken";
export const USER_DATA = "userData";
export const DEVICE_ID = "deviceID";

export async function removePreference(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // error
  }
}

export async function setPreferences(key: string, value: any) {
  try {
    if (value === "" || value === null) await AsyncStorage.setItem(key, value);
    else await AsyncStorage.setItem(key, value);
  } catch (error) {
    // error
  }
}

export async function getPreferences(key: string, defaultValue = null) {
  let value = null;
  try {
    value = await AsyncStorage.getItem(key);
  } catch (error) {
    // error
  }

  if (value === null) {
    return defaultValue;
  }
  return value;
}

export async function clearLogOutPreferences() {
  let error = false;
  const removeKeys = [
    USER_ACCESS_TOKEN,
    USER_CATALYST_TOKEN,
    USER_DATA
  ];
  try {
    await AsyncStorage.multiRemove(removeKeys);
  } catch (e) {
    error = true;
    // remove error
  }

  return !error;
}
