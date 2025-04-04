"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowDown, ArrowUp } from "lucide-react"

const marketData = [
  { crop: "Rice", price: "₹2,400", change: "+120", trend: "up" },
  { crop: "Wheat", price: "₹2,100", change: "-80", trend: "down" },
  { crop: "Cotton", price: "₹6,500", change: "+250", trend: "up" },
  { crop: "Sugarcane", price: "₹3,200", change: "+90", trend: "up" },
  { crop: "Pulses", price: "₹4,800", change: "-150", trend: "down" },
]

export function MarketPrices() {
  return (
    <section id="prices" className="container py-12">
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Market Prices</h2>
          <p className="text-muted-foreground">Latest agricultural commodity prices</p>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle>Current Market Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Crop</TableHead>
                  <TableHead>Price (per quintal)</TableHead>
                  <TableHead>24h Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {marketData.map((item) => (
                  <TableRow key={item.crop}>
                    <TableCell className="font-medium">{item.crop}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell className="flex items-center gap-1">
                      {item.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span className={item.trend === "up" ? "text-green-500" : "text-red-500"}>{item.change}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

