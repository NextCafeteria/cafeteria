import {
  ORDER_STATUS_TYPE_TO_ORDER_STATUS,
  OrderStatusType,
} from "@/lib/order_status";
import { collection, getDocs, query, where } from "firebase/firestore";

import { authOptions } from "../../auth/[...nextauth]";
import dbService from "@/services/Database";
import { getServerSession } from "next-auth/next";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (!currentUser?.isStaff && !currentUser?.isAdmin) {
    return res.status(401).json({ error: "Staff or Admin is required" });
  }

  if (req.method === "GET") {
    const q = query(
      collection(dbService.getDB(), "orders"),
      where(
        "status",
        "in",
        ORDER_STATUS_TYPE_TO_ORDER_STATUS[OrderStatusType.INACTIVE]
      )
    );
    // Query stores
    const qOrder = query(collection(dbService.getDB(), "orders"));

    // Return empty array if no store found
    if ((await getDocs(q)).empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return store data
    const Storedocs = (await getDocs(qOrder)).docs;

    // Total revenue
    let totalRevenue = 0;
    const docs = (await getDocs(q)).docs;
    docs.forEach((doc) => {
      totalRevenue += doc.data().totalPrice;
    });

    //Total Revenue by Store
    const revenueByStore = {};
    docs.forEach((doc) => {
      const orderId = doc.data().storeID;
      if (revenueByStore[orderId]) {
        revenueByMonth[orderId] += doc.data().totalPrice;
      } else {
        revenueByMonth[orderId] = doc.data().totalPrice;
      }
    });
    //
    revenueByStore.forEach((store) => {});
    // Total orders
    const totalOrders = docs.length;

    // Total customers
    const totalCustomers = new Set(docs.map((doc) => doc.data().userId)).size;

    // Total products
    const totalProducts = new Set(
      docs.map((doc) => doc.data().items.map((item) => item.productId))
    ).size;

    const revenueByMonth = {};
    docs.forEach((doc) => {
      const orderDate = new Date(doc.data().timestamp);
      const month = orderDate.getMonth();
      const year = orderDate.getFullYear();

      const monthKey = `${year}-${month}`;
      if (revenueByMonth[monthKey]) {
        revenueByMonth[monthKey] += doc.data().totalPrice;
      } else {
        revenueByMonth[monthKey] = doc.data().totalPrice;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueByMonth,
        revenueByStore,
      },
    });
  }
}
