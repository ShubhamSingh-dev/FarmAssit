export type Language = "en" | "hi" | "te" | "ta" | "kn"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface MarketData {
  crop: string
  price: string
  change: string
  trend: "up" | "down"
}

export interface WeatherDay {
  day: string
  temp: number
  weather: string
  icon: any
}

export interface NGO {
  id: string
  name: string
  distance: string
  status: string
  description: string
  phone: string
}

export interface Testimonial {
  id: number
  name: string
  role: string
  location: string
  image: string
  content: string
  rating: number
}

