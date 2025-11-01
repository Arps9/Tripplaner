import { NextResponse } from "next/server"
import { INDIAN_STATES } from "@/lib/data/indian-states"

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INDIAN_STATES,
  })
}
