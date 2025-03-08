"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Transactions() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");

  // Retrieve stored account number & fetch transactions
  useEffect(() => {
    const storedAccount = localStorage.getItem("accountNumber");
    if (!storedAccount) {
      router.push("/");
      return;
    }
    setAccountNumber(storedAccount);
    fetchTransactions(storedAccount);
  }, [router]);

  // Fetch last 5 transactions
  const fetchTransactions = async (accountNumber: string) => {
    try {
      const res = await fetch(`/api/transactions?accountNumber=${accountNumber}`);
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to fetch transactions");
        return;
      }

      setTransactions(data.transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setMessage("Something went wrong.");
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("accountNumber");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-black font-bold text-3xl py-4">Recent Transactions</h1>

        {message && <p className="text-red-500 mb-4">{message}</p>}

        {transactions.length > 0 ? (
          <ul className="space-y-4">
            {transactions.map((txn, index) => (
              <li key={index} className="border p-3 rounded-lg bg-gray-100">
                <p className="text-black font-medium">
                  <span className="capitalize">{txn.type}</span>:{" "}
                  <span className={txn.type === "deposit" ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    ₹{txn.amount}
                  </span>
                </p>
                <p className="text-sm text-gray-600">{new Date(txn.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}

        <div className="flex justify-between mt-5">
          <Button
            variant="outline"
            size="lg"
            className="text-black border-black hover:bg-gray-300"
            onClick={() => router.back()}
          >
            Back
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
