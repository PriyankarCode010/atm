import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import bcrypt from "bcryptjs";

// Function to insert a demo user with hashed PIN
export const addDemoUser = async () => {
  try {
    const pin = "1234"; // Example PIN
    const hashedPin = await bcrypt.hash(pin, 10);

    const docRef = await addDoc(collection(db, "users"), {
      name: "John Doe",
      email: "johndoe@example.com",
      accountNumber: "1234567890",
      balance: 5000,
      pin: hashedPin, // Store hashed PIN
      createdAt: new Date(),
    });

    console.log("User added with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Function to verify user login
export const verifyUser = async (accountNumber, enteredPin) => {
  const q = query(collection(db, "users"), where("accountNumber", "==", accountNumber));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.log("User not found");
    return false;
  }

  const userData = querySnapshot.docs[0].data();
  const isMatch = await bcrypt.compare(enteredPin, userData.pin);

  if (isMatch) {
    console.log("Authentication successful!");
    return true;
  } else {
    console.log("Incorrect PIN!");
    return false;
  }
};
