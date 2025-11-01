export interface IndianState {
  id: string
  name: string
  code: string
  region: string
  image: string
  description: string
  popularCities: string[]
}

export const INDIAN_STATES: IndianState[] = [
  {
    id: "rajasthan",
    name: "Rajasthan",
    code: "RJ",
    region: "North",
    image: "/rajasthan-hawa-mahal-jaipur.jpg",
    description: "Land of Kings with magnificent forts and palaces",
    popularCities: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer", "Pushkar"],
  },
  {
    id: "kerala",
    name: "Kerala",
    code: "KL",
    region: "South",
    image: "/kerala-backwaters-houseboat.jpg",
    description: "God's Own Country with serene backwaters",
    popularCities: ["Kochi", "Munnar", "Alleppey", "Kovalam", "Wayanad"],
  },
  {
    id: "goa",
    name: "Goa",
    code: "GA",
    region: "West",
    image: "/goa-beaches-sunset.jpg",
    description: "Beach paradise with Portuguese heritage",
    popularCities: ["Panaji", "Calangute", "Baga", "Anjuna", "Palolem"],
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    code: "MH",
    region: "West",
    image: "/mumbai-gateway-of-india.jpg",
    description: "Financial capital with diverse attractions",
    popularCities: ["Mumbai", "Pune", "Aurangabad", "Lonavala", "Mahabaleshwar"],
  },
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    code: "TN",
    region: "South",
    image: "/tamil-nadu-meenakshi-temple.jpg",
    description: "Temple state with rich cultural heritage",
    popularCities: ["Chennai", "Madurai", "Ooty", "Kodaikanal", "Rameswaram"],
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    code: "UP",
    region: "North",
    image: "/taj-mahal-agra.jpg",
    description: "Home to the iconic Taj Mahal",
    popularCities: ["Agra", "Varanasi", "Lucknow", "Mathura", "Ayodhya"],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    code: "KA",
    region: "South",
    image: "/mysore-palace-karnataka.jpg",
    description: "Garden city with tech hub and heritage",
    popularCities: ["Bangalore", "Mysore", "Hampi", "Coorg", "Gokarna"],
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    code: "WB",
    region: "East",
    image: "/kolkata-victoria-memorial.jpg",
    description: "Cultural capital with colonial architecture",
    popularCities: ["Kolkata", "Darjeeling", "Kalimpong", "Sundarbans", "Digha"],
  },
  {
    id: "himachal-pradesh",
    name: "Himachal Pradesh",
    code: "HP",
    region: "North",
    image: "/himachal-pradesh-mountains-manali.jpg",
    description: "Mountain paradise with scenic beauty",
    popularCities: ["Shimla", "Manali", "Dharamshala", "Kasol", "Dalhousie"],
  },
  {
    id: "uttarakhand",
    name: "Uttarakhand",
    code: "UK",
    region: "North",
    image: "/uttarakhand-rishikesh-ganges.jpg",
    description: "Land of Gods with spiritual destinations",
    popularCities: ["Rishikesh", "Haridwar", "Nainital", "Mussoorie", "Dehradun"],
  },
]

export function getStateById(id: string): IndianState | undefined {
  return INDIAN_STATES.find((state) => state.id === id)
}

export function getStateByName(name: string): IndianState | undefined {
  return INDIAN_STATES.find((state) => state.name.toLowerCase() === name.toLowerCase())
}
