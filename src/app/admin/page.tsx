"use client";
import { useState } from "react";
import { addUser } from "@/lib/firebaseActions"; // Firebase function for adding users

export default function Admin() {
  const [accountNumber, setAccountNumber] = useState("");
  const [name, setName] = useState("");
  const [initialBalance, setInitialBalance] = useState("");
  const [message, setMessage] = useState("");

  const handleAddUser = async () => {
    if (!accountNumber || !name || !initialBalance) {
      setMessage("All fields are required.");
      return;
    }

    try {
      await addUser(accountNumber, name, parseFloat(initialBalance));
      setMessage(`User ${name} added successfully!`);
      setAccountNumber("");
      setName("");
      setInitialBalance("");
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage("Failed to add user.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Add User</h1>
      {message && <p className="text-red-500">{message}</p>}

      <input
        type="text"
        placeholder="Account Number"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="border p-2 mb-2 w-72"
      />
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mb-2 w-72"
      />
      <input
        type="number"
        placeholder="Initial Balance"
        value={initialBalance}
        onChange={(e) => setInitialBalance(e.target.value)}
        className="border p-2 mb-4 w-72"
      />

      <button onClick={handleAddUser} className="bg-blue-500 text-white p-2 rounded w-72">
        Add User
      </button>
    </div>
  );
}
