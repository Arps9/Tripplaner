export interface Place {
  id: string
  name: string
  category: string
  description: string
  rating: number
  image: string
  location: {
    lat: number
    lon: number
    address: string
  }
}

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || ""

export async function getPlacesByCity(city: string): Promise<Place[]> {
  if (!GEOAPIFY_API_KEY) {
    console.warn("GEOAPIFY_API_KEY not set, using fallback data")
    return getFallbackPlaces(city)
  }

  try {
    // First, geocode the city to get coordinates
    const geocodeResponse = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)},India&apiKey=${GEOAPIFY_API_KEY}`,
      { next: { revalidate: 86400 } }, // Cache for 24 hours
    )

    if (!geocodeResponse.ok) {
      throw new Error("Failed to geocode city")
    }

    const geocodeData = await geocodeResponse.json()
    if (!geocodeData.features || geocodeData.features.length === 0) {
      throw new Error("City not found")
    }

    const [lon, lat] = geocodeData.features[0].geometry.coordinates

    // Get places of interest
    const placesResponse = await fetch(
      `https://api.geoapify.com/v2/places?categories=tourism.attraction,tourism.sights,heritage&filter=circle:${lon},${lat},10000&limit=20&apiKey=${GEOAPIFY_API_KEY}`,
      { next: { revalidate: 86400 } },
    )

    if (!placesResponse.ok) {
      throw new Error("Failed to fetch places")
    }

    const placesData = await placesResponse.json()

    return placesData.features.map((feature: any, index: number) => ({
      id: feature.properties.place_id || `place-${index}`,
      name: feature.properties.name || "Unnamed Place",
      category: getCategoryName(feature.properties.categories?.[0] || "tourism"),
      description: feature.properties.description || `Popular attraction in ${city}`,
      rating: 4.0 + Math.random() * 0.9, // Geoapify doesn't provide ratings
      image: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(feature.properties.name || city)}`,
      location: {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        address: feature.properties.formatted || "",
      },
    }))
  } catch (error) {
    console.error("Places API error:", error)
    return getFallbackPlaces(city)
  }
}

function getCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    "tourism.attraction": "Attraction",
    "tourism.sights": "Landmark",
    heritage: "Heritage",
    "tourism.museum": "Museum",
    "tourism.gallery": "Gallery",
  }
  return categoryMap[category] || "Attraction"
}

function getFallbackPlaces(city: string): Place[] {
  // Fallback data when API is not available
  const fallbackData: Record<string, Place[]> = {
    jaipur: [
      {
        id: "1",
        name: "Amber Fort",
        category: "Heritage",
        description: "Magnificent hilltop fort with stunning architecture",
        rating: 4.8,
        image: "/amber-fort-jaipur.jpg",
        location: { lat: 26.9855, lon: 75.8513, address: "Devisinghpura, Amer, Jaipur" },
      },
      {
        id: "2",
        name: "Hawa Mahal",
        category: "Architecture",
        description: "Iconic pink sandstone palace with 953 windows",
        rating: 4.7,
        image: "/hawa-mahal-jaipur.jpg",
        location: { lat: 26.9239, lon: 75.8267, address: "Hawa Mahal Rd, Badi Choupad, Jaipur" },
      },
    ],
    goa: [
      {
        id: "3",
        name: "Basilica of Bom Jesus",
        category: "Heritage",
        description: "UNESCO World Heritage Site and famous church",
        rating: 4.7,
        image: "/basilica-of-bom-jesus-goa.jpg",
        location: { lat: 15.5008, lon: 73.9114, address: "Old Goa, Goa" },
      },
    ],
  }

  return fallbackData[city.toLowerCase()] || []
}
