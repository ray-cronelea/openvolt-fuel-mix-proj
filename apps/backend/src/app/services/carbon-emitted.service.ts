import { Injectable, Logger } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

import { CarbonEmitted, IntensityWrapper, IntervalData, MeterData } from '../model/domain-objects';

import { IntervalDataService } from '../datasource/interval-data.service';
import { CarbonIntensityService } from '../datasource/carbon-intensity.service';

const carbonEmitByDateCache = new Map<Date, number>();

@Injectable()
export class CarbonEmittedService {

  private readonly logger = new Logger(CarbonEmittedService.name);

  constructor(
    private carbonIntensityService: CarbonIntensityService,
    private intervalDataService: IntervalDataService) {
  }

  getData(): { message: string } {
    return { message: myLib() };
  }

  async getCarbonEmitted(monthVal: Date): Promise<CarbonEmitted> {
    if (carbonEmitByDateCache.has(monthVal)) {
      const cachedValue = carbonEmitByDateCache.get(monthVal);
      this.logger.debug(`Cached value found for ${monthVal}, value from cache: ${cachedValue}`);
      return Promise.resolve({ carbonEmit: cachedValue });
    } else {

      this.logger.log(`Value not in cache for ${monthVal}, performing requests and calculating data'`);

      const meterData = await this.intervalDataService.getHalfHourIntervalData(monthVal)
        .then((json: IntervalData) => json.data);

      const carbonData = await this.carbonIntensityService.getHalfHourCarbonIntensityWrapperForMonth(monthVal);

      const mergedData: {
        time: Date;
        kilowattHours: number;
        gramCarbonDioxidePerKilowattHour: number
      }[] = mergeMeterAndCarbonData(meterData, carbonData);

      const carbonEmitGrams: number = this.computeCarbonEmitGrams(mergedData);

      carbonEmitByDateCache.set(monthVal, carbonEmitGrams);
      return {
        carbonEmit: carbonEmitGrams
      };
    }
  }

  private computeCarbonEmitGrams(mergedData: {
    time: Date;
    kilowattHours: number;
    gramCarbonDioxidePerKilowattHour: number
  }[]) {

    let totalCarbonEmitGrams = 0;
    for (const mergedDatum of mergedData) {
      totalCarbonEmitGrams += calculateCarbonDioxideGramsProduced(mergedDatum.gramCarbonDioxidePerKilowattHour, mergedDatum.kilowattHours);
    }

    return totalCarbonEmitGrams;
  }
}

function mergeMeterAndCarbonData(meterData: MeterData[], carbonData: IntensityWrapper[]): {
  time: Date;
  kilowattHours: number;
  gramCarbonDioxidePerKilowattHour: number;
}[] {

  const carbonEmittedByFromDate = new Map(carbonData.map(i => [new Date(i.from).toISOString(), i.intensity.actual]));

  return meterData.map(meterDatum => {
    const gramCarbonDioxidePerKilowattHour = carbonEmittedByFromDate.get(new Date(meterDatum.start_interval).toISOString());

    if (gramCarbonDioxidePerKilowattHour === undefined) {
      throw new Error(`No gramCarbonDioxidePerKilowattHour value found in map for ${meterDatum.start_interval}`);
    }

    return {
      time: meterDatum.start_interval,
      kilowattHours: meterDatum.consumption,
      gramCarbonDioxidePerKilowattHour: gramCarbonDioxidePerKilowattHour
    };
  });
}

function calculateCarbonDioxideGramsProduced(gramCarbonDioxidePerKilowattHour: number, kilowattHours: number) {
  return gramCarbonDioxidePerKilowattHour * kilowattHours;
}

