import { db } from "@/lib/firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "GET") {
    const orderId = req.query.orderId;
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (docSnap.data().userId !== currentUser.id) {
      return res.status(403).json({ error: "Order not found" });
    }

    // Return all details of the order
    return res.status(200).json({ success: true, data: docSnap.data() });
  }
}
