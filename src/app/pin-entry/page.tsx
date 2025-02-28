    "use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function PinEntry() {
  const router = useRouter();
  const [accountNumber, setAccountNumber] = useState("");
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");

  // Retrieve stored account number
  useEffect(() => {
    const storedAccount = localStorage.getItem("accountNumber");
    if (!storedAccount) {
      router.push("/");
    } else {
      setAccountNumber(storedAccount);
    }
  }, [router]);

  // Handle PIN submission
  const handleSubmit = async () => {
    if (!pin) return setMessage("Please enter your ATM PIN!");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountNumber, pin }),
    });

    const data = await res.json();
    if (!res.ok) return setMessage(data.error || "Invalid credentials");

    // Store authentication token
    localStorage.setItem("token", data.token);

    // Redirect to ATM Menu
    router.push("/menu");
  };

  return (
    <div className="h-screen bg-gray-200 flex flex-col justify-center items-center">
      <div className="flex flex-col items-center bg-white p-10 rounded-lg shadow-lg">
        <h1 className="text-black font-bold text-4xl py-5">Enter ATM PIN</h1>
        <Input
          type="password"
          placeholder="ATM PIN"
          maxLength={4}
          className="w-full p-3 border border-gray-300 rounded-lg"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        {message && <p className="text-red-500 mt-2">{message}</p>}
        <Button
          variant="default"
          size="lg"
          className="text-white bg-black my-5 hover:bg-gray-800"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
