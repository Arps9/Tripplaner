"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OAuthButtons } from "@/components/auth/oauth-buttons"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { MapPin } from "lucide-react"

function LoginContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const oauthError = searchParams.get("error")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}`,
        },
      })

      if (signInError) throw signInError

      // Create or update user profile
      const { data: userData } = await supabase.auth.getUser()
      if (userData.user) {
        await supabase.from("user_profiles").upsert(
          {
            id: userData.user.id,
            email: userData.user.email!,
            full_name: userData.user.user_metadata?.full_name || "",
            avatar_url: userData.user.user_metadata?.avatar_url || "",
            provider: "email",
          },
          { onConflict: "id" },
        )
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col gap-2 text-center mb-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-lg gradient-india flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-gradient-india">Discover India</span>
            </div>
            <p className="text-sm text-muted-foreground">Your AI-powered travel companion</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>Sign in to your travel account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* OAuth Options */}
                <OAuthButtons />

                <Separator className="my-2" />

                {/* Email/Password Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {(error || oauthError) && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                      {error || (oauthError === "oauth_failed" && "OAuth login failed. Please try again.")}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-india text-white hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign in with Email"}
                  </Button>
                </form>

                <div className="space-y-2 text-sm text-center">
                  <p className="text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
                      Create one
                    </Link>
                  </p>
                  <p className="text-muted-foreground text-xs">
                    <Link href="/" className="text-primary hover:underline">
                      Back to home
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-svh flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
