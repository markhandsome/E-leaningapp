import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your new Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDb5m3wsWJem0tJbnj5jl4rbKmKv7fAICY",
  authDomain: "tipmart-df090.firebaseapp.com",
  databaseURL: "https://tipmart-df090-default-rtdb.firebaseio.com",
  projectId: "tipmart-df090",
  storageBucket: "tipmart-df090.appspot.com",
  messagingSenderId: "68574960768",
  appId: "1:68574960768:web:4b21d30ed1283d93e81a65",
  measurementId: "G-LWXNHPL17Q"
};

// ✅ Prevent duplicate app initialization
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);



export { auth, app };
export const db = getFirestore(app);
