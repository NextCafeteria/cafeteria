import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  appId: process.env.FIREBASE_APP_ID,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
};

let dbInstance = null;
export class DatabaseService {
  constructor() {
    if (!dbInstance) {
      let app = initializeApp(firebaseConfig);
      this.db = getFirestore(app);
      this.storage = getStorage(
        app,
        `gs://${process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}`,
      );
      dbInstance = this;
    }
    return dbInstance;
  }
  getDB() {
    return this.db;
  }
  getStorage() {
    return this.storage;
  }
}

const dbService = new DatabaseService();
export default dbService;
