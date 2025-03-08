import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, addDoc, orderBy, limit } from "firebase/firestore";

// 🔹 Add a new user (Admin function)
export const addUser = async (accountNumber: string, name: string, initialBalance: number) => {
  try {
    const userRef = doc(db, "users", accountNumber);
    await setDoc(userRef, {
      accountNumber,
      name,
      balance: initialBalance,
      pin: "0000", // Default PIN = 0000
      needsPinChange: true, // User must change PIN on first login
    });
    return { success: true, message: "User added successfully" };
  } catch (error) {
    console.error("Error adding user:", error);
    return { success: false, message: "Failed to add user" };
  }
};

// 🔹 Verify user login
export const verifyUser = async (accountNumber: string, pin: string) => {
  try {
    const userRef = doc(db, "users", accountNumber);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, message: "User not found" };
    }

    const userData = userSnap.data();
    return {
      success: userData.pin === pin,
      needsPinChange: userData.needsPinChange, // Corrected `needsPinChange` retrieval
    };
  } catch (error) {
    console.error("Error verifying user:", error);
    return { success: false, message: "Login failed" };
  }
};

// 🔹 Check if user needs to change PIN
export const needsPinChange = async (accountNumber: string) => {
  try {
    const userRef = doc(db, "users", accountNumber);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return false; // User doesn't exist
    }

    return userSnap.data().needsPinChange ?? false;
  } catch (error) {
    console.error("Error checking PIN change status:", error);
    return false;
  }
};

// 🔹 Update user PIN after first login
export const updatePin = async (accountNumber: string, newPin: string) => {
  try {
    const userRef = doc(db, "users", accountNumber);
    await updateDoc(userRef, {
      pin: newPin,
      needsPinChange: false, // Mark PIN as changed
    });
    return { success: true, message: "PIN updated successfully" };
  } catch (error) {
    console.error("Error updating PIN:", error);
    return { success: false, message: "Failed to update PIN" };
  }
};

// 🔹 Fetch last 5 transactions of a user
export const fetchTransactions = async (accountNumber: string) => {
  try {
    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("accountNumber", "==", accountNumber),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);

    const transactions = querySnapshot.docs.map((doc) => doc.data());
    return { success: true, transactions };
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return { success: false, message: "Failed to fetch transactions" };
  }
};

// 🔹 Add a transaction (Deposit/Withdrawal)
export const addTransaction = async (accountNumber: string, type: "deposit" | "withdrawal", amount: number) => {
  try {
    const userRef = doc(db, "users", accountNumber);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { success: false, message: "User not found" };
    }

    const userData = userSnap.data();
    let newBalance = userData.balance;

    if (type === "deposit") {
      newBalance += amount;
    } else if (type === "withdrawal") {
      if (amount > newBalance) {
        return { success: false, message: "Insufficient balance" };
      }
      newBalance -= amount;
    }

    // Update user balance
    await updateDoc(userRef, { balance: newBalance });

    // Add transaction to transactions collection
    await addDoc(collection(db, "transactions"), {
      accountNumber,
      type,
      amount,
      timestamp: new Date().toISOString(),
    });

    return { success: true, newBalance, message: "Transaction successful" };
  } catch (error) {
    console.error("Error processing transaction:", error);
    return { success: false, message: "Transaction failed" };
  }
};
