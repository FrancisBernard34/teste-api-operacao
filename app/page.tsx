'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [response, setResponse] = useState<string>('');
  const [webhookResponse, setWebhookResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [webhookLoading, setWebhookLoading] = useState<boolean>(false);
  const [lastPolledTimestamp, setLastPolledTimestamp] = useState<number>(0);
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Function to poll for webhook responses
  const pollForWebhookResponse = async () => {
    try {
      const pollResponse = await fetch(`/api/poll?since=${lastPolledTimestamp}`);
      const data = await pollResponse.json();
      
      if (data.hasNew && data.response) {
        setWebhookResponse(data.response);
        setLastPolledTimestamp(data.timestamp);
        setWebhookLoading(false);
        
        // Stop polling once we get a response
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
      }
    } catch (error) {
      console.error('Polling error:', error);
    }
  };

  // Start polling for webhook responses
  const startPolling = () => {
    setWebhookLoading(true);
    setWebhookResponse('');
    setLastPolledTimestamp(Date.now());
    
    // Poll every 2 seconds
    pollingIntervalRef.current = setInterval(pollForWebhookResponse, 2000);
    
    // Stop polling after 5 minutes
    setTimeout(() => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        setWebhookLoading(false);
      }
    }, 300000); // 5 minutes
  };

  // Clean up polling on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const callAPI = async () => {
    setLoading(true);
    setError('');
    setResponse('');

    try {
      const targetHost = process.env.NEXT_PUBLIC_TARGET_HOST || 'localhost:3000';
      const webhookUrl = `${targetHost}/api/webhook`;
      
      console.log('Sending request with targetHost:', webhookUrl);
      
      const apiResponse = await fetch(
        'https://webhook.operacaocodigodeouro.com.br/webhook/interview_expert?email=francisbernardcontato@gmail.com',
        {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer OP_HACKATHON_2025',
            'targetHost': webhookUrl
          }
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`HTTP error! status: ${apiResponse.status}`);
      }

      const data = await apiResponse.text();
      setResponse(data);
      
      // Start polling for the webhook response
      startPolling();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Test webhook endpoint
  const testWebhook = async () => {
    try {
      // For testing, use the current origin (same domain) to avoid CORS issues
      const testResponse = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          message: 'This is a test webhook response',
          timestamp: new Date().toISOString()
        })
      });
      
      const result = await testResponse.json();
      console.log('Test webhook result:', result);
      alert('Test webhook sent! Check the AI Processing Response section.');
    } catch (error) {
      console.error('Test webhook error:', error);
      alert('Test webhook failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl font-bold">API Test Interface</h1>
        
        <div className="flex gap-4">
          <button
            onClick={callAPI}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            {loading ? 'Sending Request...' : 'Send API Request'}
          </button>
          
          <button
            onClick={testWebhook}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Test Webhook
          </button>
        </div>

        {/* Immediate API Response - Small Space */}
        <div className="w-full max-w-4xl">
          <h3 className="text-md font-semibold mb-2">Immediate Response:</h3>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-2 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div className="border border-gray-300 rounded p-2 h-[50px] bg-gray-50 text-sm overflow-auto">
            {loading ? (
              <span className="text-gray-500 italic">Sending request...</span>
            ) : response ? (
              <span className="text-green-600">{response}</span>
            ) : (
              <span className="text-gray-500 italic">No immediate response yet</span>
            )}
          </div>
        </div>

        {/* Webhook Response - Large Space */}
        <div className="w-full max-w-4xl">
          <h2 className="text-lg font-semibold mb-4">AI Processing Response:</h2>
          
          <div className="border border-gray-300 rounded-lg p-4 min-h-[400px] bg-gray-50">
            {webhookLoading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-gray-600">Waiting for AI to process your request...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
              </div>
            ) : webhookResponse ? (
              <div>
                <div className="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded mb-4 text-sm">
                  ✅ Response received from AI processing
                </div>
                <pre className="whitespace-pre-wrap text-sm bg-white p-4 rounded border overflow-auto max-h-96">
                  {webhookResponse}
                </pre>
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 italic text-lg">No AI response yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Click "Send API Request" to start the AI processing
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Information */}
        <div className="w-full max-w-4xl text-sm text-gray-600">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Click the button to send a request to the AI processing API</li>
            <li>The API will process your request asynchronously</li>
            <li>The AI response will be delivered to <code className="bg-gray-200 px-1 rounded">{process.env.NEXT_PUBLIC_TARGET_HOST || 'localhost:3000'}/api/webhook</code></li>
            <li>This page polls for new responses every 2 seconds</li>
            <li>The response will appear in the "AI Processing Response" section above</li>
          </ul>
        </div>
      </main>
    </div>
  );
}