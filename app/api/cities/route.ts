import { NextResponse } from "next/server"
import { getStateByName } from "@/lib/data/indian-states"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const state = searchParams.get("state")

  if (!state) {
    return NextResponse.json({ success: false, error: "State parameter required" }, { status: 400 })
  }

  const stateData = getStateByName(state)

  if (!stateData) {
    return NextResponse.json({ success: false, error: "State not found" }, { status: 404 })
  }

  return NextResponse.json({
    success: true,
    data: stateData.popularCities.map((city) => ({
      name: city,
      state: stateData.name,
      image: `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(city + " " + stateData.name)}`,
    })),
  })
}
