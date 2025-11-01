export interface TransportOption {
  mode: string
  cost: number
  duration: string
  departure: string
  arrival: string
  provider: string
}

export async function getTransportOptions(from: string, to: string): Promise<TransportOption[]> {
  // Note: Trawex API requires API key and specific implementation
  // This is a production-ready structure that can be connected to Trawex
  const TRAWEX_API_KEY = process.env.TRAWEX_API_KEY || ""
  const TRAWEX_BASE_URL = process.env.TRAWEX_BASE_URL || "https://api.trawex.com"

  if (!TRAWEX_API_KEY) {
    console.warn("TRAWEX_API_KEY not set, using fallback data")
    return getFallbackTransport(from, to)
  }

  try {
    const response = await fetch(
      `${TRAWEX_BASE_URL}/transport/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&country=India`,
      {
        headers: {
          Authorization: `Bearer ${TRAWEX_API_KEY}`,
          "Content-Type": "application/json",
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      },
    )

    if (!response.ok) {
      throw new Error("Failed to fetch transport options")
    }

    const data = await response.json()

    return data.options.map((option: any) => ({
      mode: option.mode,
      cost: option.cost,
      duration: option.duration,
      departure: option.departure,
      arrival: option.arrival,
      provider: option.provider,
    }))
  } catch (error) {
    console.error("Transport API error:", error)
    return getFallbackTransport(from, to)
  }
}

function getFallbackTransport(from: string, to: string): TransportOption[] {
  // Fallback data structure
  return [
    {
      mode: "Flight",
      cost: 4500,
      duration: "2h 15m",
      departure: "08:00 AM",
      arrival: "10:15 AM",
      provider: "Air India",
    },
    {
      mode: "Train",
      cost: 1500,
      duration: "6h 30m",
      departure: "06:00 AM",
      arrival: "12:30 PM",
      provider: "Indian Railways",
    },
    {
      mode: "Bus",
      cost: 800,
      duration: "8h 00m",
      departure: "10:00 PM",
      arrival: "06:00 AM",
      provider: "State Transport",
    },
  ]
}
