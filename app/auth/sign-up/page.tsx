"use client";  // must be FIRST line

export const dynamic = "force-dynamic";
export const revalidate = 0;

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const supabase = createClient();
    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/verify-email`,
        },
      });

      if (signUpError) throw signUpError;

      await supabase.from("user_profiles").insert({
        id: data.user?.id,
        email,
        full_name: fullName,
        provider: "email",
      });

      router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-accent/5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">

          <div className="flex flex-col gap-2 text-center mb-2">
            <div className="flex items-center justify-center gap-2">
              <div className="h-10 w-10 rounded-lg gradient-india flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-gradient-india">Discover India</span>
            </div>
            <p className="text-sm text-muted-foreground">Start your journey today</p>
          </div>

          <Card className="border-border/50 shadow-lg">
            <CardHeader className="space-y-3">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription>Join us to plan your perfect trip</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">

                <OAuthButtons />
                <Separator className="my-2" />

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md border border-destructive/20">
                      {error}
                    </div>
                  )}

                  <Button type="submit" disabled={isLoading} className="w-full gradient-india text-white hover:opacity-90">
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary font-medium hover:underline">
                    Sign in
                  </Link>
                </p>

              </div>
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
