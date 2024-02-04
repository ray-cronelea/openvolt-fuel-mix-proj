import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { EnergyConsumedService } from './services/energy-consumed.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [EnergyConsumedService],
    }).compile();
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.getData()).toEqual({message: 'my-lib updated value'});
    });
  });
});
