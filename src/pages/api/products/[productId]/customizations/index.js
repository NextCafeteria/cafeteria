import dbService from "@/services/Database";
import {
  doc,
  getDoc,
  updateDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
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
  if (req.method === "POST") {
    const { productId, email, role } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (["customization"].indexOf(role) === -1) {
      return res.status(400).json({ error: "Role is invalid" });
    }

    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productData = productSnap.data();

    // Query user with email to get userId
    const userQuery = query(
      collection(dbService.getDB(), "users"),
      where("email", "==", email)
    );
    const userQuerySnapshot = await getDocs(userQuery);
    if (userQuerySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userQuerySnapshot.docs[0].id;

    // Add userId to product's customizations
    const customizationIds = productData.customizationIds || [];
    if (customizationIds.indexOf(userId) !== -1) {
      return res.status(400).json({ error: "User is already a customization" });
    }

    // Add userId to product's customizations
    customizationIds.push(userId);
    await updateDoc(productRef, { customizationIds: customizationIds });

    // Add productId and isCustomization to user's data
    await updateDoc(doc(dbService.getDB(), "users", userId), {
      productId: productId,
      isCustomization: true,
    });

    return res.status(200).json({ success: true });
  }
  if (req.method === "DELETE") {
    const { productId, userId } = req.query;
    if (!productId) {
      return res.status(400).json({ error: "ProductId is required" });
    }
    if (!userId) {
      return res.status(400).json({ error: "UserId is required" });
    }

    const productRef = doc(dbService.getDB(), "products", productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return res.status(404).json({ error: "Product not found" });
    }
    const productData = productSnap.data();

    // Remove userId from product's customizations
    const customizationIds = productData.customizationIds || [];
    if (customizationIds.indexOf(userId) === -1) {
      return res.status(400).json({ error: "User is not a customization" });
    }
    await updateDoc(productRef, {
      customizationIds: customizationIds.filter((id) => id !== userId),
    });

    // Remove productId from user's data
    await updateDoc(doc(dbService.getDB(), "users", userId), {
      productId: null,
      isCustomization: false,
    });

    return res.status(200).json({ success: true });
  }
}
