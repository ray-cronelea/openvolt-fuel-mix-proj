import { IntensityWrapper } from '../model/domain-objects';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';
import moment from 'moment/moment';


@Injectable()
export class CarbonIntensityService {

  private readonly logger = new Logger(CarbonIntensityService.name);

  async getHalfHourCarbonIntensityWrapper(time: Date): Promise<IntensityWrapper> {
    const headers = {
      Accept: 'application/json'
    };

    // Because of an issue with the national intensity service, we need to call the service
    // with a timestamp of the 'to' time instead of the 'from' time as defined in the api documentation
    const buggedTime = moment(time).add(30, 'minutes').toDate()

    return await axios
      .get(`https://api.carbonintensity.org.uk/intensity/${buggedTime.toISOString()}`, { headers })
      .then(res => res.data)
      .then(json => json.data)
      .then((intensities: IntensityWrapper[]) => intensities[0]);
  }


}
