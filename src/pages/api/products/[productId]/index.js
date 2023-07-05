import dbService from "@/services/Database";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  
  if (req.method === "GET") {
    const productId = req.query.productId;
    const docRef = doc(dbService.getDB(), "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "product not found" });
    }
    let data = { ...docSnap.data(), id: docSnap.id };
    // Return all details of the product
    return res.status(200).json({ success: true, data: data });
  }
  if (!currentUser?.isAdmin) {
    return res.status(401).json({ error: "Admin is required" });
  }
  if (req.method === "PUT") {
    const productId = req.query.productId;
    const productData = req.body;
    const docRef = doc(dbService.getDB(), "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "product not found" });
    }

    // Update product
    await updateDoc(docRef, productData);

    // Return all details of the product
    return res.status(200).json({ success: true, data: productData });
  }
  if (req.method === "DELETE") {
    const productId = req.query.productId;
    const docRef = doc(dbService.getDB(), "products", productId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: "product not found" });
    }

    // Delete product
    await deleteDoc(docRef);

    // Return all details of the product
    return res.status(200).json({ success: true });
  }
}
