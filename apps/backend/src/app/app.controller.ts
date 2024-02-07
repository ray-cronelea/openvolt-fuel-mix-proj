import { Controller, Get, Logger, Query } from '@nestjs/common';

import { EnergyConsumedService } from './services/energy-consumed.service';
import { CarbonEmitted, EnergyConsumed } from './model/domain-objects';
import { CarbonEmittedService } from './services/carbon-emitted.service';
import { GenerationMixService } from './services/generation-mix.service';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly energyConsumedService: EnergyConsumedService,
    private readonly carbonEmittedService: CarbonEmittedService,
    private readonly generationMixService: GenerationMixService
  ) {
  }

  @Get() getData() {
    return this.energyConsumedService.getData();
  }

  @Get('energy-consumed') getEnergyConsumed(@Query('reqDate') reqDate: Date): Promise<EnergyConsumed> {
    this.logger.log('GET energy-consumed with reqDate: ' + reqDate);
    return this.energyConsumedService.getEnergyConsumed(reqDate);
  }

  @Get('carbon-emitted') getCarbonEmitted(@Query('reqDate') reqDate: Date): Promise<CarbonEmitted> {
    this.logger.log('GET carbon-emitted with reqDate: ' + reqDate);
    return this.carbonEmittedService.getCarbonEmitted(reqDate);
  }

  @Get('energy-mix') getEnergyMix(@Query('reqDate') reqDate: Date) {
    this.logger.log('GET energy-mix with reqDate: ' + reqDate);
    return this.generationMixService.getGenerationMix(reqDate);
  }

}
