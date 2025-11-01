import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { tripName, itinerary, totalBudget, totalCost, numDays } = await request.json()

  const { data, error } = await supabase
    .from("user_itineraries")
    .insert({
      user_id: user.id,
      destination: itinerary[0]?.destination?.name || "India",
      trip_name: tripName,
      num_days: numDays,
      budget_amount: totalBudget,
      estimated_cost: totalCost,
      itinerary_data: itinerary,
    })
    .select()

  if (error) {
    console.error("[v0] Supabase error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }

  return Response.json({ success: true, data })
}
