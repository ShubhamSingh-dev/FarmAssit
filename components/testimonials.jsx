"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Plus } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Testimonials() {
  const containerRef = useRef(null);
  const [testimonials, setTestimonials] = useState([]);
  const [newTestimonial, setNewTestimonial] = useState({
    name: "",
    role: "",
    location: "",
    image: "/placeholder.svg",
    content: "",
    rating: 5,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "testimonials"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const testimonialsData = [];
      querySnapshot.forEach((doc) => {
        testimonialsData.push({ id: doc.id, ...doc.data() });
      });
      setTestimonials(testimonialsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTestimonial = async () => {
    try {
      await addDoc(collection(db, "testimonials"), {
        ...newTestimonial,
        createdAt: new Date(),
      });
      setNewTestimonial({
        name: "",
        role: "",
        location: "",
        image: "/placeholder.svg",
        content: "",
        rating: 5,
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding testimonial: ", error);
    }
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-12 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
            Loading Testimonials...
          </h2>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-12 bg-muted/50">
      <div className="container">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Trusted by Farmers Across India
          </h2>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Your Testimonial</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="name"
                    placeholder="Your Name"
                    className="col-span-4"
                    value={newTestimonial.name}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="role"
                    placeholder="Your Role (e.g., Farmer)"
                    className="col-span-4"
                    value={newTestimonial.role}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        role: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Input
                    id="location"
                    placeholder="Your Location"
                    className="col-span-4"
                    value={newTestimonial.location}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        location: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Select
                    value={newTestimonial.rating.toString()}
                    onValueChange={(value) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        rating: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger className="col-span-4">
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} Star{num !== 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Textarea
                    id="content"
                    placeholder="Your testimonial"
                    className="col-span-4"
                    value={newTestimonial.content}
                    onChange={(e) =>
                      setNewTestimonial({
                        ...newTestimonial,
                        content: e.target.value,
                      })
                    }
                  />
                </div>
                <Button onClick={handleAddTestimonial}>
                  Submit Testimonial
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div
          ref={containerRef}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto px-4"
        >
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="relative overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Image
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
