import dbService from "@/services/Database";
import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  documentId,
  updateDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

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
  if (req.method === "GET") {
    const storeId = req.query.storeId;
    const docRef = doc(dbService.getDB(), "stores", storeId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "store not found" });
    }
    let data = { ...docSnap.data(), id: docSnap.id };

    // Query staffs
    if (data?.staffIds?.length > 0) {
      const staffIds = data.staffIds;
      const staffQuery = query(
        collection(dbService.getDB(), "users"),
        where(documentId(), "in", staffIds)
      );
      const staffs = (await getDocs(staffQuery)).docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      data.staffs = staffs;
    }

    // Query ratings
    const totalRatingStars = data?.totalRatingStars || 0;
    const totalRatingTimes = data?.totalRatingTimes || 0;
    data.rating =
      totalRatingTimes > 0 ? totalRatingStars / totalRatingTimes : 0;

    // Return all details of the store
    return res.status(200).json({ success: true, data: data });
  } else if (req.method === "PUT") {
    const storeId = req.query.storeId;
    const docRef = doc(dbService.getDB(), "stores", storeId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "store not found" });
    }
    let data = { ...docSnap.data(), id: docSnap.id };

    // Update store
    const storeData = req.body;
    if (storeData?.name) {
      data.name = storeData.name;
    }
    if (storeData?.address) {
      data.address = storeData.address;
    }
    if (storeData?.phone) {
      data.phone = storeData.phone;
    }

    // Update store
    await updateDoc(docRef, data);
    return res.status(200).json({ success: true, data: data });
  }
}
