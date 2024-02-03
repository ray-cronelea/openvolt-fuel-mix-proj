import { Injectable } from '@nestjs/common';
import { myLib } from '@new-workspace/my-lib';
import moment from 'moment';
import axios from 'axios';

type MeterData = {
  start_interval: Date;
  meter_id: string;
  meter_number: string;
  customer_id: string;
  consumption: number;
  consumption_units: string;
};

const carbonEmitByDate = new Map();
const energyConsumedByDate = new Map();

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: myLib() };
  }

  async getEnergyConsumed(
    monthVal: string
  ): Promise<{ energyConsumed: number }> {
    if (energyConsumedByDate.has(monthVal)) {
      const cachedValue = energyConsumedByDate.get(monthVal);
      console.log(
        'Cached value found for ' +
          monthVal +
          ', value from cache: ' +
          cachedValue
      );
      return Promise.resolve({ energyConsumed: cachedValue });
    } else {
      const start = moment(monthVal);
      const end = start.add(1, 'month');

      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR',
        },
      };

      const params = {
        meter_id: '6514167223e3d1424bf82742',
        granularity: 'month',
        start_date: moment(monthVal).toISOString(),
        end_date: moment(monthVal)
          .add(1, 'month')
          .subtract(1, 'second')
          .toISOString(),
      };

      const headers = {
        accept: 'application/json',
        'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR',
      };

      return axios
        .get('https://api.openvolt.com/v1/interval-data', { params, headers })
        .then((res) => res.data)
        .then((json) => {
          const energyConsumption : number = json.data[0].consumption;
          energyConsumedByDate.set(monthVal, energyConsumption);
          return { energyConsumed: json.data[0].consumption };
        });
    }
  }

  async getCarbonEmitted(monthVal: string): Promise<{ carbonEmit: number }> {
    if (carbonEmitByDate.has(monthVal)) {
      const cachedValue = carbonEmitByDate.get(monthVal);
      console.log(
        'Cached value found for ' +
          monthVal +
          ', value from cache: ' +
          cachedValue
      );
      return Promise.resolve({ carbonEmit: cachedValue });
    } else {
      console.log(
        'Value not in cache for ' +
          monthVal +
          ', performing requests and calculating data'
      );
      const params = {
        meter_id: '6514167223e3d1424bf82742',
        granularity: 'hh',
        start_date: moment(monthVal).toISOString(),
        end_date: moment(monthVal)
          .add(1, 'month')
          .subtract(1, 'second')
          .toISOString(),
      };

      const headers = {
        accept: 'application/json',
        'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR',
      };

      var openvoltRequestPromise: Promise<Array<MeterData>> = axios
        .get('https://api.openvolt.com/v1/interval-data', { params, headers })
        .then((res) => res.data.data);

      return openvoltRequestPromise.then((meterDatas) => {
        var carbonDataPromises: Array<Promise<number>> =
          getCarbonDataPromises(meterDatas);

        return Promise.all(carbonDataPromises).then((values: Array<number>) => {
          const carbonEmitGrams: number = values.reduce(
            (sum, current) => sum + current,
            0
          );
          carbonEmitByDate.set(monthVal, carbonEmitGrams);
          return {
            carbonEmit: carbonEmitGrams,
          };
        });
      });
    }
  }
}

function getCarbonDataPromises(
  meterDatas: Array<MeterData>
): Promise<number>[] {
  const headers = {
    Accept: 'application/json',
  };

  var promises: Array<Promise<number>> = [];

  for (var meterData of meterDatas) {
    var consumption_kwh = meterData.consumption;
    var time = meterData.start_interval;

    var numprom: Promise<number> = axios
      .get('https://api.carbonintensity.org.uk/intensity/' + time, { headers })
      .then((res) => res.data)
      .then((json) => json.data[0].intensity)
      .then((intensity) => intensity.actual)
      .then((actualIntensity) => actualIntensity * consumption_kwh);

    promises.push(numprom);
  }

  return promises;
}
