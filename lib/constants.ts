import { Cloud, Sun } from "lucide-react"
import type { MarketData, NGO, Testimonial, WeatherDay } from "@/lib/types"

export const MARKET_DATA: MarketData[] = [
  { crop: "Rice", price: "₹2,400", change: "+120", trend: "up" },
  { crop: "Wheat", price: "₹2,100", change: "-80", trend: "down" },
  { crop: "Cotton", price: "₹6,500", change: "+250", trend: "up" },
  { crop: "Sugarcane", price: "₹3,200", change: "+90", trend: "up" },
  { crop: "Pulses", price: "₹4,800", change: "-150", trend: "down" },
]

export const WEATHER_DAYS: WeatherDay[] = [
  { day: "Today", temp: 28, icon: Sun, weather: "Sunny" },
  { day: "Mon", temp: 27, icon: Cloud, weather: "Cloudy" },
  { day: "Tue", temp: 29, icon: Sun, weather: "Sunny" },
  { day: "Wed", temp: 26, icon: Cloud, weather: "Rain" },
  { day: "Thu", temp: 25, icon: Cloud, weather: "Cloudy" },
  { day: "Fri", temp: 27, icon: Sun, weather: "Sunny" },
  { day: "Sat", temp: 28, icon: Sun, weather: "Sunny" },
]

export const NGOS: NGO[] = [
  {
    id: "1",
    name: "Rural Development Trust",
    distance: "2.5 km",
    status: "Open now",
    description: "Supporting sustainable farming practices",
    phone: "911234567890",
  },
  {
    id: "2",
    name: "Farmers Foundation",
    distance: "4.1 km",
    status: "Open now",
    description: "Agricultural training and resources",
    phone: "911234567891",
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Organic Farmer",
    location: "Punjab",
    image: "/placeholder.svg",
    content:
      "FarmAssist has revolutionized the way I manage my farm. The weather alerts are incredibly accurate, and the AI assistant has helped me make better decisions about crop management.",
    rating: 5,
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    role: "Small-scale Farmer",
    location: "Karnataka",
    image: "/placeholder.svg",
    content:
      "The NGO connection feature helped me get support when I needed it most. The local language support makes it easy to use. Highly recommended!",
    rating: 5,
  },
  {
    id: 3,
    name: "Anand Patel",
    role: "Agricultural Entrepreneur",
    location: "Gujarat",
    image: "/placeholder.svg",
    content:
      "The market price updates and weather forecasts have helped me maximize my profits. This app is a game-changer for modern farming.",
    rating: 4,
  },
]

export const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "te", name: "తెలుగు" },
  { code: "ta", name: "தமிழ்" },
  { code: "kn", name: "ಕನ್ನಡ" },
] as const

