import { Injectable, Logger } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';

import { CarbonEmitted, EnergyConsumed } from './DomainObjects';

import moment from 'moment';
import axios from 'axios';

type IntervalData = {
  startInterval: Date,
  endInterval: Date,
  granularity: string,
  data: Array<MeterData>
}

type MeterData = {
  start_interval: Date;
  meter_id: string;
  meter_number: string;
  customer_id: string;
  consumption: number;
  consumption_units: string;
};

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

      let promise = this.getMonthlyIntervalData({ monthVal })
        .then((intervalData: IntervalData) => intervalData.data);

      return promise
        .then((meterData : Array<MeterData>) => meterData[0])
        .then((meterDatum: MeterData) => meterDatum.consumption)
        .then(energyConsumption => {
          energyConsumedByDateCache.set(monthVal, energyConsumption)
          return { energyConsumed: energyConsumption }
        })
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
      let meterDatas = await this.getHalfHourIntervalData(monthVal)
        .then((json: IntervalData) => json.data);

      var carbonDataPromises: Array<Promise<number>> = createCarbonDataPromises(meterDatas);
      let carbonEmitGrams = (await Promise.all(carbonDataPromises))
        .reduce((sum, current) => sum + current, 0);

      carbonEmitByDateCache.set(monthVal, carbonEmitGrams);
      return {
        carbonEmit: carbonEmitGrams
      };
    }
  }

  async getMonthlyIntervalData({ monthVal }: { monthVal: Date; }) : Promise<IntervalData> {
    const params = {
      meter_id: '6514167223e3d1424bf82742',
      granularity: 'month',
      start_date: moment(monthVal).toISOString(),
      end_date: moment(monthVal)
        .add(1, 'month')
        .subtract(1, 'second')
        .toISOString()
    };

    const headers = {
      accept: 'application/json',
      'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR'
    };

    return await axios
      .get('https://api.openvolt.com/v1/interval-data', { params, headers })
      .then(res => res.data)
  }

  private async getHalfHourIntervalData(monthVal: Date): Promise<IntervalData> {
    const params = {
      meter_id: '6514167223e3d1424bf82742',
      granularity: 'hh',
      start_date: moment(monthVal).toISOString(),
      end_date: moment(monthVal)
        .add(1, 'month')
        .subtract(1, 'second')
        .toISOString()
    };

    const headers = {
      accept: 'application/json',
      'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR'
    };

    return await axios
      .get('https://api.openvolt.com/v1/interval-data', { params, headers })
      .then(res => res.data);
  }
}

function createCarbonDataPromises(meterDatas: Array<MeterData>): Promise<number>[] {
  const headers = {
    Accept: 'application/json'
  };

  const promises: Array<Promise<number>> = [];
  for (const meterData of meterDatas) {
    const consumption_kwh = meterData.consumption;
    const time = meterData.start_interval;

    promises.push(
      axios
        .get(`https://api.carbonintensity.org.uk/intensity/${time}`, { headers })
        .then(res => res.data)
        .then(json => json.data[0].intensity)
        .then(intensity => intensity.actual)
        .then(actualIntensity => actualIntensity * consumption_kwh)
    );
  }

  return promises;
}
