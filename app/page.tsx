'use client';

import { User } from '@telegram-apps/init-data-node';
import { useEffect, useState } from 'react';

const INITDATA = 'init_data';
const PLATFORM = 'platform';
const BOT_ID = 'bot_id';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [platform, setPlatform] = useState<string>('unknown');

  useEffect(() => {
    const authenticate = async () => {
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
        setUser(data.user);
        setPlatform(data.platform);
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('platform', data.platform)
        localStorage.setItem('address', data.address);
        localStorage.setItem('token', data.private_key);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    authenticate();
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center gap-4">
            {user && <img src={user.photoUrl} alt="User" className="w-16 h-16 rounded-full" />}
            <pre className="whitespace-pre-wrap break-words">
              {user && 'Authenticated as ' + user.username}
            </pre>
            {platform === 'telegram' && <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png'} alt="Telegram" className="w-8 h-8 rounded-full" />}
          </div>
        </div>
      </main>
    </div>
  );
}
