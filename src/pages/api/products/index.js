import dbService from "@/services/Database";
import {
  getDocs,
  collection,
  query,
  addDoc,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
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
    const q = query(collection(dbService.getDB(), "products"));

    // Return empty array if no product found
    if ((await getDocs(q)).empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return product data
    const docs = (await getDocs(q)).docs;
    let data = docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    return res.status(200).json({ success: true, data: data });
  } else if (req.method === "POST") {
    if (!currentUser?.isAdmin) {
      return res.status(401).json({ error: "Admin is required" });
    }

    // Create a new product
    const docRef = await addDoc(collection(dbService.getDB(), "products"), {
      name: "New Product",
      description: "",
      image: "/images/placeholder.png",
      price: 0.0,
      customizations: {},
    });
    const data = { ...req.body, id: docRef.id };

    return res.status(200).json({ success: true, data: data || {} });
  }
}
