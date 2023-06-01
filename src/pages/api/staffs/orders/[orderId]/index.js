import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]";
import { OrderStatus } from "@/lib/order_status";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (!currentUser?.isStaff) {
    return res.status(401).json({ error: "Staff is required" });
  }
  if (req.method === "POST") {
    const status = req.body.status;
    const statusList = Object.values(OrderStatus);
    if (!statusList.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const orderId = req.query.orderId;
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: `Order not found ${orderId}` });
    }

    if(status === OrderStatus.CONFIRMED) {
      const data = docSnap.data();
      if (data.status !== OrderStatus.QUEUED) {
        return res.status(400).json({ error: "Invalid action: wrong status" });
      }
      if (data.storeId !== currentUser?.storeId) {
        return res.status(400).json({ error: "Invalid action: wrong store" });
      }
      await updateDoc(docRef, {
        status: status,
        staffId: currentUser?.id,
      });
    }
    else{
      const data = docSnap.data();
      if (data.staffId !== currentUser?.id) {
        return res.status(400).json({ error: "Invalid action: wrong staff" });
      }
      await updateDoc(docRef, {
        status: status,
      });
    }
    
    return res.status(200).json({ success: true });
  }
  if (req.method === "GET") {
    const orderId = req.query.orderId;
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Return all details of the order
    return res.status(200).json({ success: true, data: docSnap.data() });
  }
}
