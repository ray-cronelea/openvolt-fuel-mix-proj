import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('energy-consumed')
  getEnergyConsumed() {
    return this.appService.getEnergyConsumed();
  }

  @Get('carbon-emitted')
  getCarbonEmitted() {
    return this.appService.getCarbonEmitted();
  }

}
