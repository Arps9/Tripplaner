import { NextResponse } from "next/server"
import { getAllDestinations } from "@/lib/api/destinations"

export async function GET() {
  try {
    const destinations = await getAllDestinations()
    return NextResponse.json(destinations)
  } catch (error) {
    console.error("Error fetching destinations:", error)
    return NextResponse.json({ error: "Failed to fetch destinations" }, { status: 500 })
  }
}
