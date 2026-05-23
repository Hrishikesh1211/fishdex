import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

type SupabaseStorage = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const secureStoreOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export const supabaseSessionStorage: SupabaseStorage = {
  async getItem(key) {
    if (Platform.OS === "web") {
      return AsyncStorage.getItem(key);
    }

    return SecureStore.getItemAsync(key);
  },
  async setItem(key, value) {
    if (Platform.OS === "web") {
      await AsyncStorage.setItem(key, value);
      return;
    }

    await SecureStore.setItemAsync(key, value, secureStoreOptions);
  },
  async removeItem(key) {
    if (Platform.OS === "web") {
      await AsyncStorage.removeItem(key);
      return;
    }

    await SecureStore.deleteItemAsync(key);
  },
};
