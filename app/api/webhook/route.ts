import { NextRequest, NextResponse } from 'next/server';
import { setWebhookResponse } from '@/app/lib/webhookState';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, targetHost',
};

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Handle different content types
    const contentType = request.headers.get('content-type');
    let body: any;
    
    if (contentType?.includes('application/json')) {
      body = await request.json();
      body = JSON.stringify(body, null, 2); // Pretty format JSON
    } else {
      body = await request.text();
    }
    
    setWebhookResponse(body);
    
    console.log('Webhook POST received:', {
      contentType,
      headers: Object.fromEntries(request.headers.entries()),
      body: body
    });
    
    return NextResponse.json({ 
      success: true, 
      received: true,
      message: 'Webhook received successfully'
    }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error processing webhook POST:', error);
    return NextResponse.json({ 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryParams = url.searchParams.toString();
    
    if (queryParams) {
      setWebhookResponse(`GET request with params: ${queryParams}`);
      console.log('Webhook GET received with params:', queryParams);
    } else {
      console.log('Webhook GET received (health check)');
      return NextResponse.json({ 
        status: 'healthy',
        message: 'Webhook endpoint is ready to receive POST requests'
      }, {
        status: 200,
        headers: corsHeaders,
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      received: true 
    }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Error processing webhook GET:', error);
    return NextResponse.json({ 
      error: 'Failed to process webhook',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { 
      status: 500,
      headers: corsHeaders,
    });
  }
}
