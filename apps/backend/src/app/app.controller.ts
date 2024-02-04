import { Controller, Get, Logger, Query } from '@nestjs/common';

import { AppService } from './app.service';
import { CarbonEmitted, EnergyConsumed } from './DomainObjects';

@Controller()
export class AppController {

  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {
  }

  @Get() getData() {
    return this.appService.getData();
  }

  @Get('energy-consumed') getEnergyConsumed(@Query('reqDate') reqDate: Date): Promise<EnergyConsumed> {
    this.logger.log('GET energy-consumed with reqDate: ' + reqDate);
    return this.appService.getEnergyConsumed(reqDate);
  }

  @Get('carbon-emitted') getCarbonEmitted(@Query('reqDate') reqDate: Date): Promise<CarbonEmitted> {
    this.logger.log('GET carbon-emitted with reqDate: ' + reqDate);
    return this.appService.getCarbonEmitted(reqDate);
  }

}
