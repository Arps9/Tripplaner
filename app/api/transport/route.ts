import { type NextRequest, NextResponse } from "next/server"
import { getTransportOptions } from "@/lib/api/transport"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const from = searchParams.get("from")
    const to = searchParams.get("to")

    if (!from || !to) {
      return NextResponse.json({ error: "Missing from or to parameter" }, { status: 400 })
    }

    const transport = await getTransportOptions(from, to)
    return NextResponse.json({ from, to, transport })
  } catch (error) {
    console.error("Transport API route error:", error)
    return NextResponse.json({ error: "Failed to fetch transport data" }, { status: 500 })
  }
}
