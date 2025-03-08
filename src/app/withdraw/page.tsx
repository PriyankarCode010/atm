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

  // Fetch account number & remove token on component mount
  useEffect(() => {
    localStorage.removeItem("token"); // Release token on page load
    const storedAccountNumber = localStorage.getItem("accountNumber");

    if (!storedAccountNumber) {
      setMessage("⚠️ No account found. Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("accountNumber");
        router.push("/");
      }, 2000);
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
    if (!withdrawAmount || withdrawAmount <= 0) return setMessage("⚠️ Enter a valid amount greater than zero.");

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

      // Redirect after successful withdrawal
      setTimeout(() => {
        setAmount("");
        setMessage("");
        router.push("/menu");
      }, 2000);
      
    } catch {
      setLoading(false);
      setMessage("⚠️ Network error, please try again.");
    }    
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("accountNumber");
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200 px-6">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-black">Withdraw Money</h2>

        {/* Account Number Display (Masked) */}
        <p className="mb-3 text-lg font-semibold">Account: {maskAccountNumber(accountNumber)}</p>

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Enter Amount"
          className="p-3 border rounded mb-3 text-center w-full"
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

        {/* Withdraw & Logout Buttons */}
        <div className="flex justify-between mt-5">
          <Button
            variant="default"
            size="lg"
            className="text-white bg-black hover:bg-gray-800"
            onClick={handleWithdraw}
            disabled={loading}
          >
            {loading ? "Processing..." : "Withdraw"}
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
