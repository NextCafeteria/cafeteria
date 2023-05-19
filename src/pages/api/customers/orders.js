import { db } from "@/lib/firebase";
import {
  addDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { OrderStatus } from "@/lib/order_status";
import {
  calculatePriceForList,
  calculateTax,
  calculateTotalPriceWithTax,
  getItemsWithPrice,
} from "@/lib/price";

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
    const items = req.body;
    const price = calculatePriceForList(items);
    const tax = calculateTax(price);
    const totalPrice = calculateTotalPriceWithTax(price, tax);
    const itemsWithPrice = getItemsWithPrice(items);

    // Create a new order
    const docRef = await addDoc(collection(db, "orders"), {
      userId: currentUser.id,
      items: itemsWithPrice,
      price: price,
      tax: tax,
      totalPrice: totalPrice,
      timestamp: Date.now(),
      status: OrderStatus.QUEUED,
    });

    const data = { ...req.body, id: docRef.id };
    return res.status(200).json({ success: true, data: data || {} });
  }
}
