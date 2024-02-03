import { IntensityWrapper } from './DomainObjects';
import axios from 'axios';

export async function getHalfHourCarbonIntensityWrapper(time: Date): Promise<IntensityWrapper> {
  const headers = {
    Accept: 'application/json'
  };

  return await axios
    .get(`https://api.carbonintensity.org.uk/intensity/${time.toISOString()}`, { headers })
    .then(res => res.data)
    .then(json => json.data)
    .then(intensities => intensities[0]);
}
