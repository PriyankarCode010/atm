"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); 
  const router = useRouter();

  // Fetch account number on mount
  useEffect(() => {
    const storedAccountNumber = localStorage.getItem("accountNumber");

    if (!storedAccountNumber) {
      setMessage("⚠️ No account found. Redirecting...");
      setTimeout(() => router.replace("/"), 2000);
    } else {
      setAccountNumber(storedAccountNumber);
    }
  }, [router]);

  // Handle deposit transaction
  const handleDeposit = async () => {
    setMessage("");

    const depositAmount = Number(amount);
    if (depositAmount <= 0 || isNaN(depositAmount)) {
      return setMessage("⚠️ Enter a valid amount!");
    }

    try {
      const res = await fetch("/api/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, amount: depositAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        return setMessage(data.error || "⚠️ Deposit failed! Try again.");
      }

      setMessage(`✅ ₹${depositAmount} deposited successfully!`);
      setAmount("");

      setTimeout(() => router.push("/"), 2000);
    } catch (error) {
      console.error("Deposit Error:", error);
      setMessage("⚠️ Network error, please try again.");
    }
  };

  // Logout function with 2-second delay
  const handleLogout = () => {
    setMessage("⚠️ Logging out...");
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear(); // Clear any session storage if used
      router.replace("/"); // Ensure complete logout by redirecting to the login page
    }, 2000);
  };
  

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200 px-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-black text-center">Deposit Money</h2>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter Amount"
          className="p-3 border rounded w-full"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (Number(e.target.value) > 0) setMessage(""); // Clear error if input is valid
          }}
        />

        {/* Error/Success Message */}
        {message && (
          <p className={`text-lg mt-2 ${message.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-5">
          <Button
            variant="default"
            size="lg"
            className="text-white bg-black hover:bg-gray-800 w-full"
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0 || isNaN(Number(amount))}
          >
            Deposit
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="text-white bg-red-600 hover:bg-red-800 w-full"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
