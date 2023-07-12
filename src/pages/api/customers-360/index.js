import dbService from "@/services/Database";
import { where, query, collection, getDocs } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

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
  if (req.method === "GET") {
    const customerEmail = req.query.customerEmail;
    console.log("'" + customerEmail + "'");
    const userQuery = query(
      collection(dbService.getDB(), "users"),
      where("email", "==", customerEmail)
    );
    const userQuerySnapshot = await getDocs(userQuery);
    if (userQuerySnapshot.empty) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = userQuerySnapshot.docs[0].id;

    return res.status(200).json({
      data: {
        id: userId,
        email: userQuerySnapshot.docs[0].data().email,
        name: userQuerySnapshot.docs[0].data().name,
        image: userQuerySnapshot.docs[0].data().image,
      },
    });
  }
}
