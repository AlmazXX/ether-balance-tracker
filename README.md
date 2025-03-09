# Ethereum Balance Analysis API

This application allows you to analyze Ethereum blockchain data to find addresses with the most significant balance changes over recent 100 blocks.

## Features

- Analyze recent Ethereum blocks to find addresses with the largest balance changes

## API Endpoints

### Get Address with Maximum Balance Change

```
GET /api/ethereum/max-balance-change
```

**Response:**

```json
{
  "address": "0x123...",
  "change": "1000000000000000000"
}
```

## Setup

1. Make sure you have an Etherscan API key set in the environment variables:

   ```
   ETHERSCAN_API_KEY=your_api_key_here
   ```

   You can obtain an Etherscan API key following the instruction: https://docs.etherscan.io/getting-started/viewing-api-usage-statistics

2. Start the application using:
   ```
   npm start
   ```

## Development

- The application runs on port 4000
- For development purposes, use:
  ```
  npm run start:dev
  ```

## Technical Details

- Built with NestJS framework
- Uses a stream-based approach to process blockchain data efficiently
