'use client';

import { useState, useEffect } from 'react';

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  timestamp?: string;
}

interface WebhookData {
  id: string;
  data: any;
  timestamp: string;
}

export default function Home() {
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [webhookData, setWebhookData] = useState<WebhookData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Polling function to check for webhook responses
  const pollWebhookData = async () => {
    try {
      const response = await fetch('/api/webhook-status');
      if (response.ok) {
        const data = await response.json();
        if (data.latestWebhook) {
          setWebhookData(data.latestWebhook);
          setIsPolling(false); // Stop polling once we receive the webhook
        }
      }
    } catch (err) {
      console.error('Polling error:', err);
    }
  };

  // Start/stop polling based on isPolling state
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPolling) {
      interval = setInterval(pollWebhookData, 2000); // Poll every 2 seconds
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPolling]);

  const callApi = async () => {
    setLoading(true);
    setError(null);
    setApiResponse(null);
    setWebhookData(null);
    setIsPolling(false);
    
    try {
      const response = await fetch('https://webhook.operacaocodigodeouro.com.br/webhook/interview_expert?email=francisbernardcontato@gmail.com', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer OP_HACKATHON_2025',
          'targetHost': `${process.env.NEXT_PUBLIC_TARGET_HOST}/api/webhook`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiResponse({
          success: true,
          message: 'API call successful',
          data: data,
          timestamp: new Date().toISOString()
        });
        // Start polling for webhook response after successful API call
        setIsPolling(true);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setApiResponse({
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            API Operation Test
          </h1>
          <p className="text-gray-600">
            Click the button to trigger the API call and wait for webhook response
          </p>
        </div>

        {/* API Call Button */}
        <div className="text-center mb-8">
          <button
            onClick={callApi}
            disabled={loading}
            className={`px-6 py-3 rounded-lg text-white font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {loading ? 'Calling API...' : 'Call API'}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-medium mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Immediate API Response */}
        {apiResponse && (
          <div className="mb-6 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Immediate API Response</h3>
            <div className={`p-3 rounded ${apiResponse.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className="flex items-center mb-2">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  apiResponse.success ? 'bg-green-500' : 'bg-red-500'
                }`}></span>
                <span className="font-medium">
                  {apiResponse.success ? 'Success' : 'Failed'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{apiResponse.message}</p>
              {apiResponse.data && (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(apiResponse.data, null, 2)}
                </pre>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(apiResponse.timestamp!).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Webhook Response */}
        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Webhook Response</h3>
          {webhookData ? (
            <div className="p-3 bg-blue-50 rounded">
              <div className="flex items-center mb-2">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                <span className="font-medium">Webhook Received</span>
              </div>
              <pre className="text-xs bg-white p-2 rounded overflow-x-auto mb-2">
                {JSON.stringify(webhookData.data, null, 2)}
              </pre>
              <p className="text-xs text-gray-500">
                Received: {new Date(webhookData.timestamp).toLocaleString()}
              </p>
            </div>
          ) : isPolling ? (
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="text-gray-500">Waiting for webhook response...</p>
              <div className="mt-2">
                <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded text-center">
              <p className="text-gray-500">Click "Call API" to start monitoring for webhook responses</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}