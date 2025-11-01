export interface Ticket {
  id: string
  ticket_type: "train" | "flight" | "bus" | "entry_pass" | "attraction_pass"
  name: string
  description: string
  source?: string
  destination?: string
  travel_date?: string
  price: number
  currency: string
  available_quantity: number
  image_url: string
  provider: string
  booking_url?: string
  duration_hours?: number
  validity_days?: number
  benefits: string[]
}

export interface TicketBooking {
  id: string
  itinerary_id: string
  ticket_id: string
  quantity: number
  total_price: number
  booking_status: "pending" | "confirmed" | "cancelled"
  booking_date: string
  confirmation_number?: string
  passenger_details?: Record<string, any>[]
}

export async function getTicketsByType(
  type: "train" | "flight" | "bus" | "entry_pass" | "attraction_pass",
): Promise<Ticket[]> {
  try {
    const response = await fetch(`/api/tickets?type=${type}`)
    if (!response.ok) throw new Error("Failed to fetch tickets")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return []
  }
}

export async function getTicketsByDestination(destination: string): Promise<Ticket[]> {
  try {
    const response = await fetch(`/api/tickets?destination=${encodeURIComponent(destination)}`)
    if (!response.ok) throw new Error("Failed to fetch tickets")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching tickets:", error)
    return []
  }
}

export async function bookTicket(booking: Partial<TicketBooking>): Promise<TicketBooking | null> {
  try {
    const response = await fetch("/api/tickets/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
    if (!response.ok) throw new Error("Failed to book ticket")
    return response.json()
  } catch (error) {
    console.error("Error booking ticket:", error)
    return null
  }
}

export async function getUserTicketBookings(itineraryId: string): Promise<TicketBooking[]> {
  try {
    const response = await fetch(`/api/tickets/bookings?itinerary_id=${itineraryId}`)
    if (!response.ok) throw new Error("Failed to fetch bookings")
    const data = await response.json()
    return data.data || []
  } catch (error) {
    console.error("Error fetching bookings:", error)
    return []
  }
}
