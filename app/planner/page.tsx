"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Calendar,
  IndianRupee,
  Clock,
  Plus,
  X,
  Save,
  HotelIcon,
  UtensilsCrossed,
  Landmark,
  Search,
  Loader2,
  Check,
  Download,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { jsPDF } from "jspdf"
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

type Destination = {
  id: string
  name: string
  state: string
  region: string
  description: string
  averageBudgetPerDay: number
  imageUrl: string
}

type Hotel = {
  id: string
  name: string
  rating: number
  price: number
  amenities: string[]
  image: string
  location: {
    lat: number
    lon: number
    address: string
  }
}

type Restaurant = {
  id: string
  name: string
  cuisine: string
  rating: number
  priceRange: string
  estimatedCost: number
  image: string
  location: {
    lat: number
    lon: number
    address: string
  }
}

type Attraction = {
  id: string
  name: string
  category: string
  entryFee: number
  estimatedTime: string
  rating: number
  image: string
  location: {
    lat: number
    lon: number
    address: string
  }
}

type ItineraryDay = {
  day: number
  destination: Destination | null
  hotel: Hotel | null
  restaurants: Restaurant[]
  attractions: Attraction[]
  notes: string
}

export default function PlannerPage() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([
    { day: 1, destination: null, hotel: null, restaurants: [], attractions: [], notes: "" },
  ])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [tripName, setTripName] = useState("My India Trip")
  const [totalBudget, setTotalBudget] = useState(50000)

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/destinations")
      const data = await response.json()
      setDestinations(data.slice(0, 20))
    } catch (error) {
      console.error("Error loading destinations:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadDestinationDetails = async (destination: Destination) => {
    setLoadingDetails(true)
    try {
      const [hotelsRes, restaurantsRes, attractionsRes] = await Promise.all([
        fetch(`/api/hotels?city=${encodeURIComponent(destination.name)}`),
        fetch(`/api/restaurants?city=${encodeURIComponent(destination.name)}`),
        fetch(`/api/places?city=${encodeURIComponent(destination.name)}&category=tourism.attraction`),
      ])

      const [hotelsData, restaurantsData, attractionsData] = await Promise.all([
        hotelsRes.json(),
        restaurantsRes.json(),
        attractionsRes.json(),
      ])

      if (hotelsData.success) setHotels(hotelsData.data || [])
      if (restaurantsData.success) setRestaurants(restaurantsData.data || [])
      if (attractionsData.success) setAttractions(attractionsData.data || [])
    } catch (error) {
      console.error("Error loading destination details:", error)
    } finally {
      setLoadingDetails(false)
    }
  }

  const selectDestination = (destination: Destination) => {
    setSelectedDestination(destination)
    loadDestinationDetails(destination)
    // Add destination to the active day
    addToDay(activeDayIndex, "destination", destination)
  }

  const addDay = () => {
    setItinerary([
      ...itinerary,
      {
        day: itinerary.length + 1,
        destination: null,
        hotel: null,
        restaurants: [],
        attractions: [],
        notes: "",
      },
    ])
  }

  const removeDay = (dayIndex: number) => {
    if (itinerary.length === 1) return
    const newItinerary = itinerary.filter((_, index) => index !== dayIndex)
    // Renumber days
    newItinerary.forEach((day, index) => {
      day.day = index + 1
    })
    setItinerary(newItinerary)
    if (activeDayIndex >= newItinerary.length) {
      setActiveDayIndex(newItinerary.length - 1)
    }
  }

  const addToDay = (dayIndex: number, type: "destination" | "hotel" | "restaurant" | "attraction", item: any) => {
    const newItinerary = [...itinerary]
    if (type === "destination") {
      newItinerary[dayIndex].destination = item
    } else if (type === "hotel") {
      newItinerary[dayIndex].hotel = item
    } else if (type === "restaurant") {
      if (!newItinerary[dayIndex].restaurants.find((r) => r.id === item.id)) {
        newItinerary[dayIndex].restaurants.push(item)
      }
    } else if (type === "attraction") {
      if (!newItinerary[dayIndex].attractions.find((a) => a.id === item.id)) {
        newItinerary[dayIndex].attractions.push(item)
      }
    }
    setItinerary(newItinerary)
  }

  const removeFromDay = (dayIndex: number, type: "hotel" | "restaurant" | "attraction", itemId: string) => {
    const newItinerary = [...itinerary]
    if (type === "hotel") {
      newItinerary[dayIndex].hotel = null
    } else if (type === "restaurant") {
      newItinerary[dayIndex].restaurants = newItinerary[dayIndex].restaurants.filter((r) => r.id !== itemId)
    } else if (type === "attraction") {
      newItinerary[dayIndex].attractions = newItinerary[dayIndex].attractions.filter((a) => a.id !== itemId)
    }
    setItinerary(newItinerary)
  }

  const calculateTotalCost = () => {
    return itinerary.reduce((total, day) => {
      let dayCost = 0
      if (day.hotel) dayCost += day.hotel.price
      day.attractions.forEach((a) => (dayCost += a.entryFee || 0))
      day.restaurants.forEach((r) => (dayCost += r.estimatedCost || 500))
      return total + dayCost
    }, 0)
  }

  const calculateTotalTime = () => {
    return itinerary.reduce((total, day) => {
      let dayHours = 0
      day.attractions.forEach((a) => {
        const hours = Number.parseInt(a.estimatedTime) || 2
        dayHours += hours
      })
      return total + dayHours
    }, 0)
  }

  const filteredDestinations = destinations.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.state.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalCost = calculateTotalCost()
  const totalTime = calculateTotalTime()
  const budgetRemaining = totalBudget - totalCost

  const downloadAsPDF = () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    let yPosition = 20

    // Title
    doc.setFontSize(24)
    doc.setFont("helvetica", "bold")
    doc.text(tripName, margin, yPosition)
    yPosition += 15

    // Summary
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Total Days: ${itinerary.length}`, margin, yPosition)
    yPosition += 7
    doc.text(`Total Budget: ₹${totalBudget.toLocaleString("en-IN")}`, margin, yPosition)
    yPosition += 7
    doc.text(`Estimated Cost: ₹${totalCost.toLocaleString("en-IN")}`, margin, yPosition)
    yPosition += 7
    doc.text(`Remaining: ₹${budgetRemaining.toLocaleString("en-IN")}`, margin, yPosition)
    yPosition += 15

    // Itinerary Details
    itinerary.forEach((day, index) => {
      // Check if we need a new page
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 20
      }

      // Day Header
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text(`Day ${day.day}`, margin, yPosition)
      yPosition += 10

      // Destination
      if (day.destination) {
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("Destination:", margin, yPosition)
        doc.setFont("helvetica", "normal")
        doc.text(`${day.destination.name}, ${day.destination.state}`, margin + 30, yPosition)
        yPosition += 7
      }

      // Hotel
      if (day.hotel) {
        doc.setFont("helvetica", "bold")
        doc.text("Hotel:", margin, yPosition)
        doc.setFont("helvetica", "normal")
        doc.text(`${day.hotel.name} - ₹${day.hotel.price}/night`, margin + 30, yPosition)
        yPosition += 7
      }

      // Attractions
      if (day.attractions.length > 0) {
        doc.setFont("helvetica", "bold")
        doc.text("Attractions:", margin, yPosition)
        yPosition += 7
        day.attractions.forEach((attraction) => {
          doc.setFont("helvetica", "normal")
          const text = `• ${attraction.name} - ₹${attraction.entryFee || 0} (${attraction.estimatedTime})`
          doc.text(text, margin + 5, yPosition)
          yPosition += 6
        })
      }

      // Restaurants
      if (day.restaurants.length > 0) {
        doc.setFont("helvetica", "bold")
        doc.text("Dining:", margin, yPosition)
        yPosition += 7
        day.restaurants.forEach((restaurant) => {
          doc.setFont("helvetica", "normal")
          doc.text(`• ${restaurant.name} - ${restaurant.cuisine}`, margin + 5, yPosition)
          yPosition += 6
        })
      }

      yPosition += 10
    })

    doc.save(`${tripName.replace(/\s+/g, "_")}_Itinerary.pdf`)
  }

  const downloadAsWord = async () => {
    const children: any[] = []

    // Title
    children.push(
      new Paragraph({
        text: tripName,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    )

    // Summary
    children.push(
      new Paragraph({
        text: "Trip Summary",
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 200 },
      }),
    )

    children.push(
      new Paragraph({
        children: [new TextRun({ text: "Total Days: ", bold: true }), new TextRun(`${itinerary.length}`)],
        spacing: { after: 100 },
      }),
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Total Budget: ", bold: true }),
          new TextRun(`₹${totalBudget.toLocaleString("en-IN")}`),
        ],
        spacing: { after: 100 },
      }),
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Estimated Cost: ", bold: true }),
          new TextRun(`₹${totalCost.toLocaleString("en-IN")}`),
        ],
        spacing: { after: 100 },
      }),
    )

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Remaining Budget: ", bold: true }),
          new TextRun(`₹${budgetRemaining.toLocaleString("en-IN")}`),
        ],
        spacing: { after: 400 },
      }),
    )

    // Itinerary Details
    itinerary.forEach((day) => {
      children.push(
        new Paragraph({
          text: `Day ${day.day}`,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }),
      )

      if (day.destination) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Destination: ", bold: true }),
              new TextRun(`${day.destination.name}, ${day.destination.state}`),
            ],
            spacing: { after: 100 },
          }),
        )
      }

      if (day.hotel) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: "Hotel: ", bold: true }),
              new TextRun(`${day.hotel.name} - ₹${day.hotel.price}/night`),
            ],
            spacing: { after: 100 },
          }),
        )
      }

      if (day.attractions.length > 0) {
        children.push(
          new Paragraph({
            text: "Attractions:",
            bold: true,
            spacing: { before: 200, after: 100 },
          }),
        )
        day.attractions.forEach((attraction) => {
          children.push(
            new Paragraph({
              text: `• ${attraction.name} - ₹${attraction.entryFee || 0} (${attraction.estimatedTime})`,
              spacing: { after: 50 },
              indent: { left: 400 },
            }),
          )
        })
      }

      if (day.restaurants.length > 0) {
        children.push(
          new Paragraph({
            text: "Dining:",
            bold: true,
            spacing: { before: 200, after: 100 },
          }),
        )
        day.restaurants.forEach((restaurant) => {
          children.push(
            new Paragraph({
              text: `• ${restaurant.name} - ${restaurant.cuisine}`,
              spacing: { after: 50 },
              indent: { left: 400 },
            }),
          )
        })
      }
    })

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    })

    const blob = await Packer.toBlob(doc)
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${tripName.replace(/\s+/g, "_")}_Itinerary.docx`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleSaveItinerary = async () => {
    try {
      const response = await fetch("/api/itineraries/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripName,
          itinerary,
          totalBudget,
          totalCost,
          numDays: itinerary.length,
        }),
      })

      const result = await response.json()
      if (result.success) {
        alert("✅ Itinerary saved successfully!")
      } else {
        alert("❌ Failed to save: " + result.error)
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      alert("❌ Error saving itinerary")
    }
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
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Input
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                className="text-2xl font-serif font-bold border-none p-0 h-auto focus-visible:ring-0"
              />
              <p className="text-muted-foreground">Build your perfect India itinerary</p>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={downloadAsPDF} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Download as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={downloadAsWord} className="gap-2">
                    <FileText className="h-4 w-4" />
                    Download as Word
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleSaveItinerary} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save Itinerary
              </Button>
            </div>
          </div>

          {/* Budget Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Budget</p>
                    <div className="flex items-center gap-1 text-2xl font-bold">
                      <IndianRupee className="h-5 w-5" />
                      <Input
                        type="number"
                        value={totalBudget}
                        onChange={(e) => setTotalBudget(Number(e.target.value))}
                        className="border-none p-0 h-auto w-32 focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Estimated Cost</p>
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <IndianRupee className="h-5 w-5" />
                  <span>{totalCost.toLocaleString("en-IN")}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Remaining</p>
                <div
                  className={`flex items-center gap-1 text-2xl font-bold ${budgetRemaining < 0 ? "text-destructive" : "text-green-600"}`}
                >
                  <IndianRupee className="h-5 w-5" />
                  <span>{budgetRemaining.toLocaleString("en-IN")}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Total Days</p>
                <div className="flex items-center gap-1 text-2xl font-bold">
                  <Calendar className="h-5 w-5" />
                  <span>{itinerary.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Browse Items */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="font-serif">Browse & Add</CardTitle>
                <CardDescription>Search and add items to your itinerary</CardDescription>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  <span className="text-sm text-muted-foreground">Adding to:</span>
                  {itinerary.map((day, index) => (
                    <Button
                      key={day.day}
                      size="sm"
                      variant={activeDayIndex === index ? "default" : "outline"}
                      onClick={() => setActiveDayIndex(index)}
                      className="h-8"
                    >
                      {activeDayIndex === index && <Check className="h-3 w-3 mr-1" />}
                      Day {day.day}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="destinations">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="destinations">
                      <MapPin className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="hotels">
                      <HotelIcon className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="restaurants">
                      <UtensilsCrossed className="h-4 w-4" />
                    </TabsTrigger>
                    <TabsTrigger value="attractions">
                      <Landmark className="h-4 w-4" />
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="destinations" className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search destinations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-2">
                        {loading ? (
                          <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                          </div>
                        ) : (
                          filteredDestinations.map((dest) => (
                            <Card
                              key={dest.id}
                              className={`cursor-pointer hover:shadow-md transition-shadow ${
                                itinerary[activeDayIndex]?.destination?.id === dest.id ? "ring-2 ring-primary" : ""
                              }`}
                              onClick={() => selectDestination(dest)}
                            >
                              <CardContent className="p-3">
                                <div className="flex items-start gap-3">
                                  <img
                                    src={dest.imageUrl || "/placeholder.svg"}
                                    alt={dest.name}
                                    className="w-16 h-16 rounded object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">{dest.name}</h4>
                                    <p className="text-xs text-muted-foreground">{dest.state}</p>
                                    <div className="flex items-center gap-1 text-xs mt-1">
                                      <IndianRupee className="h-3 w-3" />
                                      <span>₹{dest.averageBudgetPerDay}/day</span>
                                    </div>
                                  </div>
                                  {itinerary[activeDayIndex]?.destination?.id === dest.id && (
                                    <Check className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="hotels" className="space-y-4">
                    {!selectedDestination ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Select a destination first</p>
                    ) : loadingDetails ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {hotels.map((hotel) => (
                            <Card key={hotel.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{hotel.name}</h4>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {hotel.amenities?.[0] || "Hotel"}
                                    </Badge>
                                    <div className="flex items-center gap-1 text-xs mt-1">
                                      <IndianRupee className="h-3 w-3" />
                                      <span>₹{hotel.price}/night</span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      addToDay(activeDayIndex, "hotel", hotel)
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>

                  <TabsContent value="restaurants" className="space-y-4">
                    {!selectedDestination ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Select a destination first</p>
                    ) : loadingDetails ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {restaurants.map((restaurant) => (
                            <Card key={restaurant.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{restaurant.name}</h4>
                                    <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {restaurant.priceRange}
                                    </Badge>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addToDay(activeDayIndex, "restaurant", restaurant)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>

                  <TabsContent value="attractions" className="space-y-4">
                    {!selectedDestination ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Select a destination first</p>
                    ) : loadingDetails ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <div className="space-y-2">
                          {attractions.map((attraction) => (
                            <Card key={attraction.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-3">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-semibold text-sm">{attraction.name}</h4>
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {attraction.category}
                                    </Badge>
                                    <div className="flex items-center gap-2 text-xs mt-1 text-muted-foreground">
                                      <span className="flex items-center gap-1">
                                        <IndianRupee className="h-3 w-3" />₹{attraction.entryFee || 0}
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {attraction.estimatedTime}
                                      </span>
                                    </div>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => addToDay(activeDayIndex, "attraction", attraction)}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Itinerary Builder */}
          <div className="lg:col-span-2 space-y-4">
            {itinerary.map((day, dayIndex) => (
              <Card key={day.day} className={activeDayIndex === dayIndex ? "ring-2 ring-primary" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveDayIndex(dayIndex)}
                        className={`rounded-full w-10 h-10 flex items-center justify-center font-bold transition-colors ${
                          activeDayIndex === dayIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-primary/20"
                        }`}
                      >
                        {day.day}
                      </button>
                      <div>
                        <CardTitle className="font-serif">Day {day.day}</CardTitle>
                        {day.destination && <CardDescription>{day.destination.name}</CardDescription>}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeDay(dayIndex)}
                      disabled={itinerary.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Destination */}
                  {!day.destination ? (
                    <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                      <MapPin className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {activeDayIndex === dayIndex
                          ? "Select a destination from the sidebar"
                          : "Click the day number to make this day active"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <img
                        src={day.destination.imageUrl || "/placeholder.svg"}
                        alt={day.destination.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{day.destination.name}</h4>
                        <p className="text-sm text-muted-foreground">{day.destination.state}</p>
                      </div>
                    </div>
                  )}

                  {/* Hotel */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <HotelIcon className="h-4 w-4" />
                      Accommodation
                    </Label>
                    {day.hotel ? (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{day.hotel.name}</p>
                          <p className="text-xs text-muted-foreground">₹{day.hotel.price}/night</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromDay(dayIndex, "hotel", day.hotel!.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No hotel selected</p>
                    )}
                  </div>

                  {/* Attractions */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <Landmark className="h-4 w-4" />
                      Attractions ({day.attractions.length})
                    </Label>
                    {day.attractions.length > 0 ? (
                      <div className="space-y-2">
                        {day.attractions.map((attraction) => (
                          <div key={attraction.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium text-sm">{attraction.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ₹{attraction.entryFee || 0} • {attraction.estimatedTime}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromDay(dayIndex, "attraction", attraction.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No attractions added</p>
                    )}
                  </div>

                  {/* Restaurants */}
                  <div>
                    <Label className="text-sm font-semibold flex items-center gap-2 mb-2">
                      <UtensilsCrossed className="h-4 w-4" />
                      Dining ({day.restaurants.length})
                    </Label>
                    {day.restaurants.length > 0 ? (
                      <div className="space-y-2">
                        {day.restaurants.map((restaurant) => (
                          <div key={restaurant.id} className="flex items-center justify-between p-2 bg-muted rounded">
                            <div>
                              <p className="font-medium text-sm">{restaurant.name}</p>
                              <p className="text-xs text-muted-foreground">{restaurant.cuisine}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromDay(dayIndex, "restaurant", restaurant.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No restaurants added</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button onClick={addDay} variant="outline" className="w-full border-dashed border-2 bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Another Day
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
