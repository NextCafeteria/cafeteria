import dbService from "@/services/Database";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (!currentUser?.isAdmin) {
    return res.status(401).json({ error: "Admin is required" });
  }
  if (req.method === "POST") {
    const { storeId, email, role } = req.body;

    if (!storeId) {
      return res.status(400).json({ error: "StoreId is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (["staff"].indexOf(role) === -1) {
      return res.status(400).json({ error: "Role is invalid" });
    }

    const storeRef = doc(dbService.getDB(), "stores", storeId);
    const storeSnap = await getDoc(storeRef);
    if (!storeSnap.exists()) {
      return res.status(404).json({ error: "Store not found" });
    }
    const storeData = storeSnap.data();

    // Query user with email to get userId
    const userQuery = query(
      collection(dbService.getDB(), "users"),
      where("email", "==", email)
    );
    const userQuerySnapshot = await getDocs(userQuery);
    if (userQuerySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userQuerySnapshot.docs[0].id;

    // Add userId to store's staffs
    const staffIds = storeData.staffIds || [];
    if (staffIds.indexOf(userId) !== -1) {
      return res.status(400).json({ error: "User is already a staff" });
    }

    // Add userId to store's staffs
    staffIds.push(userId);
    await updateDoc(storeRef, { staffIds: staffIds });

    // Add storeId and isStaff to user's data
    await updateDoc(doc(dbService.getDB(), "users", userId), {
      storeId: storeId,
      isStaff: true,
    });

    return res.status(200).json({ success: true });
  }
  if (req.method === "DELETE") {
    const { storeId, userId } = req.query;
    if (!storeId) {
      return res.status(400).json({ error: "StoreId is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const storeRef = doc(db, "stores", storeId);
    const storeSnap = await getDoc(storeRef);
    if (!storeSnap.exists()) {
      return res.status(404).json({ error: "Store not found" });
    }
    const storeData = storeSnap.data();

    // Remove userId from store's staffs
    const staffIds = storeData.staffIds || [];
    if (staffIds.indexOf(userId) === -1) {
      return res.status(400).json({ error: "User is not a staff" });
    }
    await updateDoc(storeRef, {
      staffIds: staffIds.filter((id) => id !== userId),
    });

    // Remove storeId from user's data
    await updateDoc(doc(dbService.getDB(), "users", userId), {
      storeId: null,
      isStaff: false,
    });

    return res.status(200).json({ success: true });
  }
}
