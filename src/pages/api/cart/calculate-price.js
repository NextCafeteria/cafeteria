import dbService from "@/services/Database";
import {
  getDocs,
  collection,
  query,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { populateCart } from "@/lib/cart";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "POST") {
    // Cart
    const cart = req.body;

    // Query progress and sort by timestamp
    const q = query(collection(dbService.getDB(), "products"));

    // Return empty array if no product found
    if ((await getDocs(q)).empty) {
      return res
        .status(200)
        .json({ success: false, error: "No product found" });
    }

    // Return product data
    const docs = (await getDocs(q)).docs;
    let products = docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    let data = populateCart(cart, products);
    return res.status(200).json({ success: true, data: data });
  }
}
