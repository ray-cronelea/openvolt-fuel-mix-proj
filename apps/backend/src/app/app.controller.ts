import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('energy-consumed')
  getEnergyConsumed(@Query('reqDate') reqDate: string) :  Promise<{ energyConsumed: number }> {
    console.log("Querying for date: " + reqDate)
    return this.appService.getEnergyConsumed(reqDate);
  }

  @Get('carbon-emitted')
  getCarbonEmitted(@Query('reqDate') reqDate: string) {
    return this.appService.getCarbonEmitted(reqDate);
  }

}
