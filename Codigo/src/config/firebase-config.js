// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // <-- Agregado para Firestore

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBUy1uhs2XwzjX7gK98Ku1Uvx3v2u7cyag",
  authDomain: "libropedia-de11f.firebaseapp.com",
  databaseURL: "https://libropedia-de11f-default-rtdb.firebaseio.com",
  projectId: "libropedia-de11f",
  storageBucket: "libropedia-de11f.firebasestorage.app",
  messagingSenderId: "682901201893",
  appId: "1:682901201893:web:cae925df6723fb465b450c",
  measurementId: "G-VK63F75L75"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializa y exporta los servicios que usarás
export const db = getFirestore(app); // <-- Inicializa y exporta la base de datos

// Ahora puedes importar 'db' en cualquier componente para usar Firestore.
