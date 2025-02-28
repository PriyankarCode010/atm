import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { NextResponse } from "next/server";

// 📌 GET: Fetch account balance
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountNumber = searchParams.get("accountNumber");

    if (!accountNumber) {
      return NextResponse.json({ error: "Missing account number" }, { status: 400 });
    }

    // Query Firestore for the user
    const q = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
    const querySnapshot = await getDocs(q);
    console.log("q----",querySnapshot.docs[0].data());

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get user balance
    const userData = querySnapshot.docs[0].data();
    return NextResponse.json({ balance: userData.balance }, { status: 200 });
  } catch (error) {
    console.error("Balance fetch error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// 📌 POST: Deposit money
export async function POST(req: Request) {
  try {
    const { accountNumber, amount } = await req.json();

    if (!accountNumber || !amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid deposit details" }, { status: 400 });
    }

    // Query Firestore for the user
    const q = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    // Get the user document
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "users", userDoc.id);
    const userData = userDoc.data();

    // Update balance
    const newBalance = userData.balance + amount;
    await updateDoc(userRef, { balance: newBalance });

    return NextResponse.json({ message: "Deposit successful", newBalance }, { status: 200 });
  } catch (error) {
    console.error("Deposit error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
