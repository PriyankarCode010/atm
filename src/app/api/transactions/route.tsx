import { db } from "@/lib/firebase";
import { collection, doc, getDoc, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

// Define Transaction type
interface Transaction {
  type: "deposit" | "withdrawal";
  amount: number;
  timestamp: string;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const accountNumber = searchParams.get("accountNumber");

    if (!accountNumber) {
      return NextResponse.json({ error: "Missing accountNumber" }, { status: 400 });
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

    // 🔹 Get transactions array from user document
    const transactions: Transaction[] = userData?.transactions ?? [];

    // 🔹 Sort transactions by timestamp (newest first) and return latest 5
    const latestTransactions = transactions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);

    return NextResponse.json({ transactions: latestTransactions });
  } catch (error) {
    console.error("Fetch Transactions Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
