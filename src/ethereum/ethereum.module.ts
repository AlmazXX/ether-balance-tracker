import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EthereumController } from './ethereum.controller';
import { EthereumService } from './ethereum.service';

@Module({
  controllers: [EthereumController],
  providers: [EthereumService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          baseURL: 'https://api.etherscan.io/api',
          params: { apiKey: configService.get('ETHERSCAN_API_KEY') },
        };
      },
    }),
  ],
})
export class EthereumModule {}
