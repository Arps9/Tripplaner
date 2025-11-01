import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, IndianRupee, Users, TrendingUp, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function PackagesPage() {
  const supabase = await createClient()

  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  const categories = [
    { name: "All Packages", count: packages?.length || 0 },
    { name: "Adventure", count: 0 },
    { name: "Cultural", count: 0 },
    { name: "Spiritual", count: 0 },
    { name: "Beach", count: 0 },
    { name: "Hill Stations", count: 0 },
  ]

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
              <Link href="/planner">
                <Button variant="ghost" size="sm">
                  Trip Planner
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-accent/30 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="h-3 w-3 mr-1" />
              Curated by Travel Experts
            </Badge>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
              Pre-Built Travel Packages
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Hassle-free travel experiences designed for every type of traveler. All-inclusive packages with hotels,
              meals, transport, and guided tours.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button key={category.name} variant="outline" className="rounded-full bg-transparent">
                {category.name}
                {category.count > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages?.map((pkg) => (
              <Card key={pkg.id} className="overflow-hidden border-border hover:shadow-lg transition-shadow group">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={pkg.image_url || "/placeholder.svg?height=400&width=600&query=india travel package"}
                    alt={pkg.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary text-primary-foreground">{pkg.duration_days} Days</Badge>
                    {pkg.difficulty_level && <Badge variant="secondary">{pkg.difficulty_level}</Badge>}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="font-serif text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{pkg.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-2xl font-bold text-foreground">
                      <IndianRupee className="h-5 w-5" />
                      <span>{pkg.total_budget.toLocaleString("en-IN")}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">per person</span>
                  </div>

                  {/* Includes */}
                  {pkg.includes && pkg.includes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {pkg.includes.slice(0, 4).map((item: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Best For */}
                  {pkg.best_for && pkg.best_for.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Best for: {pkg.best_for.join(", ")}</span>
                    </div>
                  )}

                  {/* CTA */}
                  <Link href={`/packages/${pkg.id}`}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {(!packages || packages.length === 0) && (
            <div className="text-center py-16">
              <TrendingUp className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-serif text-2xl font-semibold mb-2">No packages available</h3>
              <p className="text-muted-foreground mb-6">Check back soon for exciting travel packages!</p>
              <Link href="/planner">
                <Button>Create Custom Itinerary</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Packages */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose Our Packages?</h2>
            <p className="text-muted-foreground">
              Expertly crafted experiences that take the stress out of travel planning
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">All-Inclusive</h3>
                <p className="text-sm text-muted-foreground">
                  Hotels, meals, transport, and activities all included in one price
                </p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Expert Guides</h3>
                <p className="text-sm text-muted-foreground">Local guides who know the best spots and hidden gems</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Best Value</h3>
                <p className="text-sm text-muted-foreground">Competitive pricing with no hidden costs or surprises</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-serif text-xl font-bold">Discover India</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered companion for exploring the incredible diversity of India.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/destinations" className="hover:text-foreground transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-foreground transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className="hover:text-foreground transition-colors">
                    Trip Planner
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/chat" className="hover:text-foreground transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-foreground transition-colors">
                    Travel Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Discover India. Strictly for travel within India only.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
