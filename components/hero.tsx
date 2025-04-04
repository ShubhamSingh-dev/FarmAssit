"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Search } from "lucide-react";

export function Hero() {
  const [isListening, setIsListening] = React.useState(false);

  const startVoiceSearch = () => {
    setIsListening(true);
    // Implement voice search logic
  };

  return (
    <section
      id="hero"
      className="relative flex h-[100vh] items-center justify-center"
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://plus.unsplash.com/premium_photo-1667520084376-472f06c21406?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Your Smart Farming <br />
            Companion
          </h1>
          <p className="mx-auto mb-8 max-w-[600px] text-xl text-white/90">
            Get instant access to weather updates, NGO support, and AI-powered
            farming advice
          </p>

          <div className="mx-auto flex max-w-2xl flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Input
                placeholder="Search for crops, schemes, or ask questions..."
                className="h-12 w-full border-white/20 bg-white/10 pl-12 pr-4 text-white placeholder:text-white/70 backdrop-blur-md"
              />
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/70" />
            </div>
            <Button
              size="lg"
              onClick={startVoiceSearch}
              variant="secondary"
              className={`h-12 px-6 transition-colors ${
                isListening
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Mic
                className={`h-5 w-5 ${isListening ? "animate-pulse" : ""}`}
              />
              <span className="ml-2 hidden sm:inline">Voice Search</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
