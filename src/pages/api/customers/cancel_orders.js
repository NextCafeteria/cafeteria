import { db } from "@/lib/firebase";
import {
  getDocs,
  collection,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { OrderStatus } from "@/lib/order_status";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "POST") {
    // Cancel an order
    const orderId = req.body.orderId;
    // Query order by orderId and userId
    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.id),
      where("orderId", "==", orderId)
    );
    const docs = (await getDocs(q)).docs;
    if (docs.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    // If status is QUEUED, allow to cancel
    if (docs[0].data().status !== OrderStatus.QUEUED) {
      return res.status(403).json({ error: "Order cannot be cancelled" });
    }

    const doc = docs[0];
    // Update order status
    await updateDoc(doc.ref, {
      status: OrderStatus.CANCELLED,
    });

    return res
      .status(200)
      .json({ success: true, data: getDoc(doc.ref).data() });
  }
}
