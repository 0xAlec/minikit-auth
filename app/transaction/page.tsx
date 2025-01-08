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
  const [platform, setPlatform] = useState<string | null>(null);
  const [transactionStatus, setTransactionStatus] = useState<string>('idle');
  const [showSuccess, setShowSuccess] = useState(false);

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
    const platform = localStorage.getItem('platform');
    setPlatform(platform);
  }, []);

  useEffect(() => {
    if (transactionStatus === 'success') {
      const timer = setTimeout(() => {
        setShowSuccess(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [transactionStatus]);

  if (transactionStatus === 'success') {
    if (!showSuccess) {
      return (
        <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
          <main className="flex-grow flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-2xl font-bold">Transaction Pending...</h1>
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"/>
            </div>
          </main>
        </div>
      );
    }

    return (
      <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 p-4 text-center">
            <h1 className="text-2xl font-bold">Transaction Successful</h1>
            <pre className="whitespace-pre-wrap break-words">
              The transaction has been successfully approved. You can now close this window.
            </pre>
            {/* <button 
              onClick={() => {
                window.open(`https://sepolia.basescan.org/tx/${hash}`, '_blank');
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              View in Explorer
            </button> */}
            <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                window.parent.postMessage({ type: 'TRANSACTION_SUCCESS', hash: hash }, '*');
                window.parent.postMessage({ type: 'CLOSE_IFRAME' }, '*');
              }}
            >
              Return to app
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold">Approve Transaction</h1>
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
            {user && <img src={user.photoUrl} alt="User" className="w-16 h-16 rounded-full" />}
            {user && '@' + user.username}
            {platform === 'telegram' && (
              <div className="flex items-center gap-2">
                <pre className="whitespace-pre-wrap break-words">
                  Signing with
                </pre>
                <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png'} alt="Telegram" className="w-8 h-8 rounded-full" />
              </div>
            )}
            <button 
              onClick={async() => {
                if (client && data) {
                    setTransactionStatus('pending');
                    const hash = await client.sendTransaction(data)
                    setHash(hash)
                    setTransactionStatus('success');
                }
              }}
              disabled={transactionStatus !== 'idle'}
              className={`font-bold py-2 px-4 rounded flex items-center gap-2 ${
                transactionStatus === 'idle' 
                  ? 'bg-blue-500 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 opacity-50 cursor-not-allowed text-white'
              }`}
            >
              {transactionStatus === 'pending' && (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"/>
              )}
              {transactionStatus === 'pending' ? 'Loading...' : 'Approve'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

