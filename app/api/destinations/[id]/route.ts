import { NextResponse } from "next/server"
import { getDestinationById, getDestinationWithDetails } from "@/lib/api/destinations"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const destination = await getDestinationById(params.id)

    if (!destination) {
      return NextResponse.json({ error: "Destination not found" }, { status: 404 })
    }

    // Fetch additional details
    const details = await getDestinationWithDetails(destination.name)

    return NextResponse.json({
      ...destination,
      ...details,
    })
  } catch (error) {
    console.error("Error fetching destination:", error)
    return NextResponse.json({ error: "Failed to fetch destination" }, { status: 500 })
  }
}
