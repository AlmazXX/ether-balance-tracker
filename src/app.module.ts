import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { EthereumModule } from './ethereum/ethereum.module';

@Module({
  imports: [ConfigModule.forRoot({ load: [config] }), EthereumModule],
})
export class AppModule {}
