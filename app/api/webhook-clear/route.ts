import { NextRequest, NextResponse } from 'next/server';
import { clearWebhookResponse } from '@/app/lib/webhookState';

export async function POST(request: NextRequest) {
  try {
    clearWebhookResponse();
    
    return NextResponse.json({
      success: true,
      message: 'Webhook response cleared'
    });
  } catch (error) {
    console.error('Error clearing webhook response:', error);
    return NextResponse.json({ 
      error: 'Failed to clear webhook response'
    }, { status: 500 });
  }
}
