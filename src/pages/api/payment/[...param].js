
import dbService from "@/services/Database";
import { doc,  getDoc, updateDoc} from "firebase/firestore";
export default async function handler(req, res) {
    const path = req.query.param
    console.log("path: ", path)

    console.log(req.body)
    if(path.length == 2 && path[0] == 'webhook' && path[1] == 'handler-bank-transfer') {
        
        const orderId = req.body.data[0].description.split(' ').filter((item) => item.startsWith('CAFETERIA'))[0].split('CAFETERIA')[1].replace(/[^a-zA-Z0-9]/g, '');
        console.log("orderId: ", orderId)
        const docRef = doc(dbService.getDB(), "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          return;
        }
        const amount = docSnap.data().totalPrice
        // if(amount == req.body.amount) {
            await updateDoc(docRef, {
                paid: true,
            });
        // }

        //add transaction info to db for refund
        // const transactionRef = await addDoc(
            // collection(dbService.getDB(), "transactions"), {
            // orderId: orderId,
            // amount: amount,
            // timestamp: req.body.when,
            // bankName: req.body.bankName,
            // bankCode: req.body.bankCode,


        // }

        // else {

        // }
        return res.status(200).json({ success: true, data: {}})

    }
    if(path.length == 1 && path[0] == 'users-paid') {
        return res.status(200).json({ name: 'John Doe' })
    }
}