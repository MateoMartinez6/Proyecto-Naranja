import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAtC2wTrNHLc7aCW-cj2Ksg2q2RPQApHZs",
  authDomain: "libropedia-f69f8.firebaseapp.com",
  databaseURL: "https://libropedia-f69f8-default-rtdb.firebaseio.com",
  projectId: "libropedia-f69f8",
  storageBucket: "libropedia-f69f8.appspot.com",
  appId: "1:103020737380:android:ef1199a77261f52cfd8071"
};

const app = initializeApp(firebaseConfig);

// 🔹 Configuración segura para Auth en React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const db = getDatabase(app);




