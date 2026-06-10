import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCKU3WI6bXYJC_9UV4kdMMRT4oc19eLUt0",
  authDomain: "bitcodelms.firebaseapp.com",
  databaseURL: "https://bitcodelms-default-rtdb.firebaseio.com",
  projectId: "bitcodelms",
  storageBucket: "bitcodelms.firebasestorage.app",
  messagingSenderId: "146517506079",
  appId: "1:146517506079:web:01fbd3cafc76e6343bfd2a",
  measurementId: "G-DRK2DQYMLH"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;