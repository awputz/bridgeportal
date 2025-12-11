import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  title: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "Bridge Advisory Group transformed our approach to commercial real estate. Their market expertise and dedication to our success exceeded all expectations.",
    author: "Michael Chen",
    title: "Managing Director",
    company: "Apex Capital Partners",
  },
  {
    id: 2,
    quote: "The team's deep understanding of NYC markets and their commitment to finding the perfect property made our acquisition seamless and stress-free.",
    author: "Sarah Williams",
    title: "CEO",
    company: "Manhattan Holdings LLC",
  },
  {
    id: 3,
    quote: "Working with Bridge was a game-changer. Their strategic insights and professional approach helped us maximize our investment returns.",
    author: "David Rodriguez",
    title: "Principal",
    company: "Brooklyn Development Group",
  },
  {
    id: 4,
    quote: "Exceptional service from start to finish. Bridge Advisory Group delivered results that far surpassed our initial projections.",
    author: "Jennifer Park",
    title: "Vice President",
    company: "Emerald Real Estate Ventures",
  },
];

export const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="section-spacing bg-secondary/30">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-tight">What Our Clients Say</h2>
          <p className="text-muted-foreground/80 font-light">Trusted by leading investors and property owners across New York</p>
        </div>

        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Testimonial Card */}
          <div className="glass-card p-8 md:p-12 relative overflow-hidden min-h-[280px] border border-white/5">
            <Quote className="absolute top-6 left-6 h-10 w-10 text-accent/10" />
            
            <div className="relative z-10">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "absolute inset-0 p-8 md:p-12 transition-all duration-500 flex flex-col justify-center",
                    index === currentIndex 
                      ? "opacity-100 translate-x-0" 
                      : index < currentIndex 
                        ? "opacity-0 -translate-x-8" 
                        : "opacity-0 translate-x-8"
                  )}
                >
                  <blockquote className="text-lg md:text-xl font-light leading-relaxed mb-6 text-foreground/90 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="mt-auto">
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.title}, {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-10 h-10 rounded-full glass-button flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-10 h-10 rounded-full glass-button flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "bg-foreground w-6" 
                  : "bg-foreground/30 hover:bg-foreground/50"
              )}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
