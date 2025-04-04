import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { MapSection } from "@/components/map-section";
// import { WeatherAlerts } from "@/components/weather-alerts";
import { WeatherDashboard } from "@/components/weather-dashboard";
import { AIAssistant } from "@/components/ai-assistant";
import { Testimonials } from "@/components/testimonials";
import { MarketPrices } from "@/components/market-prices";
import { Footer } from "@/components/footer";
import { FloatingChat } from "@/components/floating-chat";
import { QuickActions } from "@/components/quick-actions";
export default function Home() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <QuickActions />
        <WeatherDashboard />

        <MapSection />
        <MarketPrices />
        <Testimonials />
        <AIAssistant />
      </main>
      <FloatingChat />
      <Footer />
    </div>
  );
}
