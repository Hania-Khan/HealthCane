import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAiUFUl-50t2rXrOSSff491oRwfHfVyk74",
  authDomain: "healthcane.firebaseapp.com",
  projectId: "healthcane",
  storageBucket: "healthcane.appspot.com",
  messagingSenderId: "459740854347",
  appId: "1:459740854347:web:ca338be2a5765388f3b5ce",
  measurementId: "G-X5LBJW9SC9",
};
console.log("Connected with FireBase");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { db, auth, app };
