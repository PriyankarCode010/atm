"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");

  const handleOnClick = () => {
    if (!accountNumber) return alert("Please enter your account number!");

    // Store account number in localStorage (temporary)
    localStorage.setItem("accountNumber", accountNumber);

    // Redirect to PIN entry page
    router.push("/pin-entry");
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-black font-bold text-4xl py-5">Enter Account Number</h1>
        <Input
          type="number"
          placeholder="Account Number"
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
        />
        <Button
          variant="default"
          size="lg"
          className="text-white bg-black my-5 hover:bg-gray-800"
          onClick={handleOnClick}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
