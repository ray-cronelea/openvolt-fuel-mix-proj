import { Module } from '@nestjs/common';
import { CarbonIntensityService } from './carbon-intensity.service';

@Module({
  providers: [CarbonIntensityService],
  exports: [CarbonIntensityService],
})
export class CarbonIntensityModule {}
