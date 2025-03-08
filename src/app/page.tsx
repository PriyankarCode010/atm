"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { verifyUser } from "@/lib/firebaseActions";

export default function Home() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = async () => {
    if (!accountNumber || !pin) return alert("Enter account number and PIN!");

    const response = await verifyUser(accountNumber, pin);
    if (!response.success) return alert("Invalid credentials!");

    // Store account number in local storage
    localStorage.setItem("accountNumber", accountNumber);

    // Redirect based on PIN change requirement
    if (response.needsPinChange) {
      router.push("/change-pin");
    } else {
      router.push("/menu");
    }
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-black font-bold text-3xl py-4">Login</h1>
        <Input
          type="number"
          placeholder="Account Number"
          className="w-full p-3 border"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Input
          type="password"
          placeholder="PIN"
          className="w-full p-3 border mt-3"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <Button onClick={handleLogin} className="bg-black text-white mt-4 w-full">
          Login
        </Button>
      </div>
    </div>
  );
}
