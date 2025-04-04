import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Cloud, Building2, LineChart, ArrowRight } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Find NGOs",
    description: "Locate and connect with nearby agricultural NGOs",
    icon: MapPin,
    color: "text-green-600",
    bg: "bg-green-100",
    href: "#map",
  },
  {
    title: "Weather Alerts",
    description: "Get real-time weather updates and forecasts",
    icon: Cloud,
    color: "text-blue-600",
    bg: "bg-blue-100",
    href: "#weather",
  },
  {
    title: "Government Schemes",
    description: "Latest agricultural schemes and subsidies",
    icon: Building2,
    color: "text-purple-600",
    bg: "bg-purple-100",
    href: "/schemes",
  },
  {
    title: "Market Prices",
    description: "Check current crop prices in your area",
    icon: LineChart,
    color: "text-orange-600",
    bg: "bg-orange-100",
    href: "#prices",
  },
];

export function QuickActions() {
  return (
    <section className="container py-12">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => (
          <Link key={action.title} href={action.href}>
            <Card className="h-full transition-transform hover:scale-[1.02] group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    style={{
                      backgroundColor: `hsl(var(--${action.bg.replace(
                        "bg-",
                        ""
                      )}))`,
                      color: `hsl(var(--${action.color.replace("text-", "")}))`,
                    }}
                    className="w-12 h-12 rounded-lg flex items-center justify-center border p-2"
                  >
                    <action.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold flex items-center gap-2">
                    {action.title}
                    <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
