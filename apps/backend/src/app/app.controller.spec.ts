import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { EnergyConsumedService } from './services/energy-consumed.service';
import { LoggerModule } from './logger/logger.module';
import { CarbonEmittedService } from './services/carbon-emitted.service';
import { CarbonIntensityService } from './datasource/carbon-intensity.service';
import { IntervalDataService } from './datasource/interval-data.service';
import { mock, mockReset } from 'jest-mock-extended';
import { _MockProxy } from 'jest-mock-extended/lib/Mock';

describe('AppController', () => {
  let app: TestingModule;

  const intervalDataService: _MockProxy<IntervalDataService> = mock<IntervalDataService>();
  const carbonIntensityService: _MockProxy<CarbonIntensityService> = mock<CarbonIntensityService>();

  beforeAll(async () => {

    app = await Test.createTestingModule({
      imports: [LoggerModule],
      controllers: [AppController],
      providers: [EnergyConsumedService, CarbonEmittedService, {
        provide: IntervalDataService,
        useValue: intervalDataService
      }, {
        provide: CarbonIntensityService,
        useValue: carbonIntensityService
      }]
    })
      .compile();
  });

  beforeEach(() => {
    mockReset(intervalDataService);
    mockReset(carbonIntensityService);
  });

  describe('getData', () => {
    it('should return message from library', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({ message: 'This value came from a library!' });
    });
  });

  describe('getEnergyConsumed', () => {
    it('should return message from library', async () => {
      const appController: AppController = app.get<AppController>(AppController);

      intervalDataService.getMonthIntervalData.mockResolvedValueOnce({
        startInterval: new Date('2023-01-01T00:00:00.000Z'),
        endInterval: new Date('2023-01-31T23:59:59.000Z'),
        granularity: 'month',
        data: [{
          start_interval: new Date('2023-01-01T00:00:00.000Z'),
          meter_id: undefined,
          meter_number: undefined,
          customer_id: undefined,
          consumption: 123.456,
          consumption_units: undefined
        }]
      });

      const result = await appController.getEnergyConsumed(new Date('2023-02-01T00:00:00.000Z'));

      expect(result).toEqual({ energyConsumed: 123.456 });
      expect(intervalDataService.getMonthIntervalData).toHaveBeenCalledWith(new Date('2023-02-01T00:00:00.000Z'));
    });
  });

  describe('getCarbonEmitted', () => {
    it('should return message from libraryds', async () => {
      const appController: AppController = app.get<AppController>(AppController);

      intervalDataService.getHalfHourIntervalData.mockResolvedValue({
        startInterval: new Date('2023-01-01T00:00:00.000Z'),
        endInterval: new Date('2023-01-31T23:59:59.000Z'),
        granularity: 'month',
        data: [
          {
            start_interval: new Date('2023-01-01T00:00:00.000Z'),
            meter_id: undefined,
            meter_number: undefined,
            customer_id: undefined,
            consumption: 123.456,
            consumption_units: undefined
          },
          {
            start_interval: new Date('2023-01-01T00:30:00.000Z'),
            meter_id: undefined,
            meter_number: undefined,
            customer_id: undefined,
            consumption: 123.456,
            consumption_units: undefined
          }
        ]
      });

      carbonIntensityService.getHalfHourCarbonIntensityWrapper
        .mockResolvedValueOnce({
          'from': new Date('2023-01-01T00:00:00.000Z'),
          'to': new Date('2023-01-01T00:30:00.000Z'),
          'intensity': {
            'forecast': 266,
            'actual': 263,
            'index': 'moderate'
          }
        })
        .mockResolvedValueOnce({
          'from': new Date('2023-01-01T00:30:00.000Z'),
          'to': new Date('2023-01-01T01:00:00.000Z'),
          'intensity': {
            'forecast': 266,
            'actual': 263,
            'index': 'moderate'
          }
        });

      const result = await appController.getCarbonEmitted(new Date('2023-01-01T00:00:00.000Z'));

      expect(result).toEqual({ carbonEmit: 64937.856 });
      expect(intervalDataService.getHalfHourIntervalData).toHaveBeenCalledWith(new Date('2023-01-01T00:00:00.000Z'));

      // Because of an issue with the national intensity service, we need to call the service
      // with a timestamp of the 'to' time instead of the 'from' time as defined in the api documentation

      expect(carbonIntensityService.getHalfHourCarbonIntensityWrapper).toHaveBeenCalledWith( new Date('2023-01-01T00:00:00.000Z'));
      expect(carbonIntensityService.getHalfHourCarbonIntensityWrapper).toHaveBeenCalledWith(new Date('2023-01-01T00:30:00.000Z'));
    });
  });
});
