import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
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
    if (req.query.orderId.length === 1) {
      const orderId = req.query.orderId[0];
      const status = req.body.status;
      const statusList = Object.values(OrderStatus);
      if (!statusList.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({ error: `Order not found ${orderId}` });
      }

      if (status === OrderStatus.CONFIRMED) {
        const data = docSnap.data();
        if (data.status !== OrderStatus.QUEUED) {
          return res
            .status(400)
            .json({ error: "Invalid action: wrong status" });
        }
        if (data.storeId !== currentUser?.storeId) {
          return res.status(400).json({ error: "Invalid action: wrong store" });
        }
        await updateDoc(docRef, {
          status: status,
          staffId: currentUser?.id,
        });
      } else {
        const data = docSnap.data();
        if (data.staffId !== currentUser?.id) {
          return res.status(400).json({ error: "Invalid action: wrong staff" });
        }
        await updateDoc(docRef, {
          status: status,
        });
      }

      return res.status(200).json({ success: true });
    } else if (req.query.orderId.length === 2) {
      const [orderId, path] = req.query.orderId;
      if (path == "response") {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          return res.status(404).json({ error: "Order not found" });
        }
        if (docSnap.data().userId !== currentUser.id) {
          return res.status(403).json({ error: "Order not found" });
        }

        //create new comment
        const commentData = {
          orderId: orderId,
          staffId: currentUser?.id,
          value: req.body.response_value,
          timestamp: new Date(),
        };

        const docRefComment = await addDoc(
          collection(db, "comments"),
          commentData
        );

        //update comment of order
        await updateDoc(docRef, {
          staffCommentId: docRefComment.id,
        });

        const dataComment = { ...commentData, id: docRefComment.id };
        const data = { ...req.body, id: docRef.id, commentStaff: dataComment };
        return res.status(200).json({ success: true, data: data || {} });
      }
    }
  }
  if (req.method === "GET") {
    const orderId = req.query.orderId[0];
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Order not found" });
    }

    const data = docSnap.data();

    if (data.customerCommentId) {
      const commentRef = doc(db, "comments", data.customerCommentId);
      const commentSnap = await getDoc(commentRef);
      if (commentSnap.exists()) {
        data.customerComment = commentSnap.data();
      }
    }

    if (data.staffCommentId) {
      const commentRef = doc(db, "comments", data.staffCommentId);
      const commentSnap = await getDoc(commentRef);
      if (commentSnap.exists()) {
        data.staffComment = commentSnap.data();
      }
    }

    // Return all details of the order
    return res.status(200).json({ success: true, data: data });
  }
}
