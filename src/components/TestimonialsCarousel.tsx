import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  service: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Amara Johnson",
    location: "Limbe, Cameroon",
    avatar: "AJ",
    rating: 5,
    text: "ChopTym delivered my lunch in 45 minutes. The food was hot, fresh, and exactly what I ordered. Their WhatsApp updates kept me in the loop every step of the way. Definitely my go-to service now!",
    service: "Food Delivery",
  },
  {
    id: 2,
    name: "Benjamin Fru",
    location: "Limbe, Cameroon",
    avatar: "BF",
    rating: 5,
    text: "Needed urgent document delivery across town. ChopTym picked it up within 30 minutes and delivered safely. Professional, reliable, and affordable. I recommend them to everyone.",
    service: "Document Delivery",
  },
  {
    id: 3,
    name: "Fatima Hassan",
    location: "Limbe, Cameroon",
    avatar: "FH",
    rating: 5,
    text: "As someone who travels often, ChopTym's errand service is a lifesaver. They handle my shopping and bill payments while I'm away. The riders are courteous and efficient.",
    service: "Personal Errands",
  },
  {
    id: 4,
    name: "David Okafor",
    location: "Douala, Cameroon",
    avatar: "DO",
    rating: 5,
    text: "Sent a parcel from Douala to Limbe. ChopTym coordinated everything smoothly with real-time tracking. Fast and secure. Best delivery service I've used in Cameroon.",
    service: "Package Delivery",
  },
  {
    id: 5,
    name: "Grace Mbah",
    location: "Limbe, Cameroon",
    avatar: "GM",
    rating: 5,
    text: "Love the ease of contacting them on WhatsApp. No complicated apps, just simple messaging and instant help. ChopTym gets it done right. Highly satisfied!",
    service: "General Services",
  },
];

export const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-16" aria-labelledby="testimonials-heading">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl font-bold font-heading mb-4"
          >
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground">
            Real stories from satisfied ChopTym users across Limbe and Cameroon.
          </p>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-border/50 bg-card">
                <CardContent className="p-8">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: currentTestimonial.rating }).map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          aria-hidden="true"
                        />
                      )
                    )}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-foreground mb-6 leading-relaxed italic">
                    "{currentTestimonial.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {currentTestimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {currentTestimonial.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {currentTestimonial.location}
                      </p>
                      <p className="text-xs text-primary font-medium">
                        {currentTestimonial.service}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              aria-label="Previous testimonial"
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            {/* Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex
                      ? 'bg-primary'
                      : 'bg-muted-foreground/30'
                  }`}
                  aria-current={index === currentIndex ? 'true' : 'false'}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              aria-label="Next testimonial"
              className="gap-2"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          </div>

          {/* Counter */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {currentIndex + 1} of {testimonials.length}
          </p>
        </div>
      </div>
    </section>
  );
};
