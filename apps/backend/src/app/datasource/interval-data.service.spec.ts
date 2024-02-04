import { Test } from '@nestjs/testing';
import { IntervalDataService } from './interval-data.service';
import { IntervalData } from '../domain-objects';
import { jest } from '@jest/globals';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('IntervalDataService', () => {

  let service: IntervalDataService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [IntervalDataService]
    }).compile();

    service = app.get<IntervalDataService>(IntervalDataService);
  });

  describe('getMonthIntervalData', () => {
    it('should return monthly data from openvolt api', async () => {

      mockedAxios.get.mockResolvedValueOnce({
        data: [{
          startInterval: '2023-01-01T00:00:00.000Z',
          endInterval: '2023-01-31T23:59:59.000Z',
          granularity: 'month',
          data: { /* no mocked data*/ }
        }]
      });

      const result: IntervalData = await service.getMonthIntervalData(new Date('2023-01-01T00:00:00.000Z'));

      expect(axios.get).toHaveBeenCalledWith('https://api.openvolt.com/v1/interval-data', {
        headers: {
          accept: 'application/json', 'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR'
        }, params: {
          end_date: '2023-01-31T23:59:59.000Z',
          granularity: 'month',
          meter_id: '6514167223e3d1424bf82742',
          start_date: '2023-01-01T00:00:00.000Z'
        }
      });

      expect(result).toEqual([{
        startInterval: '2023-01-01T00:00:00.000Z',
        endInterval: '2023-01-31T23:59:59.000Z',
        granularity: 'month',
        data: { /* no mocked data*/ }
      }]);
    });
  });

  describe('getHalfHourIntervalData', () => {
    it('should return half hour data from openvolt api', async () => {

      mockedAxios.get.mockResolvedValueOnce({
        data: [{
          startInterval: '2023-01-01T00:00:00.000Z',
          endInterval: '2023-01-31T23:59:59.000Z',
          granularity: 'hh',
          data: { /* no mocked data*/ }
        }]
      });

      const result: IntervalData = await service.getHalfHourIntervalData(new Date('2023-01-01T00:00:00.000Z'));

      expect(axios.get).toHaveBeenCalledWith('https://api.openvolt.com/v1/interval-data', {
        headers: {
          accept: 'application/json', 'x-api-key': 'test-Z9EB05N-07FMA5B-PYFEE46-X4ECYAR'
        }, params: {
          end_date: '2023-01-31T23:59:59.000Z',
          granularity: 'hh',
          meter_id: '6514167223e3d1424bf82742',
          start_date: '2023-01-01T00:00:00.000Z'
        }
      });

      expect(result).toEqual([{
        startInterval: '2023-01-01T00:00:00.000Z',
        endInterval: '2023-01-31T23:59:59.000Z',
        granularity: 'hh',
        data: { /* no mocked data*/ }
      }]);
    });
  });
});
