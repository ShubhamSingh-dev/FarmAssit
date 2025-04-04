"use client";

import { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Navigation } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};
const defaultCenter = { lat: 23.0225, lng: 72.5714 }; // Default: India center
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function MapSection() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  useEffect(() => {
    if (location) {
      fetchNearbyNGOs(location);
    }
  }, [location]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const fetchNearbyNGOs = (location) => {
    // Dummy data for now (Replace with API call)
    const dummyPlaces = [
      {
        id: 1,
        name: "Rural Development Trust",
        lat: location.lat + 0.01,
        lng: location.lng + 0.01,
      },
      {
        id: 2,
        name: "Farmers Foundation",
        lat: location.lat - 0.01,
        lng: location.lng - 0.01,
      },
    ];
    setPlaces(dummyPlaces);
  };

  const openWhatsApp = (phone) => {
    window.open(`https://wa.me/${phone}`, "_blank");
  };

  return (
    <section id="map" className="container py-12">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Nearby NGOs</h2>
            <p className="text-muted-foreground">
              Find and connect with agricultural support organizations
            </p>
          </div>
          <Button onClick={detectLocation} className="gap-2">
            <Navigation className="w-4 h-4" /> Detect Location
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <Card className="h-[500px] flex items-center justify-center bg-muted">
            <LoadScript googleMapsApiKey={googleMapsApiKey}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={location || defaultCenter}
                zoom={location ? 14 : 5}
              >
                {location && <Marker position={location} label="You" />}
                {places.map((place) => (
                  <Marker
                    key={place.id}
                    position={{ lat: place.lat, lng: place.lng }}
                    onClick={() => setSelectedPlace(place)}
                  />
                ))}
                {selectedPlace && (
                  <InfoWindow
                    position={{
                      lat: selectedPlace.lat,
                      lng: selectedPlace.lng,
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div>
                      <h3 className="font-bold">{selectedPlace.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Click for details
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </LoadScript>
          </Card>

          <div className="space-y-4">
            {places.map((place, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{place.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Nearby Agricultural NGO
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => openWhatsApp("911234567890")}
                      className="flex-1"
                      variant="default"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" /> Contact
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Navigation className="w-4 h-4 mr-2" /> Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
