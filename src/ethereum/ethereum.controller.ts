import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { BalanceChangeQueryDto } from './dto/balance-change-query.dto';
import { EthereumService } from './ethereum.service';

const DEFAULT_BLOCKS_TO_ANALYZE = 100;
const DEFAULT_CONCURRENT_REQUESTS = 3;

@Controller('api/ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('max-balance-change')
  async getMostImpactedAddress(
    @Query(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    query: BalanceChangeQueryDto,
  ) {
    const blocksToAnalyze = query.blocks || DEFAULT_BLOCKS_TO_ANALYZE;
    const requestsCount =
      query.concurrentRequests || DEFAULT_CONCURRENT_REQUESTS;

    return this.ethereumService.findMaxBalanceChange(
      blocksToAnalyze,
      requestsCount,
    );
  }
}
