"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, IndianRupee, Search, TrendingUp, Loader2 } from "lucide-react"

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
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")

  const regions = ["All", "North", "South", "East", "West", "Central", "Northeast"]

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations")
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error("Error fetching destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.state.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion = selectedRegion === "All" || dest.region === selectedRegion
    return matchesSearch && matchesRegion
  })

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
              <Link href="/chat">
                <Button variant="ghost" size="sm">
                  AI Assistant
                </Button>
              </Link>
              <Link href="/packages">
                <Button variant="ghost" size="sm">
                  Packages
                </Button>
              </Link>
              <Link href="/planner">
                <Button variant="ghost" size="sm">
                  Trip Planner
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="py-16 bg-gradient-to-br from-accent/30 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Explore India's Destinations
            </h1>
            <p className="text-lg text-muted-foreground text-pretty mb-8">
              Discover incredible places across India with real-time information and live data
            </p>
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search destinations..."
                className="pl-12 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {regions.map((region) => (
              <Button
                key={region}
                variant={selectedRegion === region ? "default" : "outline"}
                className="rounded-full"
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((destination) => (
                <Card
                  key={destination.id}
                  className="overflow-hidden border-border hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={destination.imageUrl || "/placeholder.svg"}
                      alt={destination.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm">{destination.region}</Badge>
                    <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {destination.averageFootfall} Footfall
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="font-serif">{destination.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{destination.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{destination.bestTimeToVisit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹{destination.averageBudgetPerDay}/day</span>
                      </div>
                    </div>
                    <Link href={`/destinations/${destination.id}`}>
                      <Button className="w-full bg-transparent" variant="outline">
                        View Details & Reviews
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!loading && filteredDestinations.length === 0 && (
            <div className="text-center py-20">
              <MapPin className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">No destinations found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
