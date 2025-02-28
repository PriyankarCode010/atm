import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req:Request) {
  try {
    const { accountNumber, pin } = await req.json();
    if (!accountNumber || !pin) {
      return Response.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Query Firestore for the user
    const q = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return Response.json({ error: "Account not found" }, { status: 404 });
    }

    // Get user data
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    // Verify PIN using bcrypt
    const isMatch = await bcrypt.compare(pin, userData.pin);
    if (!isMatch) {
      return Response.json({ error: "Incorrect PIN" }, { status: 401 });
    }

    // Generate JWT token for authentication
    const token = jwt.sign(
      { accountNumber: userData.accountNumber, name: userData.name },
      "7d9e6f2b8e62b34c2c4f35a8d0e3a1c1e65fba9c5b6a71f4c7a8b2d3e4f5c6d7",
      { expiresIn: "1m" }
    );
    

    return Response.json({ message: "Login successful", token }, { status: 200 });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
