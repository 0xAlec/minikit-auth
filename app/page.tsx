'use client';

import { useEffect, useState } from 'react';

export default function App() {
  const [message, setMessage] = useState<string>('Waiting for messages...');

  useEffect(() => {
    // Listen for messages from parent window
    const handleMessage = (event: MessageEvent) => {
      setMessage(JSON.stringify(event.data, null, 2));
    };

    window.addEventListener('message', handleMessage);

    // Signal to parent that iframe is ready
    window.parent.postMessage({ type: 'IFRAME_READY' }, '*');

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('message', handleMessage);
    };
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
