import { Injectable, Logger } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

import { EnergyConsumed, IntervalData, MeterData } from '../model/domain-objects';
import { IntervalDataService } from '../datasource/interval-data.service';

const energyConsumedByDateCache = new Map<Date, number>();

@Injectable()
export class EnergyConsumedService {

  private readonly logger = new Logger(EnergyConsumedService.name);

  constructor(private intervalDataService: IntervalDataService) {
  }

  getData(): { message: string } {
    return { message: myLib() };
  }

  async getEnergyConsumed(monthVal: Date): Promise<EnergyConsumed> {
    if (energyConsumedByDateCache.has(monthVal)) {
      const cachedValue: number = energyConsumedByDateCache.get(monthVal);
      this.logger.debug(`Cached value found for ${monthVal}, value from cache: ${cachedValue}`);
      return Promise.resolve({ energyConsumed: cachedValue });
    } else {

      return this.intervalDataService.getMonthIntervalData(monthVal)
        .then((intervalData: IntervalData) => intervalData.data)
        .then((meterData: MeterData[]) => meterData[0])
        .then((meterDatum: MeterData) => meterDatum.consumption)
        .then((energyConsumption: number) => {
          energyConsumedByDateCache.set(monthVal, energyConsumption);
          return { energyConsumed: energyConsumption };
        });
    }
  }


}
