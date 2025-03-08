export const config = () => ({
  port: Number(process.env.PORT) || 4000,
  ether_api_key: String(process.env.ETHER_API_KEY) || '',
  ether_api_url:
    String(process.env.ETHER_API_URL) || 'https://api.etherscan.io/api',
});
