import { Transform, TransformCallback } from 'stream';

type Transaction = {
  to: string;
  from: string;
  value: string;
};

const WEI_TO_ETH = Math.pow(10, 18);

export class BalanceProcessor extends Transform {
  private totalBalances: Map<string, bigint>;
  private stats = { blocksProcessed: 0, transactionsProcessed: 0 };
  constructor() {
    super({ objectMode: true });
    this.totalBalances = new Map();
  }

  private weiToEth(wei: string | bigint): string {
    const weiValue = typeof wei === 'string' ? BigInt(wei) : wei;
    const ethValue = Number(weiValue) / WEI_TO_ETH;
    return ethValue.toFixed(18);
  }

  private processTransaction(tx: Transaction) {
    if (!tx.from || !tx.to || !tx.value) return;

    const value = BigInt(tx.value);

    const fromBalance = (this.totalBalances.get(tx.from) || BigInt(0)) - value;
    this.totalBalances.set(tx.from, fromBalance);

    const toBalance = (this.totalBalances.get(tx.to) || BigInt(0)) + value;
    this.totalBalances.set(tx.to, toBalance);
  }

  _transform(
    transactions: Transaction[],
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    try {
      for (const tx of transactions) {
        this.processTransaction(tx);
      }

      this.stats.blocksProcessed++;
      this.stats.transactionsProcessed += transactions.length;
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }

  _flush(callback: TransformCallback): void {
    try {
      let maxChange = BigInt(0);
      let maxAddress = '';

      for (const { 0: address, 1: change } of this.totalBalances.entries()) {
        const absChange = change < 0n ? -change : change;

        if (absChange > maxChange) {
          maxChange = absChange;
          maxAddress = address;
        }
      }

      this.push({
        address: maxAddress,
        change: {
          Wei: maxChange.toString(),
          Eth: this.weiToEth(maxChange),
        },
        stats: this.stats,
      });
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
