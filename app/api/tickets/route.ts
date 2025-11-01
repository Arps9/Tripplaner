export const dynamic = "force-dynamic";   // ✅ prevents static rendering
export const revalidate = false;          // ✅ disables prerender caching
export const fetchCache = "force-no-store";
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const destination = searchParams.get("destination")

    let query = supabase.from("tickets").select("*")

    if (type) {
      query = query.eq("ticket_type", type)
    }

    if (destination) {
      query = query.or(`destination.ilike.%${destination}%,name.ilike.%${destination}%`)
    }

    const { data, error } = await query.limit(50)

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data || [],
    })
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch tickets" }, { status: 500 })
  }
}
