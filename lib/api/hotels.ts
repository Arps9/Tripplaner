export interface Hotel {
  id: string
  name: string
  rating: number
  price: number
  currency: string
  image: string
  amenities: string[]
  location: {
    address: string
    distance: string
  }
}

export async function getHotelsByCity(city: string): Promise<Hotel[]> {
  // Note: HotelAPI.co requires API key and specific implementation
  // This is a production-ready structure that can be connected to HotelAPI.co
  const HOTEL_API_KEY = process.env.HOTEL_API_KEY || ""
  const HOTEL_API_URL = process.env.HOTEL_API_URL || "https://api.hotelapi.co/v1/hotels"

  if (!HOTEL_API_KEY) {
    console.warn("HOTEL_API_KEY not set, using fallback data")
    return getFallbackHotels(city)
  }

  try {
    const response = await fetch(`${HOTEL_API_URL}/search?city=${encodeURIComponent(city)}&country=India`, {
      headers: {
        Authorization: `Bearer ${HOTEL_API_KEY}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      throw new Error("Failed to fetch hotels")
    }

    const data = await response.json()

    return data.hotels.map((hotel: any) => ({
      id: hotel.id,
      name: hotel.name,
      rating: hotel.rating || 4.0,
      price: hotel.price || 3000,
      currency: "INR",
      image: hotel.image || `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(hotel.name)}`,
      amenities: hotel.amenities || ["WiFi", "AC", "Breakfast"],
      location: {
        address: hotel.address || city,
        distance: hotel.distance || "City Center",
      },
    }))
  } catch (error) {
    console.error("Hotels API error:", error)
    return getFallbackHotels(city)
  }
}

function getFallbackHotels(city: string): Hotel[] {
  // Fallback data structure
  return [
    {
      id: "1",
      name: `The Heritage ${city}`,
      rating: 4.8,
      price: 5200,
      currency: "INR",
      image: `/placeholder.svg?height=400&width=600&query=luxury hotel ${city}`,
      amenities: ["WiFi", "Pool", "Spa", "Restaurant", "AC"],
      location: {
        address: `City Center, ${city}`,
        distance: "0.5 km from center",
      },
    },
    {
      id: "2",
      name: `Comfort Inn ${city}`,
      rating: 4.5,
      price: 3500,
      currency: "INR",
      image: `/placeholder.svg?height=400&width=600&query=hotel ${city}`,
      amenities: ["WiFi", "Breakfast", "AC", "Parking"],
      location: {
        address: `Main Road, ${city}`,
        distance: "1.2 km from center",
      },
    },
  ]
}
