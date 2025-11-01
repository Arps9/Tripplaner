export interface WeatherData {
  city: string
  current: {
    temperature: number
    condition: string
    humidity: number
    windSpeed: number
    feelsLike: number
  }
  forecast: Array<{
    date: string
    maxTemp: number
    minTemp: number
    condition: string
    precipitation: number
  }>
}

const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  jaipur: { lat: 26.9124, lon: 75.7873 },
  goa: { lat: 15.2993, lon: 74.124 },
  kerala: { lat: 10.8505, lon: 76.2711 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  ladakh: { lat: 34.1526, lon: 77.577 },
  mumbai: { lat: 19.076, lon: 72.8777 },
  delhi: { lat: 28.7041, lon: 77.1025 },
  bangalore: { lat: 12.9716, lon: 77.5946 },
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  const cityLower = city.toLowerCase()
  const coords = CITY_COORDINATES[cityLower]

  if (!coords) {
    throw new Error(`Weather data not available for ${city}`)
  }

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata&forecast_days=7`,
      { next: { revalidate: 1800 } }, // Cache for 30 minutes
    )

    if (!response.ok) {
      throw new Error("Failed to fetch weather data")
    }

    const data = await response.json()

    // Map weather codes to conditions
    const getCondition = (code: number): string => {
      if (code === 0) return "Clear"
      if (code <= 3) return "Partly Cloudy"
      if (code <= 48) return "Foggy"
      if (code <= 67) return "Rainy"
      if (code <= 77) return "Snowy"
      if (code <= 82) return "Showers"
      if (code <= 86) return "Snow Showers"
      return "Thunderstorm"
    }

    return {
      city,
      current: {
        temperature: Math.round(data.current.temperature_2m),
        condition: getCondition(data.current.weather_code),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        feelsLike: Math.round(data.current.apparent_temperature),
      },
      forecast: data.daily.time.slice(0, 7).map((date: string, index: number) => ({
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[index]),
        minTemp: Math.round(data.daily.temperature_2m_min[index]),
        condition: getCondition(data.daily.weather_code[index]),
        precipitation: Math.round(data.daily.precipitation_sum[index]),
      })),
    }
  } catch (error) {
    console.error("Weather API error:", error)
    throw new Error("Failed to fetch weather data")
  }
}
