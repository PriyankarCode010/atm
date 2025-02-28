"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Balance() {
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const accountNumber = localStorage.getItem("accountNumber");
        if (!accountNumber) return;
  
        const res = await fetch(`/api/balance?accountNumber=${accountNumber}`, {
          method: "GET",
        });
  
        const data = await res.json();
        if (res.ok) {
          setBalance(data.balance);
        } else {
          console.error("Error fetching balance:", data.error);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };
  
    fetchBalance();
  }, []);
  

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      <div className="flex justify-between w-full px-6">
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
      <h2 className="text-3xl font-bold mb-6">Account Balance</h2>
      <p className="text-xl">Your Balance: ₹{balance}</p>
    </div>
  );
}
