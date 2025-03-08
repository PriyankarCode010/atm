// Menu.js
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Adjust the path as necessary

export default function Menu() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const accountNumber = localStorage.getItem('accountNumber');

    if (!accountNumber) {
      router.push('/');
    } else {
      setIsAuthenticated(true);
      fetchUserName(accountNumber);
    }
  }, [router]);

  const fetchUserName = async (accountNumber: string) => {
    try {
      const userDocRef = doc(db, 'users', accountNumber);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setUserName(userData.name || 'User');
      } else {
        console.error('No such user document!');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
      <h2 className="text-3xl font-bold text-center mb-2">Welcome, {userName}!</h2>
      <h3 className="text-2xl text-center mb-6">ATM Menu</h3>

      {/* Menu Buttons */}
      <div className="grid grid-cols-2 gap-4 w-3/4">
        {[
          { label: 'Withdraw', path: '/withdraw' },
          { label: 'Deposit', path: '/deposit' },
          { label: 'Balance Inquiry', path: '/balance' },
          { label: 'Mini Statement', path: '/mini-statement' },
        ].map(({ label, path }) => (
          <Button
            key={path}
            className="w-full py-16 bg-black hover:bg-gray-700 text-white text-xl font-bold rounded-lg"
            onClick={() => router.push(path)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Logout Button */}
      <Button
        variant="destructive"
        className="mt-6 bg-red-600 hover:bg-red-800 text-white px-6 py-3 text-lg font-bold rounded-lg"
        onClick={() => {
          localStorage.removeItem('accountNumber');
          router.push('/');
        }}
      >
        Logout
      </Button>
    </div>
  );
}
