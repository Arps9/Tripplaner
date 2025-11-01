"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  MapPin,
  Calendar,
  IndianRupee,
  ArrowLeft,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Star,
  HotelIcon,
  UtensilsCrossed,
  Landmark,
  Twitter,
  MessageCircle,
  Cloud,
  Thermometer,
  Wind,
  Loader2,
} from "lucide-react"

interface Destination {
  id: string
  name: string
  state: string
  region: string
  description: string
  averageBudgetPerDay: number
  imageUrl: string
  bestTimeToVisit: string
  averageFootfall: string
  bestSeason: string
  popularActivities?: string[]
  hotels?: any[]
  restaurants?: any[]
  attractions?: any[]
  reviews?: any[]
  weather?: any
  nearbyDestinations?: any[]
}

export default function DestinationDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDestination()
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/destinations/${id}`)

      if (!response.ok) {
        throw new Error("Destination not found")
      }

      const data = await response.json()
      setDestination(data)
    } catch (err) {
      console.error("Error fetching destination:", err)
      setError(err instanceof Error ? err.message : "Failed to load destination")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="font-serif text-2xl font-semibold mb-2">Destination Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The destination you're looking for doesn't exist"}</p>
          <Link href="/destinations">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Destinations
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculate sentiment statistics
  const reviews = destination.reviews || []
  const sentimentCounts = {
    Positive: reviews.filter((r: any) => r.sentiment === "Positive").length,
    Neutral: reviews.filter((r: any) => r.sentiment === "Neutral").length,
    Negative: reviews.filter((r: any) => r.sentiment === "Negative").length,
  }
  const totalReviews = reviews.length
  const positivePercentage = totalReviews > 0 ? (sentimentCounts.Positive / totalReviews) * 100 : 0
  const neutralPercentage = totalReviews > 0 ? (sentimentCounts.Neutral / totalReviews) * 100 : 0
  const negativePercentage = totalReviews > 0 ? (sentimentCounts.Negative / totalReviews) * 100 : 0

  const hotels = destination.hotels || []
  const restaurants = destination.restaurants || []
  const attractions = destination.attractions || []
  const nearbyDestinations = destination.nearbyDestinations || []

  // Weather data
  const weatherData = destination.weather || {
    temperature: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
  }

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
            <Link href="/destinations">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Destinations
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={destination.imageUrl || "/placeholder.svg"}
          alt={destination.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge className="bg-primary text-primary-foreground">{destination.region}</Badge>
              <Badge variant="secondary">{destination.bestSeason}</Badge>
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
                <TrendingUp className="h-3 w-3 mr-1" />
                {destination.averageFootfall} Footfall
              </Badge>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-2">{destination.name}</h1>
            <p className="text-lg text-muted-foreground">{destination.state}</p>
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
                <CardTitle className="font-serif text-2xl">About {destination.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{destination.description}</p>

                <div className="grid md:grid-cols-3 gap-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Best Time</p>
                      <p className="font-semibold">{destination.bestTimeToVisit}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <IndianRupee className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget/Day</p>
                      <p className="font-semibold">₹{destination.averageBudgetPerDay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Footfall</p>
                      <p className="font-semibold">{destination.averageFootfall}</p>
                    </div>
                  </div>
                </div>

                {destination.popularActivities && destination.popularActivities.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Popular Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        {destination.popularActivities.map((activity: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {activity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Social Media Sentiment Analysis */}
            {totalReviews > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl flex items-center gap-2">
                    <MessageCircle className="h-6 w-6 text-primary" />
                    Social Media Sentiment
                  </CardTitle>
                  <CardDescription>
                    Real-time analysis from {totalReviews} social media posts and reviews
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sentiment Overview */}
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <ThumbsUp className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-bold text-green-600">{sentimentCounts.Positive}</span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-400">Positive</p>
                        <Progress value={positivePercentage} className="mt-2 bg-green-200" />
                      </CardContent>
                    </Card>
                    <Card className="border-gray-200 bg-gray-50 dark:bg-gray-950/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Minus className="h-5 w-5 text-gray-600" />
                          <span className="text-2xl font-bold text-gray-600">{sentimentCounts.Neutral}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-400">Neutral</p>
                        <Progress value={neutralPercentage} className="mt-2 bg-gray-200" />
                      </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <ThumbsDown className="h-5 w-5 text-red-600" />
                          <span className="text-2xl font-bold text-red-600">{sentimentCounts.Negative}</span>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-400">Negative</p>
                        <Progress value={negativePercentage} className="mt-2 bg-red-200" />
                      </CardContent>
                    </Card>
                  </div>

                  <Separator />

                  {/* Recent Reviews */}
                  <div>
                    <h3 className="font-semibold mb-4">Recent Social Media Posts</h3>
                    <div className="space-y-3">
                      {reviews.slice(0, 5).map((review: any) => (
                        <div key={review.id} className="border border-border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Twitter className="h-4 w-4 text-blue-500" />
                              <span className="font-medium text-sm">{review.author}</span>
                              <Badge
                                variant="outline"
                                className={
                                  review.sentiment === "Positive"
                                    ? "text-green-600 border-green-600"
                                    : review.sentiment === "Negative"
                                      ? "text-red-600 border-red-600"
                                      : "text-gray-600 border-gray-600"
                                }
                              >
                                {review.sentiment}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(review.posted_at || review.postedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{review.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Hotels, Restaurants, Attractions Tabs */}
            <Card>
              <CardHeader>
                <CardTitle className="font-serif text-2xl">Places to Visit & Stay</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="attractions">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="attractions">
                      <Landmark className="h-4 w-4 mr-2" />
                      Attractions
                    </TabsTrigger>
                    <TabsTrigger value="hotels">
                      <HotelIcon className="h-4 w-4 mr-2" />
                      Hotels
                    </TabsTrigger>
                    <TabsTrigger value="restaurants">
                      <UtensilsCrossed className="h-4 w-4 mr-2" />
                      Restaurants
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="attractions" className="space-y-3 mt-4">
                    {attractions.length > 0 ? (
                      attractions.map((attraction: any) => (
                        <Card key={attraction.id || attraction.name}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold">{attraction.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{attraction.description}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm">
                                  <Badge variant="outline">{attraction.type || attraction.category}</Badge>
                                  {attraction.entryFee !== undefined && (
                                    <span className="flex items-center gap-1 text-muted-foreground">
                                      <IndianRupee className="h-3 w-3" />₹{attraction.entryFee}
                                    </span>
                                  )}
                                  {attraction.timeRequired && (
                                    <span className="text-muted-foreground">{attraction.timeRequired}</span>
                                  )}
                                  {attraction.rating && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {attraction.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No attractions data available</p>
                    )}
                  </TabsContent>

                  <TabsContent value="hotels" className="space-y-3 mt-4">
                    {hotels.length > 0 ? (
                      hotels.map((hotel: any) => (
                        <Card key={hotel.id || hotel.name}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{hotel.name}</h4>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline">{hotel.category || hotel.type}</Badge>
                                  {hotel.pricePerNight !== undefined && (
                                    <span className="flex items-center gap-1 text-sm">
                                      <IndianRupee className="h-3 w-3" />₹{hotel.pricePerNight}/night
                                    </span>
                                  )}
                                  {hotel.rating && (
                                    <span className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {hotel.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No hotels data available</p>
                    )}
                  </TabsContent>

                  <TabsContent value="restaurants" className="space-y-3 mt-4">
                    {restaurants.length > 0 ? (
                      restaurants.map((restaurant: any) => (
                        <Card key={restaurant.id || restaurant.name}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold">{restaurant.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {restaurant.cuisineType?.join(", ") || restaurant.cuisine}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <Badge variant="outline">{restaurant.priceRange || restaurant.category}</Badge>
                                  {restaurant.rating && (
                                    <span className="flex items-center gap-1 text-sm">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {restaurant.rating}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No restaurants data available</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {nearbyDestinations.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="font-serif text-2xl">Nearby Destinations</CardTitle>
                  <CardDescription>Explore other amazing places in {destination.region} India</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {nearbyDestinations.map((nearby: any) => (
                      <Link key={nearby.id} href={`/destinations/${nearby.id}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                          <div className="relative h-40">
                            <img
                              src={nearby.imageUrl || "/placeholder.svg"}
                              alt={nearby.name}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary text-primary-foreground">{nearby.region}</Badge>
                            </div>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-1">{nearby.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{nearby.state}</p>
                            <div className="flex items-center justify-between text-sm">
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <IndianRupee className="h-3 w-3" />₹{nearby.averageBudgetPerDay}/day
                              </span>
                              <span className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {nearby.bestSeason}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Current Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-primary" />
                  Current Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                  <p className="text-muted-foreground">{weatherData.condition}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Thermometer className="h-4 w-4" />
                      Humidity
                    </span>
                    <span className="font-medium">{weatherData.humidity}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Wind className="h-4 w-4" />
                      Wind Speed
                    </span>
                    <span className="font-medium">{weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Plan Your Visit</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/chat">
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Get AI Recommendations
                  </Button>
                </Link>
                <Link href="/build-itinerary">
                  <Button variant="outline" className="w-full bg-transparent">
                    Add to Itinerary
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Travel Tips */}
            <Card className="bg-accent/30">
              <CardHeader>
                <CardTitle className="text-lg">Travel Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="text-muted-foreground">
                  <strong>Best Season:</strong> {destination.bestSeason}
                </p>
                <p className="text-muted-foreground">
                  <strong>Crowd Level:</strong> {destination.averageFootfall}
                </p>
                <p className="text-muted-foreground">
                  <strong>Recommended Duration:</strong> 2-3 days
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
