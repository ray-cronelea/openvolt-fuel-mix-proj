import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { EnergyConsumedService } from './services/energy-consumed.service';
import { IntervalDataService } from './datasource/interval-data.service';
import { createMock } from '@golevelup/ts-jest';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [EnergyConsumedService, IntervalDataService],
    })
      .useMocker(createMock)
      .compile();
  });

  describe('getData', () => {
    it('should return message from library', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({message: 'This value came from a library!'});
    });
  });
});
