import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get("uid");
  
    if (!uid) return NextResponse.json({ error: "Missing UID" }, { status: 400 });
  
    try {
      const transactionsRef = collection(db, "transactions");
      const transactionsQuery = query(transactionsRef, where("uid", "==", uid), orderBy("timestamp", "desc"), limit(5));
      const transactionsSnapshot = await getDocs(transactionsQuery);
      
      const transactions = transactionsSnapshot.docs.map(doc => doc.data());
  
      return NextResponse.json({ transactions });
    } catch (error:unknown) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
        return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }    }
  }