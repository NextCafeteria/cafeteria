import dbService from "@/services/Database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (!currentUser?.isAdmin) {
    return res.status(401).json({ error: "Admin is required" });
  }
  if (req.method === "PUT") {
    const productId = req.query.productId;
    const docRef = doc(dbService.getDB(), "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "product not found" });
    }

    // Toggle availability
    const productData = docSnap.data();
    const isAvailable =
      productData.isAvailable === undefined ? true : productData.isAvailable;
    await updateDoc(docRef, {
      isAvailable: !isAvailable,
    });

    // Return all details of the product
    return res.status(200).json({ success: true });
  }
}
