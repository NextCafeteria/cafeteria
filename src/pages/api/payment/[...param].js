import dbService from "@/services/Database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
const NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX =
  process.env.NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX;

export default async function handler(req, res) {
  const path = req.query.param;

  console.log("body:", req.body);
  if (
    path.length == 2 &&
    path[0] == "webhook" &&
    path[1] == "handler-bank-transfer"
  ) {
    // console.log("body 2:", req.body.data[0]?.description.includes(`${NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX}`));
    if (!req.body.data[0]?.description.includes(`${NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX}`)) {
      return res.status(200).json({ success: false, data: {} });
    }
    for (let transaction of req.body.data) {
      const orderId = transaction.description
        .split(`${NEXT_PUBLIC_VIETQR_MERCHANT_INFO_PREFIX}`)[1]
        .split(" ")[0]
        .replace(/[^a-zA-Z0-9]/g, "");
      const docRef = doc(dbService.getDB(), "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        return res.status(404).json({ success: false, data: {} });
      }
      const amount = docSnap.data().totalPrice;
      await updateDoc(docRef, {
        paid: true,
      });
    }
    return res.status(200).json({ success: true, data: {} });
  }
  if (path.length == 1 && path[0] == "cheat-paid") {
    const orderId = req.body.orderId;
    const docRef = doc(dbService.getDB(), "orders", orderId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ success: false, data: {} });
    }
    await updateDoc(docRef, {
      paid: true,
    });
    return res.status(200).json({ success: true, data: {} });
  }
}
