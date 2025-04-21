// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLsPHbsL5k3HHVdqMquZDp9DHTOkJw_vc",
  authDomain: "tryimage-7f4c2.firebaseapp.com",
  databaseURL: "https://tryimage-7f4c2-default-rtdb.firebaseio.com",
  projectId: "tryimage-7f4c2",
  storageBucket: "tryimage-7f4c2.appspot.com",
  messagingSenderId: "596495961648",
  appId: "1:596495961648:web:8c40ab715d252728c027f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
export {auth};