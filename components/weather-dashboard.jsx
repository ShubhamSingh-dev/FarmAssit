"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, Droplets, Sun, ThermometerSun, Wind } from "lucide-react";
require("dotenv").config();

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

export function WeatherDashboard() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unit, setUnit] = useState("celsius");

  // Fetch weather data based on user's location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
          );
          const data = await response.json();

          if (data.cod !== 200) {
            throw new Error(data.message || "Failed to fetch weather data");
          }

          setWeather(data);
          setLoading(false);
        } catch (error) {
          setError(error.message);
          setLoading(false);
        }
      },
      (error) => {
        setError("Unable to retrieve your location.");
        setLoading(false);
      }
    );
  }, []);

  // Convert temperature based on selected unit
  const convertTemperature = (temp) => {
    if (unit === "fahrenheit") {
      return Math.round((temp * 9) / 5 + 32);
    }
    return Math.round(temp);
  };

  return (
    <section id="weather" className="container py-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">
              Weather Forecast
            </h2>
            <p className="text-muted-foreground">
              7-day weather forecast for your location
            </p>
          </div>
          {/* Celsius to Fahrenheit Tabs */}
          <Tabs
            defaultValue="celsius"
            onValueChange={(value) => setUnit(value)}
          >
            <TabsList className="flex">
              <TabsTrigger value="celsius">°C</TabsTrigger>
              <TabsTrigger value="fahrenheit">°F</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Weather Cards */}
        <div className="flex flex-col gap-4">
          {/* Current Weather Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Weather
              </CardTitle>
              <ThermometerSun className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : error ? (
                <p className="text-muted-foreground">{error}</p>
              ) : weather ? (
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-4xl font-bold">
                      {convertTemperature(weather.main.temp)}°
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Feels like {convertTemperature(weather.main.feels_like)}°
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Wind className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{weather.wind.speed} km/h</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {weather.main.humidity}% humidity
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No weather data available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Rainfall Chance and UV Index Cards */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  Rainfall Chance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {weather?.rain ? `${weather.rain["1h"]}%` : "0%"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {weather?.rain ? "Rain expected" : "No rain expected"}
                </p>
              </CardContent>
            </Card>

            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="text-sm font-medium">UV Index</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">High</div>
                <p className="text-xs text-muted-foreground">
                  Use sun protection
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Weekly Forecast */}
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Card
              key={index}
              className="flex-1 min-w-[120px] max-w-[150px] text-center"
            >
              <CardContent className="p-3">
                <p className="text-sm font-medium mb-2">
                  {new Date(Date.now() + index * 86400000).toLocaleDateString(
                    "en-US",
                    { weekday: "short" }
                  )}
                </p>
                <Sun className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-lg font-bold">
                  {weather
                    ? convertTemperature(weather.main.temp + index)
                    : "N/A"}
                  °
                </p>
                <p className="text-xs text-muted-foreground">Sunny</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weather Alert */}
        <Alert>
          <AlertTitle className="text-orange-600 text-xl">
            Weather Alert
          </AlertTitle>
          <AlertDescription
            className="text-md"
            style={{ color: "var(--alert-text-color)" }}
          >
            {weather?.weather?.[0]?.description
              ? `Current condition: ${weather.weather[0].description}`
              : "High temperatures expected this week. Ensure proper irrigation for your crops."}
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
}
