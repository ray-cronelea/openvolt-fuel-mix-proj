import { EnergyConsumedService } from './energy-consumed.service';
import { IntervalData } from '../model/domain-objects';
import { IntervalDataService } from '../datasource/interval-data.service';
import { TestBed } from '@automock/jest';

describe('EnergyConsumedService', () => {
  let energyConsumedService: EnergyConsumedService;
  let intervalDataService: jest.Mocked<IntervalDataService>;

  beforeEach(() => {
    const { unit, unitRef } = TestBed.create(EnergyConsumedService).compile();

    energyConsumedService = unit;
    intervalDataService = unitRef.get(IntervalDataService);
  });

  describe('getData', () => {
    it('should return value from a library', () => {
      expect(energyConsumedService.getData())
        .toEqual({ message: 'This value came from a library!' });
    });
  });

  describe('getEnergyConsumed', () => {
    it('should return the energy consumed in kwh for a given month',
      async () => {


        let mockedIntervalData: IntervalData = {
          data: [{
            start_interval: new Date('2023-01-01T00:00:00.000Z'),
            meter_id: undefined,
            meter_number: undefined,
            customer_id: undefined,
            consumption: 123.456,
            consumption_units: undefined
          }], endInterval: undefined, granularity: undefined, startInterval: undefined
        };

        intervalDataService.getMonthIntervalData.mockResolvedValueOnce(Promise.resolve(mockedIntervalData));

        expect(await energyConsumedService.getEnergyConsumed(new Date('2023-01-01T00:00:00.000Z')))
          .toEqual({ energyConsumed: 123.456 });

        expect(intervalDataService.getMonthIntervalData).toHaveBeenCalledWith(new Date('2023-01-01T00:00:00.000Z'))
        //expect(intervalDataService.getMonthIntervalData).toHaveBeenCalledWith(new Date('2023-01-01T00:00:00.000Z'));

      });
  });
});
