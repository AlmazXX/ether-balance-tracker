import { Transform, TransformCallback } from 'stream';

type Transaction = {
  to: string;
  from: string;
  value: string;
};

export class BalanceProcessor extends Transform {
  private totalBalances: Map<string, bigint>;
  constructor() {
    super({ objectMode: true });
    this.totalBalances = new Map();
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
        change: maxChange.toString(),
      });
      callback();
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    }
  }
}
