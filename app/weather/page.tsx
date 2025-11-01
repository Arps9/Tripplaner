import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Snowflake,
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

// Mock weather data generator (in production, this would call a weather API)
function generateWeatherData(destinationName: string, region: string) {
  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Clear"]
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

  // Temperature varies by region
  let tempRange = { min: 20, max: 35 }
  if (region === "North" || region === "Northeast") {
    tempRange = { min: 10, max: 25 }
  } else if (region === "South") {
    tempRange = { min: 25, max: 35 }
  }

  const temp = Math.floor(Math.random() * (tempRange.max - tempRange.min) + tempRange.min)

  return {
    temperature: temp,
    condition: randomCondition,
    humidity: Math.floor(Math.random() * 40 + 40), // 40-80%
    windSpeed: Math.floor(Math.random() * 20 + 5), // 5-25 km/h
    visibility: Math.floor(Math.random() * 5 + 5), // 5-10 km
    uvIndex: Math.floor(Math.random() * 8 + 1), // 1-8
    feelsLike: temp + Math.floor(Math.random() * 5 - 2),
  }
}

export default async function WeatherDashboardPage() {
  const supabase = await createClient()

  const { data: destinations } = await supabase
    .from("destinations")
    .select("*")
    .order("name", { ascending: true })
    .limit(20)

  // Generate weather data for each destination
  const destinationsWithWeather = destinations?.map((dest) => ({
    ...dest,
    weather: generateWeatherData(dest.name, dest.region),
  }))

  // Group by region
  const regions = ["North", "South", "East", "West", "Central", "Northeast"]
  const destinationsByRegion = regions.reduce(
    (acc, region) => {
      acc[region] = destinationsWithWeather?.filter((d) => d.region === region) || []
      return acc
    },
    {} as Record<string, any[]>,
  )

  // Travel alerts (mock data)
  const travelAlerts = [
    {
      region: "Northeast",
      severity: "warning",
      message: "Heavy rainfall expected in Meghalaya and Assam. Plan accordingly.",
      icon: CloudRain,
    },
    {
      region: "North",
      severity: "info",
      message: "Pleasant weather in Himachal Pradesh. Perfect for trekking.",
      icon: Sun,
    },
    {
      region: "South",
      severity: "caution",
      message: "High temperatures in Tamil Nadu. Stay hydrated.",
      icon: Thermometer,
    },
  ]

  const getWeatherIcon = (condition: string) => {
    if (condition.includes("Rain")) return CloudRain
    if (condition.includes("Cloud")) return Cloud
    if (condition.includes("Clear") || condition.includes("Sunny")) return Sun
    return Cloud
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg gradient-india flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-gradient-india">Discover India</span>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/chat">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  AI Assistant
                </Button>
              </Link>
              <Link href="/destinations">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  Destinations
                </Button>
              </Link>
              <Link href="/packages">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  Packages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 gradient-india relative overflow-hidden sanskrit-pattern">
        <div className="absolute inset-0 stone-texture opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Cloud className="h-3 w-3 mr-1" />
              Updated Every Hour
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-4 text-balance drop-shadow-lg">
              Weather & Travel Conditions
            </h1>
            <p className="text-lg text-white/90 text-pretty drop-shadow">
              Real-time weather updates and travel advisories for destinations across India
            </p>
          </div>
        </div>
      </section>

      {travelAlerts.length > 0 && (
        <section className="py-8 border-b border-border bg-muted/30 stone-texture">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Travel Alerts & Advisories</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {travelAlerts.map((alert, index) => {
                const Icon = alert.icon
                return (
                  <Card
                    key={index}
                    className={
                      alert.severity === "warning"
                        ? "border-primary/30 bg-primary/5"
                        : alert.severity === "caution"
                          ? "border-accent/30 bg-accent/5"
                          : "border-secondary/30 bg-secondary/5"
                    }
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`h-5 w-5 flex-shrink-0 ${
                            alert.severity === "warning"
                              ? "text-primary"
                              : alert.severity === "caution"
                                ? "text-accent"
                                : "text-secondary"
                          }`}
                        />
                        <div>
                          <Badge
                            variant="outline"
                            className={
                              alert.severity === "warning"
                                ? "border-primary text-primary mb-2"
                                : alert.severity === "caution"
                                  ? "border-accent text-accent mb-2"
                                  : "border-secondary text-secondary mb-2"
                            }
                          >
                            {alert.region}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{alert.message}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Weather by Region */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="North">
            <TabsList className="grid w-full grid-cols-6 mb-8 bg-muted/50">
              {regions.map((region) => (
                <TabsTrigger
                  key={region}
                  value={region}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {region}
                </TabsTrigger>
              ))}
            </TabsList>

            {regions.map((region) => (
              <TabsContent key={region} value={region}>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {destinationsByRegion[region]?.map((destination) => {
                    const WeatherIcon = getWeatherIcon(destination.weather.condition)
                    return (
                      <Card
                        key={destination.id}
                        className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 border-border/50"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="font-serif text-xl text-foreground">{destination.name}</CardTitle>
                              <CardDescription>{destination.state}</CardDescription>
                            </div>
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <WeatherIcon className="h-8 w-8 text-primary" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="text-center py-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border border-border/50">
                            <div className="text-4xl font-bold text-foreground">
                              {destination.weather.temperature}°C
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{destination.weather.condition}</p>
                            <p className="text-xs text-muted-foreground">
                              Feels like {destination.weather.feelsLike}°C
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                              <div className="bg-secondary/10 p-2 rounded-lg">
                                <Droplets className="h-4 w-4 text-secondary" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Humidity</p>
                                <p className="text-sm font-medium text-foreground">{destination.weather.humidity}%</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-muted p-2 rounded-lg">
                                <Wind className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Wind</p>
                                <p className="text-sm font-medium text-foreground">
                                  {destination.weather.windSpeed} km/h
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-accent/10 p-2 rounded-lg">
                                <Eye className="h-4 w-4 text-accent" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Visibility</p>
                                <p className="text-sm font-medium text-foreground">
                                  {destination.weather.visibility} km
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="bg-chart-4/10 p-2 rounded-lg">
                                <Sun className="h-4 w-4 text-chart-4" />
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">UV Index</p>
                                <p className="text-sm font-medium text-foreground">{destination.weather.uvIndex}</p>
                              </div>
                            </div>
                          </div>

                          {/* Best Time to Visit */}
                          <div className="pt-3 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">Best time:</span>
                              <span className="font-medium text-foreground">{destination.best_time_to_visit}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm mt-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              <span className="text-muted-foreground">Footfall:</span>
                              <span className="font-medium text-foreground">{destination.average_footfall}</span>
                            </div>
                          </div>

                          {/* View Details */}
                          <Link href={`/destinations/${destination.id}`}>
                            <Button
                              variant="outline"
                              className="w-full bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary"
                            >
                              View Full Details
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {destinationsByRegion[region]?.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <Cloud className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No destinations available in this region</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      <section className="py-16 bg-muted/30 stone-texture">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-gradient-india mb-4">
              Seasonal Travel Guide
            </h2>
            <p className="text-muted-foreground">Plan your trip based on India's diverse climate zones</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="hover:shadow-lg transition-all hover:scale-105 border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="bg-chart-4/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sun className="h-6 w-6 text-chart-4" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Summer (Mar-Jun)</h3>
                <p className="text-sm text-muted-foreground">Visit hill stations and northern regions. Avoid plains.</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all hover:scale-105 border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="bg-secondary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CloudRain className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Monsoon (Jul-Sep)</h3>
                <p className="text-sm text-muted-foreground">
                  Perfect for Kerala and Western Ghats. Avoid coastal areas.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all hover:scale-105 border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wind className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Autumn (Oct-Nov)</h3>
                <p className="text-sm text-muted-foreground">
                  Best time for most destinations. Pleasant weather everywhere.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-all hover:scale-105 border-border/50">
              <CardContent className="pt-6 text-center">
                <div className="bg-accent/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Snowflake className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold mb-2 text-foreground">Winter (Dec-Feb)</h3>
                <p className="text-sm text-muted-foreground">
                  Ideal for beaches and southern India. Cold in the north.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
