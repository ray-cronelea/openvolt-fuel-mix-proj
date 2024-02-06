import { Test } from '@nestjs/testing';
import { IntensityWrapper } from '../model/domain-objects';
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

  describe('getHalfHourCarbonIntensityWrapperForMonth', () => {
    it('should return half hour carbon intensity data from carbon intensity api for month', async () => {

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: [{
            from: '2023-01-01T00:00Z',
            to: '2023-01-01T00:30Z',
            intensity: {
              forecast: 266,
              actual: 263,
              index: 'moderate'
            }
          },
            {
              from: '2023-01-01T00:30Z',
              to: '2023-01-01T01:00Z',
              intensity: {
                forecast: 443,
                actual: 211,
                index: 'moderate'
              }
            }]
        }
      });

      const result: IntensityWrapper[] = await service.getHalfHourCarbonIntensityWrapperForMonth(new Date('2023-01-01T00:00:00.000Z'));

      expect(axios.get).toHaveBeenCalledWith(
        'https://api.carbonintensity.org.uk/intensity/2023-01-01T00:30:00.000Z/2023-02-01T00:00:00.000Z',
        { headers: { Accept: 'application/json' } }
      );

      expect(result).toEqual([{
        from: '2023-01-01T00:00Z',
        to: '2023-01-01T00:30Z',
        intensity: {
          forecast: 266,
          actual: 263,
          index: 'moderate'
        }
      },{
        from: '2023-01-01T00:30Z',
        to: '2023-01-01T01:00Z',
        intensity: {
          forecast: 443,
          actual: 211,
          index: 'moderate'
        }
      }]);
    });
  });

});
