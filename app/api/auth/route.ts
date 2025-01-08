import { NextRequest, NextResponse } from 'next/server';
import { parse, validate3rd } from '@telegram-apps/init-data-node';
import { createAppClient, viemConnector } from '@farcaster/auth-client';
import { Wallet } from 'ethers';

export async function POST(request: NextRequest) {
  const data = await request.json();
  const missingFields = [];

  console.log(data);

  if (data.platform === 'telegram') {
    if (!data.init_data) missingFields.push('init_data');
    if (!data.platform) missingFields.push('platform');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Attempt to validate init data
    try {
      await validate3rd(data.init_data, data.bot_id);
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        { status: 400 }
      );
    }
    // Parse init data
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
      platform: data.platform,
      user: initData.user,
      address: wallet.address,
      private_key: wallet.privateKey,
      authenticated_on: new Date().toISOString(),
    });
  }
  if (data.platform === 'warpcast') {
    if (!data['warpcast_message']) missingFields.push('warpcast_message');
    if (!data['warpcast_signature']) missingFields.push('warpcast_signature');
    if (!data['warpcast_nonce']) missingFields.push('warpcast_nonce');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const appClient = createAppClient({
      ethereum: viemConnector(),
    });

    const verifyResponse = await appClient.verifySignInMessage({
      message: data['warpcast_message'] as string,
      signature: data['warpcast_signature'] as `0x${string}`,
      domain: 'example-tma-app.vercel.app',
      nonce: data['warpcast_nonce'] as string,
    });
    const { success, fid } = verifyResponse;
    if (!success) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const wallet = generateWallet();

    return NextResponse.json({
      status: 'success',
      platform: data.platform,
      user: {
        fid,
        photoUrl: data['warpcast_photo'],
        username: data['warpcast_username'],
      },
      address: wallet.address,
      private_key: wallet.privateKey,
      authenticated_on: new Date().toISOString(),
    });
  }
}

function generateWallet() {
  const wallet = Wallet.createRandom();

  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
  };
}
