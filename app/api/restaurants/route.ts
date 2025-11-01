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

    const restaurantsResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=catering.restaurant,catering.cafe&filter=circle:${longitude},${latitude},10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`,
    )

    if (!restaurantsResponse.ok) {
      throw new Error("Failed to fetch restaurants")
    }

    const restaurantsData = await restaurantsResponse.json()

    const cuisineTypes = ["Indian", "North Indian", "South Indian", "Chinese", "Continental", "Multi-Cuisine"]

    const restaurants = restaurantsData.features.map((feature: any, index: number) => {
      const mealCost = 200 + Math.floor(Math.random() * 300)
      return {
        id: feature.properties.place_id || `restaurant-${index}`,
        name: feature.properties.name || `Restaurant in ${city}`,
        cuisine: cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)],
        rating: 4.0 + Math.random() * 0.9,
        priceRange: "₹₹",
        estimatedCost: mealCost,
        image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(feature.properties.name || "restaurant " + city)}`,
        location: {
          lat: feature.geometry.coordinates[1],
          lon: feature.geometry.coordinates[0],
          address: feature.properties.formatted || "",
        },
      }
    })

    return NextResponse.json({
      success: true,
      data: restaurants,
    })
  } catch (error) {
    console.error("Restaurants API error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch restaurants" }, { status: 500 })
  }
}
