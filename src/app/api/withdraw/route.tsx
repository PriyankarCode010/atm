import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import { collection, query, where, getDocs, updateDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { accountNumber, amount } = await req.json();

    if (!accountNumber) {
      return NextResponse.json({ error: "Account number is required" }, { status: 400 });
    }

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid withdrawal amount" }, { status: 400 });
    }

    // 🔹 Fetch user account from Firestore
    const userQuery = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userDoc = userSnapshot.docs[0];
    const userRef = userDoc.ref;
    const userData = userDoc.data();

    // 🔹 Check balance
    const currentBalance = userData?.balance ?? 0;
    if (currentBalance - amount < 500) {
      return NextResponse.json({ error: "Insufficient funds! Minimum balance of ₹500 must be maintained." }, { status: 400 });
    }

    // 🔹 Update balance
    const newBalance = currentBalance - amount;
    await updateDoc(userRef, { balance: newBalance });

    return NextResponse.json({ success: true, newBalance });
  } catch (error) {
    console.error("Withdraw Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
