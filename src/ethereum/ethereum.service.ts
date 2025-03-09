import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { BalanceProcessor } from './interfaces/balance-processor.interface';
import { BlockFetcher } from './interfaces/block-fetcher.interface';

@Injectable()
export class EthereumService {
  constructor(private readonly httpService: HttpService) {}

  private createBlockFetcher(): BlockFetcher {
    return new BlockFetcher(this.httpService);
  }

  private createBalanceProcessor(): BalanceProcessor {
    return new BalanceProcessor();
  }

  async getLastBlock() {
    try {
      const { data } = await this.httpService.axiosRef.get('', {
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

  async findMaxBalanceChange() {
    try {
      const lastBlock = await this.getLastBlock();
      const blocks = Array.from({ length: 100 }, (_, i) => lastBlock - i);

      return blocks;
    } catch (error) {
      throw error;
    }
  }
}
