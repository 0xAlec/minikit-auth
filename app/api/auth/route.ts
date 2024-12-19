import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.randomString) {
      return NextResponse.json(
        { error: 'Random string is required' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Success',
      receivedString: data.randomString,
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
