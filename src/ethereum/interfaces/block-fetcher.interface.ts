import { HttpService } from '@nestjs/axios';
import { Transform, TransformCallback } from 'stream';

export class BlockFetcher extends Transform {
  private activeRequests = 0;
  private queue: Array<{ blockNum: number; callback: TransformCallback }> = [];
  constructor(
    private readonly httpService: HttpService,
    private concurrentRequests: number,
  ) {
    super({ objectMode: true });
  }

  private async processQueue() {
    while (
      this.queue.length > 0 &&
      this.activeRequests < this.concurrentRequests
    ) {
      const next = this.queue.shift();

      if (next) {
        await this.fetchBlock(next.blockNum, next.callback);
      }
    }
  }

  private async fetchBlock(blockNum: number, callback: TransformCallback) {
    this.activeRequests++;
    try {
      const hexBlockNum = `0x${blockNum.toString(16)}`;
      const { data } = await this.httpService.axiosRef.get('', {
        params: {
          module: 'proxy',
          action: 'eth_getBlockByNumber',
          boolean: true,
          tag: hexBlockNum,
        },
      });

      if (data.error) {
        throw new Error(`Etherscan API error: ${data.error}`);
      }

      this.push(data.result.transactions || []);
    } catch (error) {
      callback(error instanceof Error ? error : new Error(String(error)));
    } finally {
      this.activeRequests--;
      callback();
      this.processQueue();
    }
  }

  _transform(
    blockNum: number,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    if (this.activeRequests < this.concurrentRequests) {
      this.fetchBlock(blockNum, callback);
    } else {
      this.queue.push({ blockNum, callback });
    }
  }
}
