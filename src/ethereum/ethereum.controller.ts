import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

const MAX_BLOCKS_TO_ANALYZE = 100;
const DEFAULT_BLOCKS_TO_ANALYZE = 100;
const MAX_CONCURRENT_REQUESTS = 5;
const DEFAULT_CONCURRENT_REQUESTS = 3;

@Controller('api/ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('max-balance-change')
  async getMostImpactedAddress(
    @Query('blocks') blocks?: string,
    @Query('concurrentRequests') concurrentRequests?: string,
  ) {
    let blocksToAnalyze = DEFAULT_BLOCKS_TO_ANALYZE;
    let requestsCount = DEFAULT_CONCURRENT_REQUESTS;

    if (blocks) {
      const parsedBlocks = parseInt(blocks, 10);
      if (isNaN(parsedBlocks) || parsedBlocks <= 0) {
        throw new BadRequestException(
          'Blocks parameter must be a positive number',
        );
      }
      if (parsedBlocks > MAX_BLOCKS_TO_ANALYZE) {
        throw new BadRequestException(
          `Cannot analyze more than ${MAX_BLOCKS_TO_ANALYZE} blocks`,
        );
      }
      blocksToAnalyze = parsedBlocks;
    }

    if (concurrentRequests) {
      const parsedRequests = parseInt(concurrentRequests, 10);
      if (isNaN(parsedRequests) || parsedRequests > MAX_CONCURRENT_REQUESTS) {
        throw new BadRequestException(
          `Concurrent requests must be at most ${MAX_CONCURRENT_REQUESTS}`,
        );
      }
      requestsCount = parsedRequests;
    }

    return this.ethereumService.findMaxBalanceChange(
      blocksToAnalyze,
      requestsCount,
    );
  }
}
