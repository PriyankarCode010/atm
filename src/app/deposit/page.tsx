"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Deposit() {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [accountNumber, setAccountNumber] = useState(""); 
  const router = useRouter();

  // Remove token on component mount & fetch account number
  useEffect(() => {
    localStorage.removeItem("token"); // Release token on page load
    const storedAccountNumber = localStorage.getItem("accountNumber");

    if (!storedAccountNumber) {
      setMessage("⚠️ No account found. Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("accountNumber");
        router.replace("/");
      }, 2000);
    } else {
      setAccountNumber(storedAccountNumber);
    }
  }, [router]);

  // Handle deposit transaction
  const handleDeposit = async () => {
    setMessage("");
    if (!accountNumber) return router.push("/");

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
        return setMessage(data.error || "⚠️ Deposit failed! Check console.");
      }

      setMessage(`✅ Amount deposited: ₹${depositAmount}`);
      setAmount("");

      setTimeout(() => {
        router.push("/menu");
      }, 2000);
    } catch (error) {
      console.error("Deposit Error:", error);
      setMessage("⚠️ Network error, please try again.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("accountNumber");
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200 px-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-black">Deposit Money</h2>

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

        {/* Deposit & Logout Buttons */}
        <div className="flex justify-between mt-5">
          <Button
            variant="default"
            size="lg"
            className="text-white bg-black hover:bg-gray-800"
            onClick={handleDeposit}
            disabled={!amount || Number(amount) <= 0 || isNaN(Number(amount))}
          >
            Deposit
          </Button>
          <Button
            variant="destructive"
            size="lg"
            className="text-white bg-red-600 hover:bg-red-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
