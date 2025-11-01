import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!lat || !lon) {
    return NextResponse.json({ success: false, error: "Latitude and longitude required" }, { status: 400 })
  }

  try {
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia/Kolkata`,
    )

    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather")
    }

    const weatherData = await weatherResponse.json()

    return NextResponse.json({
      success: true,
      data: {
        current: {
          temperature: weatherData.current.temperature_2m,
          precipitation: weatherData.current.precipitation,
          weatherCode: weatherData.current.weather_code,
        },
        daily: weatherData.daily,
      },
    })
  } catch (error) {
    console.error("Weather API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch weather" }, { status: 500 })
  }
}
