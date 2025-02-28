"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); // Store UID from localStorage
  const router = useRouter();

  // 🔹 Fetch UID from localStorage on component mount
  useEffect(() => {
    const storedAccountNumber = localStorage.getItem("accountNumber");
    console.log("Stored Account Number:", storedAccountNumber);
  
    if (!storedAccountNumber) {
      router.replace("/");
    } else {
      setAccountNumber(storedAccountNumber);
    }
  }, [router]); // ✅ Add 'router' here  

  const handleDeposit = async () => {
    setMessage("");
    const token = localStorage.getItem("token");

    if (!token || !accountNumber) {
      return router.push("/");
    }

    const depositAmount = Number(amount);
    if (depositAmount <= 0 || isNaN(depositAmount)) {
      return setMessage("⚠️ Enter a valid amount!");
    }

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ accountNumber, amount: depositAmount }), 
      });

      const data = await res.json();
      console.log("Deposit Response:", data);

      if (!res.ok) {
        return setMessage(data.error || "⚠️ Deposit failed! Check console.");
      }

      setMessage(`✅ Amount deposited: ₹${depositAmount}`);
      setAmount(""); // Reset input field after successful deposit

      setTimeout(() => {
        router.back();
      }, 2000);
    } catch (error) {
      console.error("Deposit Error:", error);
      setMessage("⚠️ Network error, please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200 px-6">
      {/* Back Button */}
      <div className="w-full flex">
        <Link href="/menu" className="text-xl font-bold mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Link>
      </div>

      <h2 className="text-3xl font-bold mb-6">Deposit Money</h2>

      {/* Amount Input */}
      <input
        type="number"
        placeholder="Enter Amount"
        className="p-3 border rounded mb-3 w-full max-w-md"
        value={amount}
        onChange={(e) => {
          setAmount(e.target.value);
          setMessage(""); // Clear message on input change
        }}
      />

      {/* Error/Success Message */}
      {message && (
        <p className={`text-lg ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Deposit Button */}
      <button
        className="bg-black text-white px-6 py-2 rounded mt-3 disabled:bg-gray-500"
        onClick={handleDeposit}
        disabled={!amount || Number(amount) <= 0 || isNaN(Number(amount))}
      >
        Deposit
      </button>
    </div>
  );
}
