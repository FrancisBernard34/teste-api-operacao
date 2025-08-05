# API Test Interface

This is a [Next.js](https://nextjs.org) project that provides an interface to test the AI processing API with webhook responses.

## Features

- Send requests to the AI processing API
- Receive immediate response from the API
- Listen for asynchronous webhook responses from the AI processing
- Real-time polling for webhook responses
- Environment variable configuration for different deployment environments

## Environment Variables

The application requires the following environment variable:

### `NEXT_PUBLIC_TARGET_HOST`

This variable specifies the host where the webhook responses should be delivered.

- **Local development**: `localhost:3000`
- **Vercel deployment**: `your-app-name.vercel.app`

### Setup

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update the `NEXT_PUBLIC_TARGET_HOST` value in `.env.local` for your environment.

### Vercel Deployment

When deploying to Vercel, set the environment variable in your Vercel dashboard:

1. Go to your project settings in Vercel
2. Navigate to "Environment Variables"
3. Add `NEXT_PUBLIC_TARGET_HOST` with the value of your deployed domain (e.g., `your-app-name.vercel.app`)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How It Works

1. Click the "Send API Request" button to trigger the AI processing
2. The immediate response from the API is shown in the small response area
3. The AI processes your request asynchronously
4. The processed response is sent to `{TARGET_HOST}/api/webhook`
5. The frontend polls every 2 seconds for new webhook responses
6. The AI response appears in the large response area when received

## API Endpoints

- `POST /api/webhook` - Receives webhook responses from the AI processing service
- `GET /api/webhook` - Alternative endpoint for webhook responses
- `GET /api/poll` - Polling endpoint for checking new webhook responses

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Don't forget to set the `NEXT_PUBLIC_TARGET_HOST` environment variable in your Vercel project settings to your deployed domain.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
