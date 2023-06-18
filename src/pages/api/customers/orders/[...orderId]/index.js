import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, addDoc } from "firebase/firestore";
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
  if (req.method === "GET") {
    const orderId = req.query.orderId[0];
    const docRef = doc(db, "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (docSnap.data().userId !== currentUser.id) {
      return res.status(403).json({ error: "Order not found" });
    }

    let data = docSnap.data();

    //query comments of order
    if (data.customerCommentId) {
      const docRefCustomerComment = doc(db, "comments", data.customerCommentId);
      const docSnapCustomerComment = await getDoc(docRefCustomerComment);
      const commentCustomerData = docSnapCustomerComment.data();
      data = { ...data, customerComment: commentCustomerData };
    }

    if (data.staffCommentId) {
      const docRefStaffComment = doc(db, "comments", data.staffCommentId);
      const docSnapStaffComment = await getDoc(docRefStaffComment);
      const commentStaffData = docSnapStaffComment.data();
      data = { ...data, staffComment: commentStaffData };
    }

    // Return all details of the order
    return res.status(200).json({ success: true, data: data || {} });
  }
  if (req.method === "POST") {
    const [orderId, path] = req.query.orderId;
    if (path == "cancel") {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (docSnap.data().userId !== currentUser.id) {
        return res.status(403).json({ error: "Order not found" });
      }

      await updateDoc(docRef, {
        status: OrderStatus.CANCELLED,
      });

      return res.status(200).json({ success: true });
    }
    if (path == "comment") {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({ error: "Order not found" });
      }
      if (docSnap.data().userId !== currentUser.id) {
        return res.status(403).json({ error: "Order not found" });
      }

      // Create new comment
      const commentData = {
        orderId: orderId,
        customerId: currentUser?.id,
        value: req.body.comment_value,
        timestamp: new Date(),
      };

      const docRefComment = await addDoc(
        collection(db, "comments"),
        commentData
      );

      // Update rating & comment of order
      let rateAndComment = {
        customerCommentId: docRefComment.id,
      };
      if (req.body.rating) {
        let currentRating = parseInt(req.body.rating);
        if (currentRating < 1 || currentRating > 5) {
          return res.status(400).json({ error: "Invalid rating" });
        }

        // Get previous rating => prevent user rate more than 1 time
        const orderData = docSnap.data();
        if (orderData.rating) {
          return res.status(400).json({ error: "You have rated this order" });
        }
        rateAndComment.rating = currentRating;

        // Update rating of store
        const storeId = orderData?.storeId;
        if (storeId) {
          const docRefStore = doc(db, "stores", storeId);
          const docSnapStore = await getDoc(docRefStore);
          let previousRating = docSnapStore.data()?.totalRatingStars || 0;
          if (isNaN(previousRating)) previousRating = 0;
          let previousRatingTimes = docSnapStore.data()?.totalRatingTimes || 0;
          if (isNaN(previousRatingTimes)) previousRatingTimes = 0;
          if (docSnapStore.exists()) {
            await updateDoc(docRefStore, {
              totalRatingStars: previousRating + currentRating,
              totalRatingTimes: previousRatingTimes + 1,
            });
          }
        }

        // Update rating of staff
        const staffId = orderData?.staffId;
        if (staffId) {
          const docRefStaff = doc(db, "users", staffId);
          const docSnapStaff = await getDoc(docRefStaff);
          let previousRating = docSnapStaff.data()?.totalRatingStars || 0;
          if (isNaN(previousRating)) previousRating = 0;
          let previousRatingTimes = docSnapStaff.data()?.totalRatingTimes || 0;
          if (isNaN(previousRatingTimes)) previousRatingTimes = 0;
          if (docSnapStaff.exists()) {
            await updateDoc(docRefStaff, {
              totalRatingStars: previousRating + currentRating,
              totalRatingTimes: previousRatingTimes + 1,
            });
          }
        }
      }
      await updateDoc(docRef, rateAndComment);

      const dataComment = { ...commentData, id: docRefComment.id };
      const data = { ...req.body, id: docRef.id, commentCustomer: dataComment };
      return res.status(200).json({ success: true, data: data || {} });
    }
  }
}
