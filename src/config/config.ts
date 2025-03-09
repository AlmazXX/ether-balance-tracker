export const config = () => ({
  PORT: Number(process.env.PORT) || 4000,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY || '',
});
