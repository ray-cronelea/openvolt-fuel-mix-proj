import { Test } from '@nestjs/testing';

import { EnergyConsumedService } from './energy-consumed.service';

describe('AppService', () => {
  let service: EnergyConsumedService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [EnergyConsumedService],
    }).compile();

    service = app.get<EnergyConsumedService>(EnergyConsumedService);
  });

  describe('getData', () => {
    it('should return "my-lib updated value"', () => {
      expect(service.getData()).toEqual({message: 'my-lib updated value'});
    });
  });
});
