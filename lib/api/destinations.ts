import { getPlacesByCity } from "./places"
import { getWeatherData } from "./weather"

export interface Destination {
  id: string
  name: string
  state: string
  region: string
  description: string
  averageBudgetPerDay: number
  imageUrl: string
  bestTimeToVisit: string
  averageFootfall: string
  weather?: {
    temperature: number
    condition: string
  }
}

const GEOAPIFY_API_KEY = process.env.GEOAPIFY_API_KEY || ""

// Major Indian tourist destinations with detailed information
const INDIAN_DESTINATIONS = [
  {
    name: "Delhi",
    state: "Delhi",
    region: "North",
    budget: 2500,
    description:
      "India's capital city, a vibrant blend of ancient history and modern culture. Home to iconic monuments like Red Fort, Qutub Minar, and India Gate.",
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    region: "North",
    budget: 2000,
    description:
      "The Pink City, famous for its stunning palaces, forts, and vibrant bazaars. Must-visit attractions include Amber Fort, City Palace, and Hawa Mahal.",
  },
  {
    name: "Agra",
    state: "Uttar Pradesh",
    region: "North",
    budget: 1800,
    description:
      "Home to the magnificent Taj Mahal, one of the Seven Wonders of the World. Also features Agra Fort and Fatehpur Sikri.",
  },
  {
    name: "Amritsar",
    state: "Punjab",
    region: "North",
    budget: 1500,
    description:
      "Spiritual center of Sikhism, home to the Golden Temple. Experience rich Punjabi culture, history, and delicious cuisine.",
  },
  {
    name: "Shimla",
    state: "Himachal Pradesh",
    region: "North",
    budget: 2200,
    description:
      "Queen of Hill Stations, offering stunning mountain views, colonial architecture, and pleasant weather year-round.",
  },
  {
    name: "Bangalore",
    state: "Karnataka",
    region: "South",
    budget: 2500,
    description:
      "India's Silicon Valley, known for its pleasant climate, gardens, and thriving tech culture. Features Lalbagh Botanical Garden and Bangalore Palace.",
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    region: "South",
    budget: 2000,
    description:
      "Gateway to South India, rich in culture and heritage. Famous for Marina Beach, temples, and classical arts.",
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    region: "South",
    budget: 2200,
    description:
      "City of Pearls, known for its rich history, biryani, and IT industry. Visit Charminar, Golconda Fort, and Ramoji Film City.",
  },
  {
    name: "Kochi",
    state: "Kerala",
    region: "South",
    budget: 2000,
    description: "Queen of Arabian Sea, a beautiful port city with colonial heritage, backwaters, and spice markets.",
  },
  {
    name: "Mysore",
    state: "Karnataka",
    region: "South",
    budget: 1800,
    description:
      "City of Palaces, famous for Mysore Palace, silk sarees, and sandalwood. Known for its royal heritage and yoga.",
  },
  {
    name: "Mumbai",
    state: "Maharashtra",
    region: "West",
    budget: 3500,
    description:
      "India's financial capital and Bollywood hub. Experience Gateway of India, Marine Drive, and vibrant nightlife.",
  },
  {
    name: "Goa",
    state: "Goa",
    region: "West",
    budget: 2500,
    description: "Beach paradise with Portuguese heritage, stunning coastline, water sports, and vibrant nightlife.",
  },
  {
    name: "Pune",
    state: "Maharashtra",
    region: "West",
    budget: 2000,
    description:
      "Oxford of the East, known for educational institutions, IT industry, and pleasant weather. Rich in Maratha history.",
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    region: "West",
    budget: 1800,
    description:
      "UNESCO World Heritage City, known for textile industry, Sabarmati Ashram, and vibrant street food culture.",
  },
  {
    name: "Udaipur",
    state: "Rajasthan",
    region: "West",
    budget: 2200,
    description:
      "City of Lakes, featuring stunning palaces, romantic boat rides, and breathtaking sunset views over Lake Pichola.",
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    region: "East",
    budget: 2000,
    description:
      "Cultural capital of India, known for literature, art, and colonial architecture. Home to Victoria Memorial and Howrah Bridge.",
  },
  {
    name: "Bhubaneswar",
    state: "Odisha",
    region: "East",
    budget: 1800,
    description: "Temple City of India, featuring ancient temples, caves, and rich Odishan culture and cuisine.",
  },
  {
    name: "Darjeeling",
    state: "West Bengal",
    region: "East",
    budget: 2200,
    description: "Queen of the Hills, famous for tea gardens, toy train, and stunning views of Kanchenjunga mountain.",
  },
  {
    name: "Puri",
    state: "Odisha",
    region: "East",
    budget: 1500,
    description:
      "Sacred coastal city, home to Jagannath Temple and beautiful beaches. Important pilgrimage destination.",
  },
  {
    name: "Guwahati",
    state: "Assam",
    region: "Northeast",
    budget: 2000,
    description: "Gateway to Northeast India, known for Kamakhya Temple, Brahmaputra River, and Assamese culture.",
  },
  {
    name: "Shillong",
    state: "Meghalaya",
    region: "Northeast",
    budget: 2200,
    description:
      "Scotland of the East, featuring rolling hills, waterfalls, and pleasant climate. Known for music and natural beauty.",
  },
  {
    name: "Gangtok",
    state: "Sikkim",
    region: "Northeast",
    budget: 2500,
    description: "Himalayan paradise with stunning mountain views, Buddhist monasteries, and adventure activities.",
  },
  {
    name: "Bhopal",
    state: "Madhya Pradesh",
    region: "Central",
    budget: 1800,
    description: "City of Lakes, known for its natural beauty, museums, and proximity to Sanchi Stupa.",
  },
  {
    name: "Indore",
    state: "Madhya Pradesh",
    region: "Central",
    budget: 1800,
    description: "Cleanest city of India, famous for street food, Rajwada Palace, and vibrant markets.",
  },
  {
    name: "Nagpur",
    state: "Maharashtra",
    region: "Central",
    budget: 1800,
    description: "Orange City, known for its oranges, tiger reserves, and central location in India.",
  },
]

const BEST_TIME_MAP: Record<string, string> = {
  North: "October to March",
  South: "November to February",
  West: "November to February",
  East: "October to March",
  Northeast: "October to April",
  Central: "October to March",
}

const FOOTFALL_MAP: Record<string, string> = {
  Delhi: "Very High",
  Mumbai: "Very High",
  Bangalore: "High",
  Jaipur: "High",
  Goa: "Very High",
  Agra: "Very High",
  Kolkata: "High",
  Chennai: "High",
  Hyderabad: "High",
  Kochi: "Medium",
  Shimla: "High",
  Udaipur: "High",
  Amritsar: "High",
  Mysore: "Medium",
  Pune: "High",
  Ahmedabad: "Medium",
  Bhubaneswar: "Medium",
  Darjeeling: "High",
  Puri: "High",
  Guwahati: "Medium",
  Shillong: "Medium",
  Gangtok: "Medium",
  Bhopal: "Low",
  Indore: "Medium",
  Nagpur: "Low",
}

function createDestination(destination: (typeof INDIAN_DESTINATIONS)[0]): Destination {
  return {
    id: `${destination.name.toLowerCase()}-${destination.region.toLowerCase()}`,
    name: destination.name,
    state: destination.state,
    region: destination.region,
    description: destination.description,
    averageBudgetPerDay: destination.budget,
    imageUrl: `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(destination.name + " India tourist destination")}`,
    bestTimeToVisit: BEST_TIME_MAP[destination.region] || "October to March",
    averageFootfall: FOOTFALL_MAP[destination.name] || "Medium",
  }
}

export async function getAllDestinations(): Promise<Destination[]> {
  return INDIAN_DESTINATIONS.map(createDestination)
}

export async function getDestinationById(id: string): Promise<Destination | null> {
  const destinations = await getAllDestinations()
  return destinations.find((d) => d.id === id) || null
}

export async function getDestinationWithDetails(cityName: string) {
  try {
    const [places, weather] = await Promise.all([getPlacesByCity(cityName), getWeatherData(cityName).catch(() => null)])

    return {
      places,
      weather,
    }
  } catch (error) {
    console.error("Error fetching destination details:", error)
    return {
      places: [],
      weather: null,
    }
  }
}
