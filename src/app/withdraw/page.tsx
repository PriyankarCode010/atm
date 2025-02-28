"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Withdraw() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch account number from localStorage when component loads
  useEffect(() => {
    const storedAccountNumber = localStorage.getItem("accountNumber");
    if (storedAccountNumber) {
      setAccountNumber(storedAccountNumber);
    } else {
      setMessage("⚠️ No account number found. Redirecting...");
      setTimeout(() => router.push("/"), 2000); // Redirect to home/login if no account number
    }
  }, [router]);

  // Function to mask account number (e.g., ******7890)
  const maskAccountNumber = (accNum: string) => {
    if (!accNum || accNum.length < 4) return "Invalid Account";
    return `******${accNum.slice(-4)}`;
  };

  const handleWithdraw = async () => {
    setMessage("");
    const withdrawAmount = Number(amount);

    if (!accountNumber) {
      return setMessage("⚠️ Account number is missing.");
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      return setMessage("⚠️ Enter a valid amount greater than zero.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountNumber, amount: withdrawAmount }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setMessage(data.error || "⚠️ Withdrawal failed!");

      setMessage(`✅ Withdrawal successful: ₹${withdrawAmount}`);

      // ✅ Add a 2-second delay before resetting fields
      setTimeout(() => {
        setAmount("");
        setMessage("");
        router.back();
      }, 2000);
      
    } catch (error) {
      setLoading(false);
      setMessage("⚠️ Network error, please try again.");
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200 px-6">
      {/* Back Button */}
      <div className="w-full flex justify-start">
        <Link href="/menu">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-800 hover:text-gray-500 cursor-pointer"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6">Withdraw Money</h2>

      {/* Account Number Display (Masked) */}
      <p className="mb-3 text-lg font-semibold">Account: {maskAccountNumber(accountNumber)}</p>

      {/* Amount Field */}
      <input
        type="number"
        placeholder="Enter Amount"
        className="p-3 border rounded mb-3 text-center w-60"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
      />

      {/* Message */}
      {message && (
        <p className={`mt-2 text-lg ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
          {message}
        </p>
      )}

      {/* Withdraw Button */}
      <button
        className="bg-black text-white px-6 py-2 rounded mt-3 disabled:bg-gray-500"
        onClick={handleWithdraw}
        disabled={loading}
      >
        {loading ? "Processing..." : "Withdraw"}
      </button>
    </div>
  );
}
