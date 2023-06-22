import dbService from "@/services/Database";
import { getDocs, collection, query, addDoc, where } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "GET") {
    // Query progress and sort by timestamp
    const q = query(collection(dbService.getDB(), "stores"));

    // Return empty array if no store found
    if ((await getDocs(q)).empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return store data
    const docs = (await getDocs(q)).docs;
    let data = docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    // Query the store's staffs
    if (!currentUser?.isAdmin) {
      data = data.map(async (store) => {
        if (!store.staffIds) return store;
        if (store.staffIds.length === 0) return store;
        const q2 = query(
          collection(dbService.getDB(), "users"),
          where("id", "in", store.staffIds)
        );
        const staffs = (await getDocs(q2)).docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        store.staffs = staffs;
        return store;
      });
      data = await Promise.all(data);
    }

    // Query rating for each store
    data = data.map((store) => {
      const totalRatingStars = store?.totalRatingStars || 0;
      const totalRatingTimes = store?.totalRatingTimes || 0;
      store.rating =
        totalRatingTimes > 0 ? totalRatingStars / totalRatingTimes : 0;
      return store;
    });

    return res.status(200).json({ success: true, data: data });
  } else if (req.method === "POST") {
    if (!currentUser?.isAdmin) {
      return res.status(401).json({ error: "Admin is required" });
    }
    let { name, address, phone } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!address) {
      address = "";
    }
    if (!phone) {
      phone = "";
    }

    // Create a new store
    const docRef = await addDoc(collection(dbService.getDB(), "stores"), {
      name: name,
      address: address,
      phone: phone,
      staffIds: [],
    });
    const data = { ...req.body, id: docRef.id };

    return res.status(200).json({ success: true, data: data || {} });
  }
}
