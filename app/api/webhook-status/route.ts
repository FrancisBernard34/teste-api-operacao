import { NextRequest, NextResponse } from 'next/server';
import { getWebhookResponse } from '@/app/lib/webhookState';

export async function GET(request: NextRequest) {
  try {
    const state = getWebhookResponse();
    
    return NextResponse.json({
      hasResponse: !!state.latestResponse,
      response: state.latestResponse,
      timestamp: state.responseTimestamp
    });
  } catch (error) {
    console.error('Error getting webhook status:', error);
    return NextResponse.json({ 
      hasResponse: false,
      error: 'Failed to get webhook status'
    }, { status: 500 });
  }
}
