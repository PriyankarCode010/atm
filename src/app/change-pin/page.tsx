"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePin } from "@/lib/firebaseActions";

export default function ChangePin() {
  const router = useRouter();
  const [newPin, setNewPin] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  useEffect(() => {
    // Access localStorage inside useEffect to ensure it's client-side
    const storedAccountNumber = localStorage.getItem("accountNumber") || "";
    setAccountNumber(storedAccountNumber);
  }, []);

  const handleChangePin = async () => {
    if (!newPin || newPin.length !== 4) {
      alert("Enter a 4-digit PIN!");
      return;
    }
    if (!accountNumber) {
      alert("Account number is missing.");
      return;
    }
    try {
      await updatePin(accountNumber, newPin);
      alert("PIN updated successfully!");
      router.push("/menu");
    } catch (error) {
      console.error("Error updating PIN:", error);
      alert("Failed to update PIN. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-black font-bold text-3xl py-4">Change PIN</h1>
        <Input
          type="password"
          placeholder="New 4-digit PIN"
          className="w-full p-3 border"
          value={newPin}
          onChange={(e) => setNewPin(e.target.value)}
        />
        <Button
          onClick={handleChangePin}
          className="bg-black text-white mt-4 w-full"
        >
          Update PIN
        </Button>
      </div>
    </div>
  );
}
