import { type NextRequest, NextResponse } from "next/server"
import { getPlacesByCity } from "@/lib/api/places"

export async function GET(request: NextRequest, { params }: { params: { city: string } }) {
  try {
    const city = params.city
    const places = await getPlacesByCity(city)
    return NextResponse.json({ city, places })
  } catch (error) {
    console.error("Places API route error:", error)
    return NextResponse.json({ error: "Failed to fetch places data" }, { status: 500 })
  }
}
