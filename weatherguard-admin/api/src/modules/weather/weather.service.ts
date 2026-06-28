import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherData } from './interfaces/weather-data.interface';

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private configService: ConfigService) {}

  // Open-Meteo needs no API key, which is why it's chosen here.
  // There is no WEATHER_API_KEY env var needed.
  async getCurrentConditions(lat: number, lon: number): Promise<WeatherData> {
    const baseUrl = this.configService.get<string>('weatherApiBaseUrl');
    const url = `${baseUrl}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

    try {
      const response = await axios.get(url);
      const data = response.data?.current_weather;

      return {
        temperatureC: data.temperature,
        windSpeedKmh: data.windspeed,
        condition: this.mapWmoCode(data.weathercode),
        fetchedAt: new Date(data.time),
      };
    } catch (error) {
      this.logger.error('Failed to fetch weather data from Open-Meteo:', error);
      throw error;
    }
  }

  formatAlertMessage(data: WeatherData): string {
    return `🌤️ Weather Update\nCondition: ${data.condition}\nTemp: ${data.temperatureC}°C\nWind: ${data.windSpeedKmh} km/h`;
  }

  private mapWmoCode(code: number): string {
    // A handful of common codes is enough
    switch (code) {
      case 0: return 'Clear sky';
      case 1:
      case 2:
      case 3: return 'Mainly clear, partly cloudy, and overcast';
      case 45:
      case 48: return 'Fog and depositing rime fog';
      case 51:
      case 53:
      case 55: return 'Drizzle: Light, moderate, and dense intensity';
      case 56:
      case 57: return 'Freezing Drizzle: Light and dense intensity';
      case 61:
      case 63:
      case 65: return 'Rain: Slight, moderate and heavy intensity';
      case 66:
      case 67: return 'Freezing Rain: Light and heavy intensity';
      case 71:
      case 73:
      case 75: return 'Snow fall: Slight, moderate, and heavy intensity';
      case 77: return 'Snow grains';
      case 80:
      case 81:
      case 82: return 'Rain showers: Slight, moderate, and violent';
      case 85:
      case 86: return 'Snow showers slight and heavy';
      case 95: return 'Thunderstorm: Slight or moderate';
      case 96:
      case 99: return 'Thunderstorm with slight and heavy hail';
      default: return 'Unknown';
    }
  }
}
