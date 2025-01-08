'use client';

import { User } from '@telegram-apps/init-data-node';
import { useEffect, useState } from 'react';

const INITDATA = 'init_data';
const PLATFORM = 'platform';
const BOT_ID = 'bot_id';
const WARPCAST_MESSAGE = 'message';
const WARPCAST_SIGNATURE = 'signature';
const WARPCAST_DOMAIN = 'warpcast.com';
const WARPCAST_NONCE = 'nonce';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [platform, setPlatform] = useState<string>('unknown');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const initData = searchParams.get(INITDATA);
      const platform = searchParams.get(PLATFORM);
      const botId = searchParams.get(BOT_ID);

      const warpcastMessage = searchParams.get(WARPCAST_MESSAGE);
      const warpcastSignature = searchParams.get(WARPCAST_SIGNATURE);
      const warpcastDomain = searchParams.get(WARPCAST_DOMAIN);
      const warpcastNonce = searchParams.get(WARPCAST_NONCE);
      
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
            [WARPCAST_MESSAGE]: warpcastMessage,
            [WARPCAST_SIGNATURE]: warpcastSignature,
            [WARPCAST_DOMAIN]: warpcastDomain,
            [WARPCAST_NONCE]: warpcastNonce,
          }),
        });
        const data = await response.json();
        setUser(data.user);
        setPlatform(data.platform);
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('platform', data.platform)
        localStorage.setItem('address', data.address);
        localStorage.setItem('token', data.private_key);
        setAuthenticated(true);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    authenticate();
  }, []);

  useEffect(() => {
    if (authenticated) {
      setTimeout(() => {
        window.parent.postMessage({ type: 'CLOSE_IFRAME' }, '*');
      }, 2500);
    }
  }, [authenticated]);

  return (
    <div className="flex flex-col min-h-screen font-sans dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 bg-white text-black dark:text-white">
      <main className="flex-grow flex items-center justify-center">
        <div className="max-w-4xl w-full p-4">
          <div className="flex flex-col items-center gap-4">
            {user && <img src={user.photoUrl} alt="User" className="w-16 h-16 rounded-full" />}
            <pre className="whitespace-pre-wrap break-words">
              {user && '@' + user.username}
            </pre>
            {platform === 'telegram' && (
              <div className="flex items-center gap-2">
                Authenticated with 
                <img src={'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/2048px-Telegram_logo.svg.png'} alt="Telegram" className="w-8 h-8 rounded-full" />
              </div>
            )}
            {authenticated && (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"/>
                Returning to app...
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
