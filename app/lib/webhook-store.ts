// Simple in-memory webhook data store
// In production, use a database, Redis, or other persistent storage

interface WebhookData {
  id: string;
  data: any;
  timestamp: string;
}

class WebhookStore {
  private latestWebhook: WebhookData | null = null;

  setWebhookData(data: WebhookData): void {
    this.latestWebhook = data;
  }

  getLatestWebhook(): WebhookData | null {
    return this.latestWebhook;
  }

  clearWebhookData(): void {
    this.latestWebhook = null;
  }
}

// Export a singleton instance
export const webhookStore = new WebhookStore();
