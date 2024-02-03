export type EnergyConsumed = { energyConsumed: number };
export type CarbonEmitted = { carbonEmit: number; };
export type IntervalData = {
  startInterval: Date,
  endInterval: Date,
  granularity: string,
  data: Array<MeterData>
}
export type MeterData = {
  start_interval: Date;
  meter_id: string;
  meter_number: string;
  customer_id: string;
  consumption: number;
  consumption_units: string;
};
export type IntensityWrapper = {
  from: Date,
  to: Date,
  intensity: Intensity
}
export type Intensity = {
  forecast: number,
  actual: number,
  index: string
}
