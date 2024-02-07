import { Injectable, Logger } from '@nestjs/common';

import { FuelMix, GenerationMix, GenerationWrapper, IntervalData, MeterData } from '../model/domain-objects';
import { IntervalDataService } from '../datasource/interval-data.service';
import { CarbonIntensityService } from '../datasource/carbon-intensity.service';

@Injectable()
export class GenerationMixService {

  private readonly logger = new Logger(GenerationMixService.name);

  constructor(
    private carbonIntensityService: CarbonIntensityService,
    private intervalDataService: IntervalDataService) {
  }

  async getGenerationMix(monthVal: Date): Promise<FuelMix[]> {

    const meterData = await this.intervalDataService.getHalfHourIntervalData(monthVal)
      .then((json: IntervalData) => json.data);

    const generationWrappers = await this.carbonIntensityService.getHalfHourGenerationMixWrapperForMonth(monthVal);

    const mergedData: { kilowattHours: number; generationMix: GenerationMix[]; time: Date }[] = mergeMeterAndGenerationMix(meterData, generationWrappers);

    const map = new Map<string, number>();

    for (const mergedDatum of mergedData) {
      const kilowattHours = mergedDatum.kilowattHours;
      for (const generationMix of mergedDatum.generationMix) {
        const number = map.get(generationMix.fuel);

        const kwCalc = generationMix.perc*0.01*kilowattHours;
        if (number===undefined){
          map.set(generationMix.fuel, kwCalc)
        } else {
          map.set(generationMix.fuel, number+kwCalc)
        }
      }
    }

    const values :FuelMix[] = [];

    map.forEach((value, key) => {
      values.push({productionType:key, kilowatt:value});
    })

    return values;
  }
}

function mergeMeterAndGenerationMix(meterData: MeterData[], generationWrappers: GenerationWrapper[]) {
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
