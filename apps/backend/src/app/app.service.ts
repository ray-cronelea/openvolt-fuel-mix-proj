import { Injectable, Logger } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

import { CarbonEmitted, EnergyConsumed, Intensity, IntensityWrapper, IntervalData, MeterData } from './DomainObjects';

import moment from 'moment';
import { getHalfHourIntervalData, getMonthIntervalData } from './IntervalDataService';
import { getHalfHourCarbonIntensityWrapper } from './CarbonIntensityService';

const carbonEmitByDateCache: Map<Date, number> = new Map();
const energyConsumedByDateCache: Map<Date, number> = new Map();

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: myLib() };
  }

  async getEnergyConsumed(monthVal: Date): Promise<EnergyConsumed> {
    if (energyConsumedByDateCache.has(monthVal)) {
      const cachedValue: number = energyConsumedByDateCache.get(monthVal);
      Logger.log(`Cached value found for ${monthVal}, value from cache: ${cachedValue}`);
      return Promise.resolve({ energyConsumed: cachedValue });
    } else {

      let promise = getMonthIntervalData(monthVal)
        .then((intervalData: IntervalData) => intervalData.data);

      return promise
        .then((meterData: Array<MeterData>) => meterData[0])
        .then((meterDatum: MeterData) => meterDatum.consumption)
        .then(energyConsumption => {
          energyConsumedByDateCache.set(monthVal, energyConsumption);
          return { energyConsumed: energyConsumption };
        });
    }
  }

  async getCarbonEmitted(monthVal: Date): Promise<CarbonEmitted> {
    if (carbonEmitByDateCache.has(monthVal)) {
      const cachedValue = carbonEmitByDateCache.get(monthVal);
      Logger.log(`Cached value found for ${monthVal}, value from cache: ${cachedValue}`);
      return Promise.resolve({ carbonEmit: cachedValue });
    } else {
      Logger.log(
        `Value not in cache for ${monthVal}, performing requests and calculating data'`
      );
      let meterData = await getHalfHourIntervalData(monthVal)
        .then((json: IntervalData) => json.data);

      const carbonDataPromises: Array<Promise<number>> = createCarbonDataPromises(meterData);
      let carbonEmitGrams = (await Promise.all(carbonDataPromises))
        .reduce((sum, current) => sum + current, 0);

      carbonEmitByDateCache.set(monthVal, carbonEmitGrams);
      return {
        carbonEmit: carbonEmitGrams
      };
    }
  }
}

function createCarbonDataPromises(meterData: Array<MeterData>): Promise<number>[] {

  const carbonDataPromises: Array<Promise<number>> = [];

  for (const meterDatum of meterData) {
    carbonDataPromises.push(
      getHalfHourCarbonIntensityWrapper(moment(meterDatum.start_interval).add(30, 'minutes').toDate())
        .then(intensityWrapper => validateDatesMatch(meterDatum, intensityWrapper))
        .then((intensityWrapper: IntensityWrapper) => intensityWrapper.intensity)
        .then((intensity: Intensity) => intensity.actual)
        .then(actualIntensity => calculateCarbonDioxideGramsProduced(actualIntensity, meterDatum.consumption))
    );
  }

  return carbonDataPromises;
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
