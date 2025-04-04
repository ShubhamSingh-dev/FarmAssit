"use client";

import { useState } from "react";
import { Bot, Send } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth-provider"; // Ensure this exists
import { useRouter } from "next/navigation";

export function AIAssistant() {
  const { user } = useAuth(); // Get authenticated user
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle AI interaction here
    setMessage("");
  };

  // If no user, redirect or show message
  if (!user) {
    return (
      <section className="container py-12 text-center">
        <p className="text-lg text-gray-700">
          🚀 Please{" "}
          <button
            onClick={() => router.push("/login")}
            className="text-green-700 underline hover:text-green-800"
          >
            sign in
          </button>{" "}
          to use the AI Farming Assistant.
        </p>
      </section>
    );
  }

  return (
    <section id="assistant" className="container py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Farming Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] mb-4 rounded-lg border bg-muted p-4 overflow-y-auto">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Bot className="h-6 w-6 flex-shrink-0" />
                <p className="text-sm">
                  Hello! I'm your AI farming assistant. Ask me anything about
                  crops, weather, or farming practices.
                </p>
              </div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[60px]"
            />
            <Button
              type="submit"
              size="icon"
              className="bg-green-700 hover:bg-green-800"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
