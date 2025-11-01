import { type NextRequest, NextResponse } from "next/server"
import { getHotelsByCity } from "@/lib/api/hotels"

export async function GET(request: NextRequest, { params }: { params: { city: string } }) {
  try {
    const city = params.city
    const hotels = await getHotelsByCity(city)
    return NextResponse.json({ city, hotels })
  } catch (error) {
    console.error("Hotels API route error:", error)
    return NextResponse.json({ error: "Failed to fetch hotels data" }, { status: 500 })
  }
}
