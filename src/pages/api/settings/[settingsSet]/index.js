import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

import { authOptions } from "../../auth/[...nextauth]";
import dbService from "@/services/Database";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (req.method === "GET") {
    const settingsSet = req.query.settingsSet;

    // Only common settings are supported for now
    if (settingsSet !== "common") {
      return res.status(400).json({ error: "Invalid settings set" });
    }

    // Get collection containing common settings
    const commonSettingDoc = await getDocs(
      query(
        collection(dbService.getDB(), "settings"),
        where("settingsSet", "==", settingsSet)
      )
    );

    if (commonSettingDoc.empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    let settings = {};
    commonSettingDoc.forEach((doc) => {
      settings = { ...doc.data(), id: doc.id };
    });

    return res.status(200).json({ success: true, data: settings || {} });
  } else if (req.method === "POST") {
    if (!currentUser) {
      return res.status(401).json({ error: "Login is required" });
    }
    if (!currentUser?.isAdmin) {
      return res.status(401).json({ error: "Admin is required" });
    }

    const settingsSet = req.query.settingsSet;

    // Only common settings are supported for now
    if (settingsSet !== "common") {
      return res.status(400).json({ error: "Invalid settings set" });
    }

    const settings = req.body;

    // Update settings
    const settingsSnapshot = await getDocs(
      query(
        collection(dbService.getDB(), "settings"),
        where("settingsSet", "==", settingsSet)
      )
    );

    if (settingsSnapshot.empty) {
      // Create new settings
      await addDoc(collection(dbService.getDB(), "settings"), {
        ...settings,
        settingsSet,
      });
    } else {
      // Update existing settings
      settingsSnapshot.forEach((doc) => {
        updateDoc(doc.ref, settings);
      });
    }

    return res.status(200).json({ success: true });
  }
}
