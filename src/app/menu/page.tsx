"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Menu() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-200">
        <p className="text-lg text-red-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
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

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="mt-6 bg-red-600 hover:bg-red-800 text-white px-6 py-2 text-lg font-bold rounded-lg"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("accountNumber");
          router.push("/login");
        }}
      >
        Logout
      </Button>
    </div>
  );
}
