import { NextRequest, NextResponse } from 'next/server';
import { getWebhookResponse, hasNewResponse } from '@/app/lib/webhookState';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const since = url.searchParams.get('since');
  const sinceTimestamp = since ? parseInt(since) : 0;
  
  const state = getWebhookResponse();
  
  // Only return response if it's newer than the requested timestamp
  if (hasNewResponse(sinceTimestamp)) {
    return NextResponse.json({
      response: state.latestResponse,
      timestamp: state.responseTimestamp,
      hasNew: true
    });
  }
  
  return NextResponse.json({
    response: null,
    timestamp: state.responseTimestamp,
    hasNew: false
  });
}
