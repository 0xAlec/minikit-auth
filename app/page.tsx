'use client';

import { useEffect, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState<string>('Waiting for messages...');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('/api/auth');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error loading message');
      }
    };

    fetchMessage();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-background dark:text-white bg-white text-black">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center">
            <pre className="whitespace-pre-wrap break-words">
              {message}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
