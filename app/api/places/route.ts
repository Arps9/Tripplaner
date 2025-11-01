import { NextResponse } from "next/server"

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || ""

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")
  const category = searchParams.get("category") || "tourism.attraction"

  if (!city) {
    return NextResponse.json({ success: false, error: "City parameter required" }, { status: 400 })
  }

  if (!GEOAPIFY_API_KEY) {
    return NextResponse.json({ success: false, error: "API key not configured" }, { status: 500 })
  }

  try {
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

    const [lon, lat] = geocodeData.features[0].geometry.coordinates

    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},15000&limit=30&apiKey=${GEOAPIFY_API_KEY}`,
    )

    if (!placesResponse.ok) {
      throw new Error("Failed to fetch places")
    }

    const placesData = await placesResponse.json()

    const places = placesData.features.map((feature: any, index: number) => ({
      id: feature.properties.place_id || `place-${index}`,
      name: feature.properties.name || "Unnamed Place",
      category: getCategoryName(feature.properties.categories?.[0] || category),
      description: feature.properties.description || `Popular ${getCategoryName(category)} in ${city}`,
      rating: 4.0 + Math.random() * 0.9,
      entryFee: getEstimatedEntryFee(category),
      estimatedTime: getEstimatedTime(category),
      image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(feature.properties.name || city + " attraction")}`,
      location: {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        address: feature.properties.formatted || "",
      },
    }))

    return NextResponse.json({
      success: true,
      data: places,
      cityCoordinates: { lat, lon },
    })
  } catch (error) {
    console.error("Places API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch places" }, { status: 500 })
  }
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    "tourism.attraction": "Tourist Attraction",
    "tourism.sights": "Landmark",
    heritage: "Heritage Site",
    "tourism.museum": "Museum",
    "accommodation.hotel": "Hotel",
    "catering.restaurant": "Restaurant",
    "leisure.park": "Park",
  }
  return categoryMap[category] || "Attraction"
}

function getEstimatedEntryFee(category: string): number {
  const feeMap: Record<string, number> = {
    "tourism.attraction": 100,
    "tourism.museum": 150,
    heritage: 200,
    "leisure.park": 50,
  }
  return feeMap[category] || 100
}

function getEstimatedTime(category: string): string {
  const timeMap: Record<string, string> = {
    "tourism.attraction": "2-3 hours",
    "tourism.museum": "1-2 hours",
    heritage: "2-4 hours",
    "leisure.park": "1-2 hours",
  }
  return timeMap[category] || "2-3 hours"
}
