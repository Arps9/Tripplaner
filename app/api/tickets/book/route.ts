export const dynamic = "force-dynamic";

export const revalidate = 0;
import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { itinerary_id, ticket_id, quantity, booking_date, passenger_details } = body

    if (!itinerary_id || !ticket_id || !quantity) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Get ticket price
    const { data: ticket } = await supabase.from("tickets").select("price").eq("id", ticket_id).single()

    if (!ticket) {
      return NextResponse.json({ success: false, error: "Ticket not found" }, { status: 404 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("user_ticket_bookings")
      .insert({
        user_id: user.id,
        itinerary_id,
        ticket_id,
        quantity,
        total_price: ticket.price * quantity,
        booking_date,
        passenger_details,
        booking_status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: booking,
    })
  } catch (error) {
    console.error("Error booking ticket:", error)
    return NextResponse.json({ success: false, error: "Failed to book ticket" }, { status: 500 })
  }
}
