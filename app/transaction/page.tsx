'use client';

import { User } from '@telegram-apps/init-data-node';
import { useEffect, useState } from 'react';
import { createWalletClient, http, SendTransactionParameters, WalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { baseSepolia } from 'viem/chains';

export default function TransactionPage() {
  const [address, setAddress] = useState<string | null>(null);
  const [data, setData] = useState<SendTransactionParameters | null>(null);
  const [client, setClient] = useState<WalletClient | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (localStorage.getItem('token') === '') {
        console.error('No token found');
        return;
    }

    const account = privateKeyToAccount(localStorage.getItem('token') as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: baseSepolia,
      transport: http(),
    });
    setClient(client);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const encodedData = searchParams.get('data');
    if (encodedData) {
        const jsonString = encodedData.replace(/=$/, '');
        try {
            const decodedData = JSON.parse(jsonString);
            setData(decodedData);
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
    }
    
    const address = localStorage.getItem('address');
    setAddress(address);
  }, []);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setUser(JSON.parse(user));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center gap-4">
            <pre className="whitespace-pre-wrap break-words">
              Application wants your permission to approve the following transaction:
            </pre>
            {data && (
              <div className="w-full max-w-2xl p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
                <pre className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {JSON.stringify(data, null, 2)}
                </pre>
              </div>
            )}
            <pre className="whitespace-pre-wrap break-words">
              Signing with
            </pre>
            {user && <img src={user.photoUrl} alt="User" className="w-16 h-16 rounded-full" />}
            {user && '@' + user.username}
            {hash && <pre className="whitespace-pre-wrap break-words">Hash: {hash}</pre>}
            <button onClick={async() => {
                if (client && data) {
                    const hash = await client.sendTransaction(data)
                    setHash(hash)
                }
            }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Approve
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

