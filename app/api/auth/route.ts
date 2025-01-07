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
    let wallet = {
      address: '',
      privateKey: '',
    };

    // TODO: Replace if already found in db
    if (initData.user?.username === 'Alec_Chen') {
      wallet.address = '0x5D0E59eb6aB8fD6B0F315749e9CDDabFFdaaf3e7';
      wallet.privateKey = process.env.PRIVATE_KEY || '';
    } else {
      wallet = generateWallet();
    }

    return NextResponse.json({
      status: 'success',
      user: initData.user,
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
