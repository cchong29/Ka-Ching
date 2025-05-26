// Import the functions you need from the SDKs you need
import {getAuth} from 'firebase/auth'
import { initializeApp } from 'firebase/app';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// CONFIDENTIAL DO NOT EXPOSE
const firebaseConfig = {
  apiKey: "AIzaSyB9pdSsbSWUXeTzKEWA-QH5ZzmUQaSsu90",
  authDomain: "orbital-25-62c13.firebaseapp.com",
  projectId: "orbital-25-62c13",
  storageBucket: "orbital-25-62c13.firebasestorage.app",
  messagingSenderId: "1040827223886",
  appId: "1:1040827223886:web:374e902f53fe2cf359d81f",
  measurementId: "G-N9Z9PS3JQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// export const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });

// Client IDs for android/ios applications
// IOS: 584112744657-3sl3ral3534lbamdsnkjor25f4dpi85e.apps.googleusercontent.com
// Android: 584112744657-18c09sas36oo0pbfh0jqe1lloo5cmcn6.apps.googleusercontent.com

// Web Client ID: 1040827223886-4j1a2dp5omc5ouvmf5cuc0564rg60tf5.apps.googleusercontent.com