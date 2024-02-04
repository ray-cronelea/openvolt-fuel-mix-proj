import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { EnergyConsumedService } from './services/energy-consumed.service';
import { LoggerModule } from './logger/logger.module';
import { CarbonIntensityModule } from './datasource/carbon-intensity.module';
import { IntervalDataModule } from './datasource/interval-data.module';
import { CarbonEmittedService } from './services/carbon-emitted.service';

@Module({
  imports: [LoggerModule, CarbonIntensityModule, IntervalDataModule],
  controllers: [AppController],
  providers: [EnergyConsumedService, CarbonEmittedService],
})
export class AppModule {}
