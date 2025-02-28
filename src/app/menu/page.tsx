"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      {/* Back Button */}
      <div className="w-full flex justify-start px-6">
        <Button
          variant="ghost"
          className="text-gray-800 hover:text-gray-500"
          onClick={() => router.push("/login")}
        >
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
        </Button>
      </div>

      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-6">ATM Menu</h2>

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-4 w-3/4">
        <Button
          className="w-full py-16 bg-black hover:bg-gray-700 text-white text-xl font-bold rounded-lg"
          onClick={() => router.push("/withdraw")}
        >
          Withdraw
        </Button>
        <Button
          className="w-full py-16 bg-black hover:bg-gray-700 text-white text-xl font-bold rounded-lg"
          onClick={() => router.push("/deposit")}
        >
          Deposit
        </Button>
        <Button
          className="w-full py-16 bg-black hover:bg-gray-700 text-white text-xl font-bold rounded-lg"
          onClick={() => router.push("/balance")}
        >
          Balance Inquiry
        </Button>
        <Button
          className="w-full py-16 bg-black hover:bg-gray-700 text-white text-xl font-bold rounded-lg"
          onClick={() => router.push("/mini-statement")}
        >
          Mini Statement
        </Button>
      </div>
    </div>
  );
}
