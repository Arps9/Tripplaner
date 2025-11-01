import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Sparkles, MapIcon, Package, Cloud, ArrowRight, Star, Calendar, Shield, Quote } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { AuthButton } from "@/components/auth/auth-button"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const features = [
    {
      icon: Sparkles,
      title: "AI Travel Assistant",
      description: "Get personalized itineraries and recommendations powered by advanced AI",
      href: "/chat",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: MapIcon,
      title: "Trip Planner",
      description: "Build custom itineraries with drag-and-drop interface and real-time budget tracking",
      href: "/planner",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: Package,
      title: "Travel Packages",
      description: "Pre-built all-inclusive packages curated by travel experts",
      href: "/packages",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      icon: Cloud,
      title: "Weather Dashboard",
      description: "Real-time weather and travel conditions across India",
      href: "/weather",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
  ]

  const featuredDestinations = [
    {
      name: "Jaipur",
      region: "Rajasthan",
      image: "/jaipur-pink-city-hawa-mahal-palace.jpg",
      description: "The Pink City with majestic forts and palaces",
      rating: 4.8,
    },
    {
      name: "Kerala",
      region: "South India",
      image: "/kerala-backwaters-houseboat-palm-trees.jpg",
      description: "God's Own Country with serene backwaters",
      rating: 4.9,
    },
    {
      name: "Varanasi",
      region: "Uttar Pradesh",
      image: "/varanasi-ganges-river-ghats-evening-aarti.jpg",
      description: "Ancient spiritual city on the Ganges",
      rating: 4.7,
    },
    {
      name: "Goa",
      region: "West India",
      image: "/goa-beaches-sunset-palm-trees.jpg",
      description: "Beach paradise with Portuguese heritage",
      rating: 4.6,
    },
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      rating: 5,
      text: "The AI assistant helped me plan a perfect 10-day trip across Rajasthan. Every recommendation was spot-on, and the itinerary was perfectly paced!",
      avatar: "PS",
    },
    {
      name: "Rajesh Kumar",
      location: "Bangalore, Karnataka",
      rating: 5,
      text: "I've used many travel apps, but this is the first one that truly understands India. The weather insights saved my Kerala trip from monsoon troubles!",
      avatar: "RK",
    },
    {
      name: "Ananya Patel",
      location: "Delhi, NCR",
      rating: 5,
      text: "Planning our family trip to Himachal was so easy. The package recommendations fit our budget perfectly, and the kids loved every moment!",
      avatar: "AP",
    },
    {
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      rating: 5,
      text: "As a frequent traveler, I appreciate the real-time updates and local insights. This platform knows India better than any other travel service.",
      avatar: "VS",
    },
  ]

  const trustIndicators = [
    { icon: Shield, text: "100% India Focused" },
    { icon: Star, text: "Expert Curated" },
    { icon: Calendar, text: "Real-time Updates" },
  ]

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
              <Link href="/weather">
                <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary">
                  Weather
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="sm" className="gradient-india text-white hover:opacity-90 shadow-md">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try AI Assistant
                </Button>
              </Link>
              <AuthButton user={user} />
            </div>
          </div>
        </div>
      </nav>

      <section className="py-16 md:py-24 gradient-india relative overflow-hidden sanskrit-pattern">
        <div className="absolute inset-0 stone-texture opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Travel Planning for India
            </Badge>
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 text-balance drop-shadow-lg">
              Discover the Magic of Incredible India
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 text-pretty max-w-2xl mx-auto drop-shadow">
              Your intelligent companion for exploring India's incredible diversity. From Himalayas to beaches, temples
              to tech hubs, ancient traditions to modern marvels.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link href="/chat">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Start Planning with AI
                </Button>
              </Link>
              <Link href="/packages">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Browse Packages
                </Button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 justify-center text-white/90">
              {trustIndicators.map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.text}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-india mb-4">
              Explore Popular Destinations
            </h2>
            <p className="text-lg text-muted-foreground">
              From ancient temples to modern cities, discover the diversity of India
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {featuredDestinations.map((destination, index) => (
              <Link key={index} href="/destinations">
                <Card className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 group border-border/50">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image || "/placeholder.svg"}
                      alt={destination.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="text-sm font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="font-serif text-xl group-hover:text-primary transition-colors">
                      {destination.name}
                    </CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{destination.region}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{destination.description}</p>
                    <div className="flex items-center text-sm text-primary font-medium">
                      Explore destination
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gradient-india mb-4">
              Loved by Travelers Across India
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of happy travelers who discovered their perfect Indian adventure with us
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 bg-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full gradient-india flex items-center justify-center text-white font-semibold shadow-md">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{testimonial.name}</CardTitle>
                        <CardDescription className="text-xs">{testimonial.location}</CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                </CardHeader>
                <CardContent>
                  <Quote className="h-6 w-6 text-primary/20 mb-2" />
                  <p className="text-sm text-muted-foreground leading-relaxed">{testimonial.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 gradient-india relative overflow-hidden sanskrit-pattern">
        <div className="absolute inset-0 stone-texture opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Ready to Explore India?
            </h2>
            <p className="text-xl mb-8 text-white/90 drop-shadow">
              Start planning your dream trip today with our AI-powered travel assistant
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/chat">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Chat with AI Assistant
                </Button>
              </Link>
              <Link href="/planner">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <MapIcon className="h-5 w-5 mr-2" />
                  Build Custom Itinerary
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/50 py-12 stone-texture">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg gradient-india flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <span className="font-serif text-xl font-bold text-gradient-india">Discover India</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI-powered companion for exploring the incredible diversity of India.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Explore</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/destinations" className="hover:text-primary transition-colors">
                    Destinations
                  </Link>
                </li>
                <li>
                  <Link href="/packages" className="hover:text-primary transition-colors">
                    Packages
                  </Link>
                </li>
                <li>
                  <Link href="/planner" className="hover:text-primary transition-colors">
                    Trip Planner
                  </Link>
                </li>
                <li>
                  <Link href="/weather" className="hover:text-primary transition-colors">
                    Weather
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/chat" className="hover:text-primary transition-colors">
                    AI Assistant
                  </Link>
                </li>
                <li>
                  <Link href="/guides" className="hover:text-primary transition-colors">
                    Travel Guides
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 Discover India. Strictly for travel within India only. 🇮🇳</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
