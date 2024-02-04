import { Module } from '@nestjs/common';
import { IntervalDataService } from './interval-data.service';

@Module({
  providers: [IntervalDataService],
  exports: [IntervalDataService]
})
export class IntervalDataModule {
}
