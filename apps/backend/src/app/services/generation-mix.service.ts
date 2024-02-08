import { Injectable, Logger } from '@nestjs/common';

import { FuelMix, GenerationMix, GenerationWrapper, IntervalData, MeterData } from '../model/domain-objects';
import { IntervalDataService } from '../datasource/interval-data.service';
import { CarbonIntensityService } from '../datasource/carbon-intensity.service';

const fuelMixByDateCache = new Map<Date, FuelMix[]>();

function mapToFuelMix(totalKilowattHoursByFuel: Map<string, number>) {
  const values: FuelMix[] = [];

  totalKilowattHoursByFuel.forEach((value, key) => {
    values.push({ productionType: key, kilowatt: value });
  });

  return values;
}

@Injectable()
export class GenerationMixService {

  private readonly logger = new Logger(GenerationMixService.name);

  constructor(
    private carbonIntensityService: CarbonIntensityService,
    private intervalDataService: IntervalDataService) {
  }

  async getGenerationMix(monthVal: Date): Promise<FuelMix[]> {
    if (fuelMixByDateCache.has(monthVal)) {
      const cachedValue = fuelMixByDateCache.get(monthVal);
      this.logger.debug(`Cached value found for ${monthVal}, value from cache: ${JSON.stringify(cachedValue)}`);
      return Promise.resolve(cachedValue);
    }

    const meterData = await this.intervalDataService.getHalfHourIntervalData(monthVal)
      .then((json: IntervalData) => json.data);

    const generationWrappers = await this.carbonIntensityService.getHalfHourGenerationMixWrapperForMonth(monthVal);

    const mergedData = mergeMeterAndGenerationData(meterData, generationWrappers);

    const totalKilowattHoursByFuel = getTotalKilowattHoursByFuel(mergedData);

    const fuelMixes = mapToFuelMix(totalKilowattHoursByFuel);

    fuelMixByDateCache.set(monthVal, fuelMixes);

    return fuelMixes;
  }

}

function getTotalKilowattHoursByFuel(mergedData: {
  kilowattHours: number;
  generationMix: GenerationMix[];
  time: Date
}[]) {
  const totalKilowattHoursByFuel = new Map<string, number>();

  for (const mergedDatum of mergedData) {
    for (const generationMix of mergedDatum.generationMix) {
      const runningTotalKilowattHours = totalKilowattHoursByFuel.get(generationMix.fuel);

      const halfHourKilowattForFuel = generationMix.perc * 0.01 * mergedDatum.kilowattHours;

      if (runningTotalKilowattHours === undefined) {
        totalKilowattHoursByFuel.set(generationMix.fuel, halfHourKilowattForFuel);
      } else {
        totalKilowattHoursByFuel.set(generationMix.fuel, runningTotalKilowattHours + halfHourKilowattForFuel);
      }
    }
  }
  return totalKilowattHoursByFuel;
}

function mergeMeterAndGenerationData(meterData: MeterData[], generationWrappers: GenerationWrapper[]): {
  time: Date;
  kilowattHours: number;
  generationMix: GenerationMix[];
}[] {
  const energyMixByFromDate = new Map(generationWrappers.map(i => [new Date(i.from).toISOString(), i.generationmix]));

  return meterData.map(meterDatum => {
    const generationMix = energyMixByFromDate.get(new Date(meterDatum.start_interval).toISOString());

    if (generationMix === undefined) {
      throw new Error(`No generationMix value found in map for ${meterDatum.start_interval}`);
    }

    return {
      time: meterDatum.start_interval,
      kilowattHours: meterDatum.consumption,
      generationMix: generationMix
    };
  });
}
