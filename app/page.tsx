'use client';

import { useEffect, useState } from 'react';

const INITDATA = 'init_data';
const PLATFORM = 'platform';
const BOT_ID = 'bot_id';

export default function App() {
  const [message, setMessage] = useState<string>('Loading...');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('randomValue');
    if (stored) {
      setMessage(stored);
    } else {
      const newValue = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('randomValue', newValue);
      setMessage(newValue);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const initData = searchParams.get(INITDATA);
      const platform = searchParams.get(PLATFORM);
      const botId = searchParams.get(BOT_ID);

      try {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [INITDATA]: initData,
            [PLATFORM]: platform,
            [BOT_ID]: botId,
          }),
        });
        const data = await response.json();
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error loading message');
      }
    };

    // fetchMessage();
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
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
