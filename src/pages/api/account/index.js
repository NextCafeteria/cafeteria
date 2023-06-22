import dbService from "@/services/Database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "PUT") {
    // Update user account info including username

    const docRef = doc(dbService.getDB(), "users", currentUser.id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    await updateDoc(docRef, {
      name: req.body.name,
      image: req.body.image,
    });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          name: req.body.name,
          image: req.body.image,
        },
      },
    });
  }
}
