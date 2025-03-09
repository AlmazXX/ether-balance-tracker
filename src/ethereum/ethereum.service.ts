import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EthereumService {
  constructor(private readonly httpService: HttpService) {}

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
