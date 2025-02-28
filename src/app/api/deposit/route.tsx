import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs } from "firebase/firestore"; 

export async function POST(req: Request) {
  try {
    const { accountNumber, amount } = await req.json();

    if (!accountNumber || amount <= 0) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    let userRef;
    let userData;

    // 🔹 Check if accountNumber is the document ID
    userRef = doc(db, "users", String(accountNumber));
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // 🔹 If not found, try searching by accountNumber field
      const userQuery = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        return NextResponse.json({ error: "User not found in Firestore" }, { status: 404 });
      }

      const firstDoc = userSnapshot.docs[0];
      userRef = firstDoc.ref;
      userData = firstDoc.data();
    } else {
      userData = userDoc.data();
    }

    const currentBalance = userData?.balance ?? 0; // Default to 0 if undefined
    const userTransactions = userData?.transactions ?? []; // Default to empty array

    // Update balance & transactions
    const newBalance = currentBalance + amount;
    const newTransaction = { type: "deposit", amount, timestamp: new Date().toISOString() };

    await updateDoc(userRef, {
      balance: newBalance,
      transactions: [...userTransactions, newTransaction],
    });

    // Store transaction separately
    await addDoc(collection(db, "transactions"), {
      accountNumber,
      ...newTransaction,
    });

    return NextResponse.json({ success: true, newBalance });
  } catch (error) {
    console.error("Deposit Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
