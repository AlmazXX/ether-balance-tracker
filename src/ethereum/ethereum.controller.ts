import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { EthereumService } from './ethereum.service';

@Controller('api/ethereum')
export class EthereumController {
  constructor(private readonly ethereumService: EthereumService) {}

  @Get('max-balance-change')
  async getMostImpactedAddress() {
    return this.ethereumService.findMaxBalanceChange();
  }
}
