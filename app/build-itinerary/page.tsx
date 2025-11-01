"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Landmark, IndianRupee, Clock, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { TicketSelector } from "@/components/itinerary/ticket-selector" // Fix import path and use named import for TicketSelector

interface State {
  id: string
  name: string
  region: string
  image: string
  description: string
}

interface City {
  name: string
  state: string
  image: string
}

interface Place {
  id: string
  name: string
  category: string
  entryFee: number
  estimatedTime: string
  image: string
  rating: number
}

interface HotelData {
  id: string
  name: string
  price: number
  rating: number
  image: string
  amenities: string[]
}

interface Restaurant {
  id: string
  name: string
  cuisine: string
  estimatedCost: number
  rating: number
  image: string
}

interface TicketBooking {
  ticketId: string
  quantity: number
}

export default function BuildItineraryPage() {
  const [step, setStep] = useState(1)
  const [states, setStates] = useState<State[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [places, setPlaces] = useState<Place[]>([])
  const [hotels, setHotels] = useState<HotelData[]>([])
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const [selectedState, setSelectedState] = useState<string>("")
  const [selectedCity, setSelectedCity] = useState<string>("")
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([])
  const [selectedHotel, setSelectedHotel] = useState<string>("")
  const [selectedRestaurants, setSelectedRestaurants] = useState<string[]>([])
  const [numDays, setNumDays] = useState(3)

  const [selectedTickets, setSelectedTickets] = useState<Map<string, number>>(new Map())

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStates()
  }, [])

  async function fetchStates() {
    setLoading(true)
    try {
      const response = await fetch("/api/states")
      const data = await response.json()
      if (data.success) {
        setStates(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch states:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchCities(state: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/cities?state=${encodeURIComponent(state)}`)
      const data = await response.json()
      if (data.success) {
        setCities(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch cities:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchPlaces(city: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/places?city=${encodeURIComponent(city)}&category=tourism.attraction`)
      const data = await response.json()
      if (data.success) {
        setPlaces(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch places:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchHotels(city: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/hotels?city=${encodeURIComponent(city)}`)
      const data = await response.json()
      if (data.success) {
        setHotels(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch hotels:", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchRestaurants(city: string) {
    setLoading(true)
    try {
      const response = await fetch(`/api/restaurants?city=${encodeURIComponent(city)}`)
      const data = await response.json()
      if (data.success) {
        setRestaurants(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  function handleStateSelect(stateName: string) {
    setSelectedState(stateName)
    fetchCities(stateName)
    setStep(2)
  }

  function handleCitySelect(cityName: string) {
    setSelectedCity(cityName)
    fetchPlaces(cityName)
    fetchHotels(cityName)
    fetchRestaurants(cityName)
    setStep(3)
  }

  function togglePlace(placeId: string) {
    setSelectedPlaces((prev) => (prev.includes(placeId) ? prev.filter((id) => id !== placeId) : [...prev, placeId]))
  }

  function toggleRestaurant(restaurantId: string) {
    setSelectedRestaurants((prev) =>
      prev.includes(restaurantId) ? prev.filter((id) => id !== restaurantId) : [...prev, restaurantId],
    )
  }

  // Added ticket toggle function
  function handleTicketToggle(ticket: any, quantity: number) {
    const newTickets = new Map(selectedTickets)
    if (quantity === 0) {
      newTickets.delete(ticket.id)
    } else {
      newTickets.set(ticket.id, quantity)
    }
    setSelectedTickets(newTickets)
  }

  const selectedPlacesData = places.filter((p) => selectedPlaces.includes(p.id))
  const selectedHotelData = hotels.find((h) => h.id === selectedHotel)
  const selectedRestaurantsData = restaurants.filter((r) => selectedRestaurants.includes(r.id))

  const placesTotal = selectedPlacesData.reduce((sum, p) => sum + p.entryFee, 0)
  const hotelTotal = selectedHotelData ? selectedHotelData.price * numDays : 0
  const restaurantsTotal = selectedRestaurantsData.reduce((sum, r) => sum + r.estimatedCost, 0) * numDays

  const ticketsTotal = Array.from(selectedTickets.entries()).reduce((sum, [_, qty]) => {
    // In real scenario, look up ticket price by ID
    return sum + qty * 500 // Placeholder: 500 per ticket
  }, 0)

  const grandTotal = placesTotal + hotelTotal + restaurantsTotal
  const updatedGrandTotal = grandTotal + ticketsTotal

  const handleSaveItinerary = async () => {
    try {
      const response = await fetch("/api/itineraries/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripName: `${numDays}-Day Trip to ${selectedCity}, ${selectedState}`,
          itinerary: {
            destination: selectedCity,
            state: selectedState,
            places: selectedPlacesData,
            hotel: selectedHotelData,
            restaurants: selectedRestaurantsData,
            tickets: Array.from(selectedTickets.entries()),
          },
          totalBudget: updatedGrandTotal,
          totalCost: updatedGrandTotal,
          numDays,
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
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Build Your Itinerary</h1>
              <p className="text-sm text-muted-foreground">Step {step} of 4</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Step 1: Select State */}
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Select a State</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading states...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {states.map((state) => (
                  <Card
                    key={state.id}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleStateSelect(state.name)}
                  >
                    <img
                      src={state.image || "/placeholder.svg"}
                      alt={state.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold mb-2 text-foreground">{state.name}</h3>
                      <Badge variant="secondary" className="mb-2">
                        {state.region} India
                      </Badge>
                      <p className="text-sm text-muted-foreground">{state.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Select City */}
        {step === 2 && (
          <div>
            <Button variant="outline" onClick={() => setStep(1)} className="mb-4">
              ← Back to States
            </Button>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Select a City in {selectedState}</h2>
            {loading ? (
              <p className="text-muted-foreground">Loading cities...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cities.map((city, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => handleCitySelect(city.name)}
                  >
                    <img src={city.image || "/placeholder.svg"} alt={city.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-foreground">{city.name}</h3>
                      <p className="text-sm text-muted-foreground">{city.state}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Select Places, Hotel, Restaurants */}
        {step === 3 && (
          <div>
            <Button variant="outline" onClick={() => setStep(2)} className="mb-4">
              ← Back to Cities
            </Button>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-foreground">Plan Your Trip to {selectedCity}</h2>
              <Button onClick={() => setStep(4)} disabled={selectedPlaces.length === 0 || !selectedHotel}>
                Continue to Summary <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Budget Summary Card */}
            <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
              <h3 className="text-xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Budget Summary
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Places</p>
                  <p className="text-2xl font-bold text-foreground">₹{placesTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Hotel ({numDays} nights)</p>
                  <p className="text-2xl font-bold text-foreground">₹{hotelTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Food</p>
                  <p className="text-2xl font-bold text-foreground">₹{restaurantsTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tickets</p>
                  <p className="text-2xl font-bold text-foreground">₹{ticketsTotal}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-3xl font-bold text-primary">₹{updatedGrandTotal}</p>
                </div>
              </div>
            </Card>

            {/* Places to Visit */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Landmark className="h-6 w-6" />
                Places to Visit
              </h3>
              {loading ? (
                <p className="text-muted-foreground">Loading places...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {places.slice(0, 12).map((place) => (
                    <Card key={place.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedPlaces.includes(place.id)}
                          onCheckedChange={() => togglePlace(place.id)}
                        />
                        <div className="flex-1">
                          <img
                            src={place.image || "/placeholder.svg"}
                            alt={place.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-semibold text-foreground">{place.name}</h4>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {place.category}
                          </Badge>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />₹{place.entryFee}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {place.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Hotels */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                {/* Hotel icon */}
                Select Hotel
              </h3>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground">Number of nights:</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={numDays}
                  onChange={(e) => setNumDays(Number.parseInt(e.target.value) || 1)}
                  className="ml-2 px-3 py-1 border rounded"
                />
              </div>
              {loading ? (
                <p className="text-muted-foreground">Loading hotels...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotels.slice(0, 6).map((hotel) => (
                    <Card
                      key={hotel.id}
                      className={`p-4 cursor-pointer transition-all ${selectedHotel === hotel.id ? "ring-2 ring-primary" : ""}`}
                      onClick={() => setSelectedHotel(hotel.id)}
                    >
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-40 object-cover rounded mb-3"
                      />
                      <h4 className="font-semibold text-foreground">{hotel.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">Rating: {hotel.rating.toFixed(1)} ⭐</p>
                      <p className="text-lg font-bold text-primary">₹{hotel.price} / night</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hotel.amenities.map((amenity, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Ticket Selector */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                Select Tickets
              </h3>
              {loading ? (
                <p className="text-muted-foreground">Loading tickets...</p>
              ) : (
                <TicketSelector
                  destination={selectedCity}
                  selectedTickets={selectedTickets}
                  onTicketToggle={handleTicketToggle}
                />
              )}
            </div>

            {/* Restaurants */}
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                {/* UtensilsCrossed icon */}
                Select Restaurants
              </h3>
              {loading ? (
                <p className="text-muted-foreground">Loading restaurants...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {restaurants.slice(0, 9).map((restaurant) => (
                    <Card key={restaurant.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedRestaurants.includes(restaurant.id)}
                          onCheckedChange={() => toggleRestaurant(restaurant.id)}
                        />
                        <div className="flex-1">
                          <img
                            src={restaurant.image || "/placeholder.svg"}
                            alt={restaurant.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-semibold text-foreground">{restaurant.name}</h4>
                          <Badge variant="secondary" className="text-xs mb-2">
                            {restaurant.cuisine}
                          </Badge>
                          <p className="text-sm text-muted-foreground">Rating: {restaurant.rating.toFixed(1)} ⭐</p>
                          <p className="text-sm font-semibold text-primary">₹{restaurant.estimatedCost} per meal</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && (
          <div>
            <Button variant="outline" onClick={() => setStep(3)} className="mb-4">
              ← Back to Planning
            </Button>
            <h2 className="text-3xl font-bold mb-6 text-foreground">Your Itinerary Summary</h2>

            <Card className="p-6 mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">
                {numDays}-Day Trip to {selectedCity}, {selectedState}
              </h3>

              <div className="space-y-6">
                {/* Places */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                    <Landmark className="h-5 w-5" />
                    Places to Visit ({selectedPlacesData.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedPlacesData.map((place) => (
                      <div key={place.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-foreground">{place.name}</span>
                        <span className="text-muted-foreground">₹{place.entryFee}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-right font-semibold mt-2 text-foreground">Subtotal: ₹{placesTotal}</p>
                </div>

                {/* Hotel */}
                {selectedHotelData && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      {/* Hotel icon */}
                      Accommodation
                    </h4>
                    <div className="p-3 bg-muted/50 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-foreground">{selectedHotelData.name}</span>
                        <span className="text-muted-foreground">
                          ₹{selectedHotelData.price} × {numDays} nights
                        </span>
                      </div>
                    </div>
                    <p className="text-right font-semibold mt-2 text-foreground">Subtotal: ₹{hotelTotal}</p>
                  </div>
                )}

                {/* Restaurants */}
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                    {/* UtensilsCrossed icon */}
                    Dining ({selectedRestaurantsData.length} restaurants)
                  </h4>
                  <div className="space-y-2">
                    {selectedRestaurantsData.map((restaurant) => (
                      <div key={restaurant.id} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                        <span className="text-foreground">{restaurant.name}</span>
                        <span className="text-muted-foreground">₹{restaurant.estimatedCost} per meal</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-right font-semibold mt-2 text-foreground">
                    Subtotal: ₹{restaurantsTotal} ({numDays} days)
                  </p>
                </div>

                {selectedTickets.size > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Tickets ({selectedTickets.size})
                    </h4>
                    <div className="space-y-2">
                      {Array.from(selectedTickets.entries()).map(([ticketId, qty]) => (
                        <div key={ticketId} className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <span className="text-foreground">Ticket #{ticketId.slice(0, 8)}</span>
                          <span className="text-muted-foreground">
                            ₹500 × {qty} = ₹{500 * qty}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="text-right font-semibold mt-2 text-foreground">Subtotal: ₹{ticketsTotal}</p>
                  </div>
                )}

                {/* Grand Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-2xl font-bold">
                    <span className="text-foreground">Grand Total</span>
                    <span className="text-primary">₹{updatedGrandTotal}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <Button className="flex-1" size="lg" onClick={handleSaveItinerary}>
                  Save Itinerary
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" size="lg">
                  Share
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
