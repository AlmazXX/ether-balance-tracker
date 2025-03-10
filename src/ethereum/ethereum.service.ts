import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { pipeline } from 'stream';
import { BalanceProcessor } from '../services/balance-processor.service';
import { BlockFetcher } from '../services/block-fetcher.service';

@Injectable()
export class EthereumService {
  constructor(private readonly httpService: HttpService) {}

  private createBlockFetcher(concurrentRequests: number): BlockFetcher {
    return new BlockFetcher(this.httpService, concurrentRequests);
  }

  private createBalanceProcessor(): BalanceProcessor {
    return new BalanceProcessor();
  }

  async getLastBlock() {
    try {
      const { data } = await this.httpService.axiosRef.get('/', {
        params: {
          module: 'proxy',
          action: 'eth_blockNumber',
        },
      });

      if (data.error) {
        throw new Error(`Etherscan API error: ${data.error}`);
      }

      return parseInt(data.result, 16);
    } catch (error) {
      throw error;
    }
  }

  async findMaxBalanceChange(blocksCount: number, concurrentRequests: number) {
    try {
      const lastBlock = await this.getLastBlock();
      const blocks = Array.from(
        { length: blocksCount },
        (_, i) => lastBlock - i,
      );

      const fetcher = this.createBlockFetcher(concurrentRequests);
      const processor = this.createBalanceProcessor();

      return new Promise((res, rej) => {
        pipeline(blocks, fetcher, processor, (error) => {
          if (error) rej(error);
        });

        processor.on('data', (data) => {
          res(data);
        });
      });
    } catch (error) {
      throw error;
    }
  }
}
