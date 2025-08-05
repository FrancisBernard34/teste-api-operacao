import { NextRequest, NextResponse } from 'next/server';
import { webhookStore } from '../../lib/webhook-store';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Store the webhook data
    const webhookData = {
      id: Date.now().toString(),
      data: body,
      timestamp: new Date().toISOString()
    };
    
    webhookStore.setWebhookData(webhookData);

    console.log('Webhook received:', {
      timestamp: webhookData.timestamp,
      data: body
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Webhook received successfully',
      id: webhookData.id
    }, { status: 200 });

  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Failed to process webhook',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
