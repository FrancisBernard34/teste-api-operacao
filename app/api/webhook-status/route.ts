import { NextResponse } from 'next/server';
import { webhookStore } from '../../lib/webhook-store';

export async function GET() {
  try {
    const latestWebhook = webhookStore.getLatestWebhook();
    
    return NextResponse.json({
      success: true,
      latestWebhook: latestWebhook
    });
  } catch (error) {
    console.error('Error getting webhook status:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to get webhook status',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
