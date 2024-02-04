import { IntensityWrapper } from '../domain-objects';
import axios from 'axios';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class CarbonIntensityService {

  private readonly logger = new Logger(CarbonIntensityService.name);

  async getHalfHourCarbonIntensityWrapper(time: Date): Promise<IntensityWrapper> {
    const headers = {
      Accept: 'application/json'
    };

    return await axios
      .get(`https://api.carbonintensity.org.uk/intensity/${time.toISOString()}`, { headers })
      .then(res => res.data)
      .then(json => json.data)
      .then(intensities => intensities[0]);
  }


}
