import { IntervalData } from '../model/domain-objects';
import moment from 'moment/moment';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class IntervalDataService {

  private readonly logger = new Logger(IntervalDataService.name);

  async getMonthIntervalData(monthVal: Date): Promise<IntervalData> {
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
      .then(res => res.data);
  }

  async getHalfHourIntervalData(monthVal: Date): Promise<IntervalData> {
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


