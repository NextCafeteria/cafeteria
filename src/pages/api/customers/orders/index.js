import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  addDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { OrderStatus } from "@/lib/order_status";
import { populateCart } from "@/lib/cart";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "GET") {
    // Query progress by userId and sort by timestamp
    const q = query(
      collection(db, "orders"),
      where("userId", "==", currentUser.id),
      orderBy("timestamp", "desc"),
      limit(20)
    );

    // Return empty array if no order found
    if ((await getDocs(q)).empty) {
      return res.status(200).json({ success: true, data: {} });
    }

    // Return order data
    const docs = (await getDocs(q)).docs;
    const data = docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });
    return res.status(200).json({ success: true, data: data });
  } else if (req.method === "POST") {
    // Calculate total price
    const { items, deliveryAddress, storeId } = req.body;
    // Check if items is empty
    if (items.length === 0) {
      return res.status(400).json({ error: "Items cannot be empty" });
    }

    // Query progress and sort by timestamp
    const q = query(collection(db, "products"));

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

    let orderData = populateCart(items, products);

    // Create a new order
    const docRef = await addDoc(collection(db, "orders"), {
      userId: currentUser.id,
      items: orderData.items,
      price: orderData.price,
      tax: orderData.tax,
      totalPrice: orderData.total,
      timestamp: Date.now(),
      status: OrderStatus.QUEUED,
      deliveryAddress: deliveryAddress,
      storeId: storeId,
    });
    const data = { ...req.body, id: docRef.id };

    // Save last delivery address
    const userDocRef = doc(db, "users", currentUser.id);
    await updateDoc(userDocRef, {
      lastDeliveryAddress: deliveryAddress,
    });

    return res.status(200).json({ success: true, data: data || {} });
  }
}
