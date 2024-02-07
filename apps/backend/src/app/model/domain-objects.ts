export interface EnergyConsumed { energyConsumed: number }
export interface CarbonEmitted { carbonEmit: number; }

export interface FuelMix {
  productionType: string,
  kilowatt: number
}
export interface IntervalData {
  startInterval: Date,
  endInterval: Date,
  granularity: string,
  data: MeterData[]
}
export interface MeterData {
  start_interval: Date;
  meter_id: string;
  meter_number: string;
  customer_id: string;
  consumption: number;
  consumption_units: string;
}
export interface IntensityWrapper {
  from: Date,
  to: Date,
  intensity: Intensity
}
export interface Intensity {
  forecast: number,
  actual: number,
  index: string
}

export interface GenerationWrapper {
  from: Date,
  to: Date,
  generationmix: GenerationMix[]
}

export interface GenerationMix {
  fuel: string,
  perc: number,
}
