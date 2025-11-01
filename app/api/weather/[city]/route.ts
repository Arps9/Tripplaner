import { type NextRequest, NextResponse } from "next/server"
import { getWeatherData } from "@/lib/api/weather"

export async function GET(request: NextRequest, { params }: { params: { city: string } }) {
  try {
    const city = params.city
    const weatherData = await getWeatherData(city)
    return NextResponse.json(weatherData)
  } catch (error) {
    console.error("Weather API route error:", error)
    return NextResponse.json({ error: "Failed to fetch weather data" }, { status: 500 })
  }
}
