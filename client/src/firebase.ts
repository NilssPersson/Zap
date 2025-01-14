import { initializeApp } from "firebase/app";
import { getPerformance } from "firebase/performance";
import { getDatabase } from "firebase/database";
import type { Database } from "firebase/database";
import config from "@/config";

/**
 * Firebase configuration object
 * Maps our config values to Firebase's expected format
 */
const firebaseConfig = {
  apiKey: config.FIREBASE.API_KEY,
  authDomain: config.FIREBASE.AUTH_DOMAIN,
  projectId: config.FIREBASE.PROJECT_ID,
  storageBucket: config.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE.MESSAGING_SENDER_ID,
  appId: config.FIREBASE.APP_ID,
  databaseURL: config.FIREBASE.DATABASE_URL,
  measurementId: config.FIREBASE.MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database: Database = getDatabase(app);
const perf = getPerformance(app);

export { database, perf };
