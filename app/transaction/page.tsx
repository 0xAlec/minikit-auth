'use client';

import { useEffect, useState } from 'react';

export default function TransactionPage() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    // const searchParams = new URLSearchParams(window.location.search);
    // const data = searchParams.get('data');

    const address = localStorage.getItem('address');
    setAddress(address);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center">
            <pre className="whitespace-pre-wrap break-words">
              Signing with {address}
            </pre>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Approve
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

