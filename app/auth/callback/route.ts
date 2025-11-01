import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    // Redirect to login page with error
    return NextResponse.redirect(new URL("/auth/login?error=oauth_failed", request.url))
  }

  if (!code) {
    return NextResponse.redirect(new URL("/auth/login?error=no_code", request.url))
  }

  const supabase = await createClient()

  try {
    // Exchange the code for a session
    const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

    if (sessionError) {
      console.error("Session exchange error:", sessionError)
      return NextResponse.redirect(new URL("/auth/login?error=session_error", request.url))
    }

    if (!data.user) {
      return NextResponse.redirect(new URL("/auth/login?error=no_user", request.url))
    }

    // Create or update user profile
    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        id: data.user.id,
        email: data.user.email!,
        full_name: data.user.user_metadata?.full_name || "",
        avatar_url: data.user.user_metadata?.avatar_url || "",
        provider: data.user.app_metadata?.provider || "email",
      },
      { onConflict: "id" },
    )

    if (profileError) {
      console.error("Profile creation error:", profileError)
      // Don't fail - user is still authenticated
    }

    // Redirect to home page or protected area
    return NextResponse.redirect(new URL("/", request.url))
  } catch (err) {
    console.error("Callback error:", err)
    return NextResponse.redirect(new URL("/auth/login?error=unknown", request.url))
  }
}
