import { db } from "@/lib/firebase";
import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const docRef = await addDoc(collection(db, "users"), { name, email });
    return NextResponse.json({ id: docRef.id, name, email });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add user" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, email } = await req.json();
    if (!id || !name || !email) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const userRef = doc(db, "users", id);
    await updateDoc(userRef, { name, email });

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing user ID" }, { status: 400 });

    await deleteDoc(doc(db, "users", id));

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}