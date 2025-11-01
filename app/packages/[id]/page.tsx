import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Calendar,
  IndianRupee,
  Users,
  Check,
  Clock,
  HotelIcon,
  UtensilsCrossed,
  MapIcon,
  ArrowLeft,
  Share2,
  Heart,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function PackageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: pkg, error } = await supabase.from("packages").select("*").eq("id", id).single()

  if (error || !pkg) {
    notFound()
  }

  // Mock itinerary data (in real app, this would come from the itinerary JSONB field)
  const dailyItinerary = Array.from({ length: pkg.duration_days }, (_, i) => ({
    day: i + 1,
    title: `Day ${i + 1}`,
    activities: [
      "Morning: Breakfast at hotel",
      "Visit local attractions",
      "Lunch at recommended restaurant",
      "Afternoon sightseeing",
      "Evening: Free time or optional activities",
      "Dinner and overnight stay",
    ],
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-primary" />
              <span className="font-serif text-2xl font-bold text-foreground">Discover India</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/packages">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={pkg.image_url || "/placeholder.svg?height=400&width=1200&query=india travel package"}
          alt={pkg.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{pkg.duration_days} Days</Badge>
              {pkg.difficulty_level && <Badge variant="secondary">{pkg.difficulty_level}</Badge>}
              {pkg.best_for?.map((type: string) => (
                <Badge key={type} variant="outline" className="bg-background/80 backdrop-blur-sm">
                  {type}
                </Badge>
              ))}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">{pkg.name}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">{pkg.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Package Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-semibold">{pkg.duration_days} Days</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best For</p>
                      <p className="font-semibold">{pkg.best_for?.[0] || "All"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Difficulty</p>
                      <p className="font-semibold">{pkg.difficulty_level || "Moderate"}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* What's Included */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    What's Included
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {pkg.includes?.map((item: string, index: number) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Day-by-Day Itinerary */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Day-by-Day Itinerary</CardTitle>
                <CardDescription>Detailed breakdown of your journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dailyItinerary.map((day) => (
                  <div key={day.day} className="border-l-2 border-primary pl-4 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                        {day.day}
                      </div>
                      <h4 className="font-semibold">{day.title}</h4>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {day.activities.map((activity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Accommodation & Meals */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HotelIcon className="h-5 w-5 text-primary" />
                    Accommodation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Comfortable {pkg.difficulty_level?.toLowerCase() || "mid-range"} hotels with modern amenities. All
                    rooms include AC, WiFi, and breakfast.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UtensilsCrossed className="h-5 w-5 text-primary" />
                    Meals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Daily breakfast included. Lunch and dinner at carefully selected local restaurants featuring
                    authentic Indian cuisine.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center gap-1 text-3xl font-bold text-foreground">
                    <IndianRupee className="h-6 w-6" />
                    <span>{pkg.total_budget.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">per person</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium">
                      {pkg.duration_days} Days / {pkg.duration_days - 1} Nights
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Group Size</span>
                    <span className="font-medium">2-15 people</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Availability</span>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Available
                    </Badge>
                  </div>
                </div>

                <Separator />

                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
                  Book Now
                </Button>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2">
                  <p className="text-sm font-semibold">Need help?</p>
                  <Link href="/chat">
                    <Button variant="outline" className="w-full bg-transparent">
                      Chat with AI Assistant
                    </Button>
                  </Link>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Free cancellation</strong> up to 7 days before departure. Full refund guaranteed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
