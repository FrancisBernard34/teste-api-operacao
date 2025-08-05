import { NextRequest, NextResponse } from 'next/server';
import { setWebhookResponse } from '@/app/lib/webhookState';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    setWebhookResponse(body);
    
    console.log('Webhook POST received:', body);
    
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Error processing webhook POST:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const body = url.searchParams.toString() || await request.text();
    
    if (body) {
      setWebhookResponse(body);
      console.log('Webhook GET received:', body);
    }
    
    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error('Error processing webhook GET:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
