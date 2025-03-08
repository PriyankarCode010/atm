"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Withdraw() {
  const [accountNumber, setAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch account number on component mount
  useEffect(() => {
    const storedAccountNumber = localStorage.getItem("accountNumber");

    if (!storedAccountNumber) {
      setMessage("⚠️ No account found. Redirecting...");
      setTimeout(() => router.replace("/"), 2000);
    } else {
      setAccountNumber(storedAccountNumber);
    }
  }, [router]);

  // Function to mask account number (e.g., ******7890)
  const maskAccountNumber = (accNum: string) => {
    return accNum && accNum.length >= 4 ? `******${accNum.slice(-4)}` : "Invalid Account";
  };

  // Handle Withdrawal
  const handleWithdraw = async () => {
    setMessage("");
    const withdrawAmount = Number(amount);

    if (!accountNumber) return setMessage("⚠️ Account number is missing.");
    if (!withdrawAmount || withdrawAmount <= 0 || isNaN(withdrawAmount)) {
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
      setAmount("");

      // Redirect after successful withdrawal
      setTimeout(() => router.push("/"), 2000);
      
    } catch (error) {
      console.error("Withdrawal Error:", error);
      setLoading(false);
      setMessage("⚠️ Network error, please try again.");
    }    
  };

  // Handle Logout with 2-second delay
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
        <h2 className="text-3xl font-bold mb-6 text-black text-center">Withdraw Money</h2>

        {/* Account Number Display (Masked) */}
        <p className="mb-3 text-lg font-semibold text-center">
          Account: {maskAccountNumber(accountNumber)}
        </p>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter Amount"
          className="p-3 border rounded text-center w-full"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (Number(e.target.value) > 0) setMessage(""); // Clear error if input is valid
          }}
          min="1"
        />

        {/* Message */}
        {message && (
          <p className={`mt-2 text-lg text-center ${message.includes("✅") ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}

        {/* Withdraw & Logout Buttons */}
        <div className="flex flex-col gap-3 mt-5">
          <Button
            variant="default"
            size="lg"
            className="text-white bg-black hover:bg-gray-800 w-full"
            onClick={handleWithdraw}
            disabled={loading || !amount || Number(amount) <= 0 || isNaN(Number(amount))}
          >
            {loading ? "Processing..." : "Withdraw"}
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
