import { NextResponse } from "next/server"

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || ""

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")

  if (!city) {
    return NextResponse.json({ success: false, error: "City parameter required" }, { status: 400 })
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ success: false, error: "API key not configured" }, { status: 500 })
  }

  try {
    let latitude = lat
    let longitude = lon

    if (!latitude || !longitude) {
      const geocodeResponse = await fetch(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)},India&apiKey=${GEOAPIFY_API_KEY}`,
      )

      if (!geocodeResponse.ok) {
        throw new Error("Failed to geocode city")
      }

      const geocodeData = await geocodeResponse.json()
      if (!geocodeData.features || geocodeData.features.length === 0) {
        return NextResponse.json({ success: false, error: "City not found" }, { status: 404 })
      }
      ;[longitude, latitude] = geocodeData.features[0].geometry.coordinates
    }

    const hotelsResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=accommodation.hotel&filter=circle:${longitude},${latitude},10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`,
    )

    if (!hotelsResponse.ok) {
      throw new Error("Failed to fetch hotels")
    }

    const hotelsData = await hotelsResponse.json()

    const hotels = hotelsData.features.map((feature: any, index: number) => {
      const basePrice = 2000 + Math.floor(Math.random() * 4000)
      return {
        id: feature.properties.place_id || `hotel-${index}`,
        name: feature.properties.name || `Hotel in ${city}`,
        rating: 4.0 + Math.random() * 0.9,
        price: basePrice,
        currency: "INR",
        image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(feature.properties.name || "hotel " + city)}`,
        amenities: ["WiFi", "AC", "Breakfast", "Room Service"],
        location: {
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
          address: feature.properties.formatted || "",
          distance: "City Center",
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: hotels,
    })
  } catch (error) {
    console.error("Hotels API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch hotels" }, { status: 500 })
  }
}
