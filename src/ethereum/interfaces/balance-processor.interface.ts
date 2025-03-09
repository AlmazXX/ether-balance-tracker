import { Transform, TransformCallback } from 'stream';

export class BalanceProcessor extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: any, _: BufferEncoding, callback: TransformCallback): void {
    callback();
  }
}
