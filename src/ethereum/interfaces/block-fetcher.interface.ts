import { HttpService } from '@nestjs/axios';
import { Transform, TransformCallback } from 'stream';

export class BlockFetcher extends Transform {
  constructor(
    private readonly httpService: HttpService,
    private concurrentRequests: number,
  ) {
    super({ objectMode: true });
  }

  _transform(
    blockNum: number,
    _: BufferEncoding,
    callback: TransformCallback,
  ): void {
    callback();
  }
}
