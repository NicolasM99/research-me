import firebase from "firebase/app";
import "firebase/auth";
import "firebase/storage";
import "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";
export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebase.firestore();
