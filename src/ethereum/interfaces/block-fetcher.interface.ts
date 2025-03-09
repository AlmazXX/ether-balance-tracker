import { HttpService } from '@nestjs/axios';
import { Transform, TransformCallback } from 'stream';

export class BlockFetcher extends Transform {
  private retryCount = 3;
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
    let attempts = 0;

    while (attempts < this.retryCount) {
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
        this.activeRequests--;
        callback();
        return this.processQueue();
      } catch (error) {
        if (++attempts === this.retryCount) {
          this.activeRequests--;
          callback(error instanceof Error ? error : new Error(String(error)));
          return this.processQueue();
        }

        await new Promise((res) =>
          setTimeout(res, Math.pow(2, attempts) * 1000),
        );
      }
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
