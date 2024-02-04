import { Test } from '@nestjs/testing';
import { IntensityWrapper } from '../domain-objects';
import { CarbonIntensityService } from './carbon-intensity.service';
import { jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CarbonIntensityService', () => {

  let service: CarbonIntensityService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [CarbonIntensityService]
    }).compile();

    service = app.get<CarbonIntensityService>(CarbonIntensityService);
  });

  describe('getHalfHourCarbonIntensityWrapper', () => {
    it('should return half hour carbon intensity data from carbon intensity api', async () => {

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{
            from: '2018-01-20T12:00Z',
            to: '2018-01-20T12:30Z',
            intensity: {
              forecast: 266,
              actual: 263,
              index: 'moderate'
            }
          }]
        }
      });

      const result: IntensityWrapper = await service.getHalfHourCarbonIntensityWrapper(new Date('2023-01-01T09:30:00.000Z'));

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.carbonintensity.org.uk/intensity/2023-01-01T09:30:00.000Z',
        { headers: { Accept: 'application/json' } }
      );

      expect(result).toEqual({
        from: '2018-01-20T12:00Z',
        to: '2018-01-20T12:30Z',
        intensity: {
          forecast: 266,
          actual: 263,
          index: 'moderate'
        }
      });
    });
  });

});
