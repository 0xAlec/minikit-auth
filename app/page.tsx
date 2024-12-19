'use client';

import { useEffect, useState } from 'react';

const INITDATA = 'init_data';
const PLATFORM = 'platform';
const BOT_ID = 'bot_id';

export default function App() {
  const [message, setMessage] = useState<string>('Waiting for messages...');

  useEffect(() => {
    const fetchMessage = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const initData = searchParams.get(INITDATA);
      const platform = searchParams.get(PLATFORM);
      const botId = searchParams.get(BOT_ID);
      setMessage(`sending init_data ${initData}, platform ${platform} and bot_id ${botId} to api...`);

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
        setMessage(JSON.stringify(data));
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
