"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Balance() {
  const router = useRouter();
  const [balance, setBalance] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const accountNumber = localStorage.getItem("accountNumber");
        if (!accountNumber) {
          router.push("/");
          return;
        }

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
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("accountNumber");
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-200">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-bold mb-6 text-black">Account Balance</h2>
        <p className="text-xl text-black">Your Balance: ₹{balance}</p>

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
