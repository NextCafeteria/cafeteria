import { db } from "@/lib/firebase";
import { getDocs, collection, query, addDoc, where, deleteDoc, doc } from "firebase/firestore";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import products from "@/data/products.json"

function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export default async function handler(req, res) {
  // Check authentication
  const session = await getServerSession(req, res, authOptions);
  const currentUser = session?.user;
  if (!currentUser) {
    return res.status(401).json({ error: "Login is required" });
  }
  if (req.method === "GET") {

    // // Remove all products from database
    // const qq = query(collection(db, "products"));
    // const qdocs = (await getDocs(qq)).docs;
    // for (let i = 0; i < qdocs.length; i++) {
    //   await deleteDoc(doc(db, "products", qdocs[i].id));
    // }
    // for (let i = 0; i < products.length; i++) {
    //   console.log("PRODUCT " + i)
    //   const { name, description, image, price, customizations } = products[i];
    //   let customizationsDict = {}
    //   for (let j = 0; j < customizations.length; j++) {
    //     const customizationId = uuidv4();
    //     customizationsDict[customizationId] = customizations[j];
    //     let optionsDict = {};
    //     for (let k = 0; k < customizations[j].options.length; k++) {
    //       const optionId = uuidv4();
    //       optionsDict[optionId] = customizations[j].options[k];
    //     }
    //     customizationsDict[customizationId].options = optionsDict;
    //   }
    //   console.log("xxxxx")
    //   console.log(customizationsDict)
    //   await addDoc(collection(db, "products"), {
    //     name: name,
    //     description: description,
    //     image: image,
    //     price: price,
    //     customizations: customizationsDict,
    //   });
    // }

    // Query progress and sort by timestamp
    const q = query(collection(db, "products"));

    // Return empty array if no product found
    if ((await getDocs(q)).empty) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Return product data
    const docs = (await getDocs(q)).docs;
    let data = docs.map((doc) => {
      return { ...doc.data(), id: doc.id };
    });

    return res.status(200).json({ success: true, data: data });
  } else if (req.method === "POST") {
    if (!currentUser?.isAdmin) {
      return res.status(401).json({ error: "Admin is required" });
    }
    let { name, address, phone } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!address) {
      address = "";
    }
    if (!phone) {
      phone = "";
    }

    // Create a new product
    const docRef = await addDoc(collection(db, "products"), {
      name: name,
      address: address,
      phone: phone,
      customizationIds: [],
    });
    const data = { ...req.body, id: docRef.id };

    return res.status(200).json({ success: true, data: data || {} });
  }
}
