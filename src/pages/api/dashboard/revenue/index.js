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
    // Total revenue
    let totalRevenue = 0;
    const docs = (await getDocs(q)).docs;
    docs.forEach((doc) => {
      totalRevenue += doc.data().totalPrice;
    });

    //Total Revenue by Store
    const revenueByStore = {};
    const revenueByDay = {};

    // Total orders
    const totalOrders = docs.length;

    // Total customers
    const totalCustomers = new Set(docs.map((doc) => doc.data().userId)).size;

    // Total products
    const totalProducts = new Set(
      docs.map((doc) => doc.data().items.map((item) => item.productId))
    ).size;

    docs.forEach((doc) => {
      const orderDate = new Date(doc.data().timestamp);
      const date = orderDate.getDay();
      const month = orderDate.getMonth();
      const year = orderDate.getFullYear();

      const dayKey = `${year}-${month}-${date}`;
      if (revenueByDay[dayKey]) {
        revenueByDay[dayKey] += doc.data().totalPrice;
      } else {
        revenueByDay[dayKey] = doc.data().totalPrice;
      }

      const orderId = doc.data().storeId;
      if (revenueByStore[orderId]) {
        revenueByStore[orderId] += doc.data().totalPrice;
      } else {
        revenueByStore[orderId] = doc.data().totalPrice;
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueByDay,
        revenueByStore,
      },
    });
  }
}
