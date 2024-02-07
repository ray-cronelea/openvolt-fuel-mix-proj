import { GenerationWrapper, IntensityWrapper } from '../model/domain-objects';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment/moment';

const headers = {
  Accept: 'application/json'
};

@Injectable()
export class CarbonIntensityService {

  private readonly logger = new Logger(CarbonIntensityService.name);

  async getHalfHourCarbonIntensityWrapperForMonth(from: Date): Promise<IntensityWrapper[]> {

    this.logger.log(`Getting half hourly IntensityWrapper data for month starting ${from}`);

    // Because of an issue with the national intensity service, we need to call the service
    // with a timestamp of the 'to' time of the first element of the range
    // instead of the 'from' time as defined in the api documentation
    const fromTime = moment(from).add(30, 'minutes').toDate();
    const toTime = moment(from).add(1, 'month').toDate();

    const url = `https://api.carbonintensity.org.uk/intensity/${fromTime.toISOString()}/${toTime.toISOString()}`;

    const result = await axios
      .get(url, { headers })
      .then(res => res.data)
      .then(json => json.data);

    //this.logger.debug(`Get request to ${url} responded with ${JSON.stringify(result)}`);

    return result;
  }

  async getHalfHourGenerationMixWrapperForMonth(from: Date): Promise<GenerationWrapper[]> {
    this.logger.log(`Getting half hourly GenerationWrapper data for month starting ${from}`);

    // Because of an issue with the national intensity service, we need to call the service
    // with a timestamp of the 'to' time of the first element of the range
    // instead of the 'from' time as defined in the api documentation
    const fromTime = moment(from).add(30, 'minutes').toDate();
    const toTime = moment(from).add(1, 'month').toDate();

    const url = `https://api.carbonintensity.org.uk/generation/${fromTime.toISOString()}/${toTime.toISOString()}`;

    const result = await axios
      .get(url, { headers })
      .then(res => res.data)
      .then(json => json.data);

    this.logger.debug(`Get request to ${url} responded with ${JSON.stringify(result)}`);

    return result;
  }

}
