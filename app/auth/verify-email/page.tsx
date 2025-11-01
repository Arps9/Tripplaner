"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, MapPin } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function VerifyEmailPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || "your email"

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
          </div>

          <Card className="border-border/50 shadow-lg text-center">
            <CardHeader className="space-y-4">
              <div className="flex justify-center mb-2">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription className="text-base">
                We've sent a verification link to <br />
                <span className="font-medium text-foreground">{email}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-foreground">
                <p className="font-medium mb-2">Next steps:</p>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Check your email (including spam folder)</li>
                  <li>Click the verification link</li>
                  <li>Return here to complete setup</li>
                </ol>
              </div>

              <div className="space-y-2">
                <Link href="/auth/login" className="block">
                  <Button className="w-full gradient-india text-white hover:opacity-90">Back to Login</Button>
                </Link>
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent">
                    Return Home
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground">
                Didn't receive the email?{" "}
                <Link href="/auth/sign-up" className="text-primary hover:underline">
                  Try again
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
