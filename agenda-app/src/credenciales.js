// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCv0-jRngjEpGN9XOgxHoL5MXpDgi0Afg",
  authDomain: "agendaweb-9c671.firebaseapp.com",
  projectId: "agendaweb-9c671",
  storageBucket: "agendaweb-9c671.appspot.com",
  messagingSenderId: "436410747042",
  appId: "1:436410747042:web:558bb74aef2749f0e46ffb"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;