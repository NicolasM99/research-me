import "./app/assets/styles/containers.css";
import "./app/assets/styles/button.css";
import "./app/assets/styles/tag.css";
import React, { useState, useEffect } from "react";
import { firebaseApp, firestore } from "./app/firebase/Firebase";
import AppRouter from "./app/routes/AppRouter";
const _firebaseApp = firebaseApp; //Initialize app
const db = firestore;
const App = () => {
  return <AppRouter />;
};

export default App;
