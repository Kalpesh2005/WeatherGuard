export interface WeatherData {
  temperatureC: number;
  windSpeedKmh: number;
  condition: string; // human-readable, e.g. "Clear", "Rain"
  fetchedAt: Date;
}
