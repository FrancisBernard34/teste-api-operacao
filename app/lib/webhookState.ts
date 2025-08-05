// Shared state for webhook responses
// In production, you'd use a database, Redis, or other persistent storage

interface WebhookState {
  latestResponse: any;
  responseTimestamp: number;
}

let state: WebhookState = {
  latestResponse: null,
  responseTimestamp: 0
};

export function setWebhookResponse(response: any) {
  state.latestResponse = response;
  state.responseTimestamp = Date.now();
}

export function getWebhookResponse() {
  return state;
}

export function hasNewResponse(since: number): boolean {
  return state.responseTimestamp > since;
}
