import { NextRequest, NextResponse } from 'next/server';
import { validate3rd } from '@telegram-apps/init-data-node';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    return NextResponse.json(data);

    if (!data.initData || !data.botId) {
      return NextResponse.json(
        { error: 'initData and botId are required' },
        { status: 400 }
      );
    }

    await validate3rd(data.initData, data.botId);

    return NextResponse.json({
      message: 'Success',
      authenticated: 'true',
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const randomString = searchParams.get('string');

  if (!randomString) {
    return NextResponse.json(
      { error: 'Random string is required as a query parameter' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message: 'Success',
    receivedString: randomString,
  });
}
