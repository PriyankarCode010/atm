"use client"; // For App Router
import { addDemoUser, verifyUser } from "@/lib/firebaseActions";

export default function Home() {
  const handleAddUser = async () => {
    await addDemoUser();
  };

  const handleVerifyUser = async () => {
    const isValid = await verifyUser("1234567890", "1234"); // Replace with real input
    alert(isValid ? "Login Success!" : "Invalid PIN");
  };

  return (
    <div className="p-6">
      <button onClick={handleAddUser} className="bg-blue-500 text-white p-2 rounded m-2">
        Add Demo User
      </button>
      <button onClick={handleVerifyUser} className="bg-green-500 text-white p-2 rounded m-2">
        Verify User
      </button>
    </div>
  );
}
