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

@Injectable()
export class AppService {
  getData(): { message: string } {
    return { message: myLib() };
  }

  async getEnergyConsumed(
    monthVal: string
  ): Promise<{ energyConsumed: number }> {
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

    console.log(params);

    return axios
      .get('https://api.openvolt.com/v1/interval-data', { params, headers })
      .then((res) => res.data)
      .then((json) => {
        console.log(json);
        return { energyConsumed: json.data[0].consumption };
      });
  }

  getCarbonEmitted(monthVal: string): { carbonEmitted: number } {
    return { carbonEmitted: 567.89 };
  }
}
