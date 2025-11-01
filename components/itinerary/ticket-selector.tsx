"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Train, Plane, Bus, MapPin, IndianRupee, Calendar } from "lucide-react"

interface Ticket {
  id: string
  ticket_type: string
  name: string
  description: string
  source?: string
  destination?: string
  price: number
  provider: string
  image_url: string
  benefits: string[]
}

interface Props {
  destination: string
  selectedTickets: Map<string, number>
  onTicketToggle: (ticket: Ticket, quantity: number) => void
}

const ticketTypeIcons: Record<string, any> = {
  train: Train,
  flight: Plane,
  bus: Bus,
  entry_pass: MapPin,
  attraction_pass: MapPin,
}

export function TicketSelector({ destination, selectedTickets, onTicketToggle }: Props) {
  const [tickets, setTickets] = useState<Record<string, Ticket[]>>({
    train: [],
    flight: [],
    bus: [],
    entry_pass: [],
    attraction_pass: [],
  })
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState("train")

  useEffect(() => {
    fetchTickets()
  }, [destination])

  async function fetchTickets() {
    setLoading(true)
    try {
      const types = ["train", "flight", "bus", "entry_pass", "attraction_pass"]
      const results: Record<string, Ticket[]> = {}

      for (const type of types) {
        const response = await fetch(`/api/tickets?type=${type}&destination=${encodeURIComponent(destination)}`)
        const data = await response.json()
        results[type] = data.data || []
      }

      setTickets(results)
    } catch (error) {
      console.error("Error fetching tickets:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderTicketList = (type: string) => {
    const typeTickets = tickets[type] || []

    if (loading) return <p className="text-muted-foreground">Loading {type} tickets...</p>

    if (typeTickets.length === 0) {
      return (
        <p className="text-muted-foreground">
          No {type} tickets available for {destination}
        </p>
      )
    }

    return (
      <div className="space-y-3">
        {typeTickets.map((ticket) => {
          const Icon = ticketTypeIcons[type] || MapPin
          const quantity = selectedTickets.get(ticket.id) || 0

          return (
            <Card key={ticket.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={quantity > 0}
                  onCheckedChange={(checked) => {
                    onTicketToggle(ticket, checked ? 1 : 0)
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold text-foreground">{ticket.name}</h4>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {ticket.provider}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                  {ticket.source && ticket.destination && (
                    <p className="text-xs text-muted-foreground mb-2">
                      {ticket.source} → {ticket.destination}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {ticket.benefits.map((benefit, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {ticket.price}
                    </span>
                    {quantity > 0 && (
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => onTicketToggle(ticket, quantity - 1)}>
                          −
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button variant="outline" size="sm" onClick={() => onTicketToggle(ticket, quantity + 1)}>
                          +
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-semibold text-foreground flex items-center gap-2">
        <Calendar className="h-6 w-6" />
        Book Your Tickets
      </h3>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="train">Train</TabsTrigger>
          <TabsTrigger value="flight">Flight</TabsTrigger>
          <TabsTrigger value="bus">Bus</TabsTrigger>
          <TabsTrigger value="entry_pass">Entry</TabsTrigger>
          <TabsTrigger value="attraction_pass">Pass</TabsTrigger>
        </TabsList>
        <TabsContent value="train" className="mt-4">
          {renderTicketList("train")}
        </TabsContent>
        <TabsContent value="flight" className="mt-4">
          {renderTicketList("flight")}
        </TabsContent>
        <TabsContent value="bus" className="mt-4">
          {renderTicketList("bus")}
        </TabsContent>
        <TabsContent value="entry_pass" className="mt-4">
          {renderTicketList("entry_pass")}
        </TabsContent>
        <TabsContent value="attraction_pass" className="mt-4">
          {renderTicketList("attraction_pass")}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TicketSelector
