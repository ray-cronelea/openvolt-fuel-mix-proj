import { Injectable, Logger } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

import { CarbonEmitted, Intensity, IntensityWrapper, IntervalData, MeterData } from '../domain-objects';

import moment from 'moment';
import { IntervalDataService } from '../datasource/interval-data.service';
import { CarbonIntensityService } from '../datasource/carbon-intensity.service';

const carbonEmitByDateCache: Map<Date, number> = new Map();

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
      this.logger.log(`Cached value found for ${monthVal}, value from cache: ${cachedValue}`);
      return Promise.resolve({ carbonEmit: cachedValue });
    } else {
      this.logger.log(`Value not in cache for ${monthVal}, performing requests and calculating data'`);
      let meterData = await this.intervalDataService.getHalfHourIntervalData(monthVal)
        .then((json: IntervalData) => json.data);

      const carbonDataPromises: Array<Promise<number>> = this.createCarbonDataPromises(meterData);
      let carbonEmitGrams = (await Promise.all(carbonDataPromises))
        .reduce((sum, current) => sum + current, 0);

      carbonEmitByDateCache.set(monthVal, carbonEmitGrams);
      return {
        carbonEmit: carbonEmitGrams
      };
    }
  }

  createCarbonDataPromises(meterData: Array<MeterData>): Promise<number>[] {

    const carbonDataPromises: Array<Promise<number>> = [];

    for (const meterDatum of meterData) {
      carbonDataPromises.push(this.carbonIntensityService.getHalfHourCarbonIntensityWrapper(moment(meterDatum.start_interval).add(30, 'minutes').toDate())
        .then(intensityWrapper => validateDatesMatch(meterDatum, intensityWrapper))
        .then((intensityWrapper: IntensityWrapper) => intensityWrapper.intensity)
        .then((intensity: Intensity) => intensity.actual)
        .then(actualIntensity => calculateCarbonDioxideGramsProduced(actualIntensity, meterDatum.consumption)));
    }

    return carbonDataPromises;
  }
}


function calculateCarbonDioxideGramsProduced(gramCarbonDioxidePerKilowattHour: number, kilowattHours: number) {
  return gramCarbonDioxidePerKilowattHour * kilowattHours;
}

function dateTimeMatches(date1: Date, date2: Date) {
  return new Date(date1).toISOString() === new Date(date2).toISOString();
}

function validateDatesMatch(meterData: MeterData, intensityWrapper: IntensityWrapper): Promise<IntensityWrapper> {
  return new Promise((resolve, reject) => {
    if (dateTimeMatches(meterData.start_interval, intensityWrapper.from)) {
      resolve(intensityWrapper);
    } else {
      reject(`There was a mismatch between meter data start interval ${intensityWrapper.from} and intensity wrapper from ${meterData.start_interval}`);
    }
  });
}
