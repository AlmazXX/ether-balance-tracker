# Ethereum Balance Analysis API

This application allows you to analyze Ethereum blockchain data to find addresses with the most significant balance changes over a specified number of recent blocks.

## Features

- Analyze recent Ethereum blocks to find addresses with the largest balance changes
- Configurable number of blocks to analyze
- Adjustable concurrent request count for performance optimization

## API Endpoints

### Get Address with Maximum Balance Change

```
GET /api/ethereum/max-balance-change
```

**Query Parameters:**

- `blocks` (optional): Number of recent blocks to analyze (default: 10, max: 100)
- `concurrentRequests` (optional): Number of concurrent requests to the Etherscan API (default: 3, min: 5)

**Example:**

```
GET /api/ethereum/max-balance-change?blocks=20&concurrentRequests=10
```

**Response:**

```json
{
  "address": "0x123...",
  "changeInWei": "1000000000000000000",
  "changeInEth": "1.0",
  "stats": {
    "blocksProcessed": 20,
    "transactionsProcessed": 1500
  }
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
- Implements adaptive rate limiting to avoid Etherscan API rate limits
