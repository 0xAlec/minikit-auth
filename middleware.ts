import { NextResponse } from 'next/server';

export function middleware() {
  // Get response
  const response = NextResponse.next();

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

  return response;
}

// Configure which paths should be handled by this middleware
export const config = {
  matcher: '/api/:path*',
};
