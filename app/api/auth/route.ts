import { NextRequest, NextResponse } from 'next/server';
import { parse, validate3rd } from '@telegram-apps/init-data-node';
import { Wallet } from 'ethers';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const missingFields = [];
    if (!data.init_data) missingFields.push('init_data');
    if (!data.bot_id) missingFields.push('bot_id');
    if (!data.platform) missingFields.push('platform');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    await validate3rd(data.init_data, data.bot_id);

    const initData = parse(data.init_data);

    // Create account for user
    const wallet = generateWallet();
    return NextResponse.json({
      status: 'success',
      user_name: initData.user?.username,
      address: wallet.address,
      private_key: wallet.privateKey,
      generated_at: initData.authDate,
      authenticated_on: new Date().toISOString(),
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

function generateWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}
