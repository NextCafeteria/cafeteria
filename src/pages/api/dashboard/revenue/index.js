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
    // return res.status(200).json(docs);
    docs.forEach((doc) => {
      totalRevenue += doc.data().totalPrice;
    });

    // Total orders
    const totalOrders = docs.length;

    // Total customers
    const totalCustomers = new Set(docs.map((doc) => doc.data().userId)).size;

    // Total products
    const totalProducts = new Set(
      docs.map((doc) => doc.data().items.map((item) => item.productId))
    ).size;

    // Revenue by date
    const revenueByDate = {};

    // Revenue by date of each store
    const storeIds = new Set(docs.map((doc) => doc.data().storeId));
    const revenueByStore = {};
    storeIds.forEach((storeId) => {
      revenueByStore[storeId] = {};
    });

    docs.forEach((doc) => {
      const orderDate = new Date(doc.data().timestamp);
      const date = orderDate.getDay();
      const month = orderDate.getMonth();
      const year = orderDate.getFullYear();

      const dayKey = `${year}-${month}-${date}`;
      const storeId = doc.data().storeId;

      if (revenueByStore[storeId]?.[dayKey]) {
        revenueByStore[storeId][dayKey] += doc.data().totalPrice;
      } else {
        revenueByStore[storeId][dayKey] = doc.data().totalPrice;
      }

      if (revenueByDate[dayKey]) {
        revenueByDate[dayKey] += doc.data().totalPrice;
      }
      revenueByDate[dayKey] = doc.data().totalPrice;
    });

    const monthlyRevenueByStore = getMonthlyRevenueByStore(revenueByStore);

    return res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        // revenueByStore,
        revenueByDate,
        monthlyRevenueByStore,
        storeIds: Array.from(storeIds),
      },
    });
  }
}

function getMonthlyRevenueByStore(revenueByStore) {
  const result = {};

  // Iterate through each store
  for (const storeId in revenueByStore) {
    const storeData = revenueByStore[storeId];
    const storeRevenueByMonth = {};

    // Iterate through each date in the store data
    for (const date in storeData) {
      const [year, month, _] = date.split("-");
      const monthKey = `${year}-${month}`;

      // If the monthKey doesn't exist, initialize it to 0
      if (!storeRevenueByMonth[monthKey]) {
        storeRevenueByMonth[monthKey] = 0;
      }

      // Add the revenue for the current date to the corresponding monthKey
      storeRevenueByMonth[monthKey] += storeData[date];
    }

    // Add the store revenue by month to the result object
    result[storeId] = storeRevenueByMonth;
  }

  return result;
}
