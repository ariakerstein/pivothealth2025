import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./button";

const questions = [
  "What tests should I get?",
  "What should I know at this point in my journey that I don't know?",
  "Is there someone who looks just like me but is a few years ahead of me in dealing with my condition?",
  "What questions should I be asking my doctor?",
  "What services are there to address the needs I'm identifying?"
];

export function QuestionsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: true,
    align: "center",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Auto-scroll setup
  useEffect(() => {
    if (emblaApi) {
      const autoplay = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000); // Change slide every 4 seconds

      return () => clearInterval(autoplay);
    }
  }, [emblaApi]);

  return (
    <div className="relative px-4 sm:px-6 py-12 sm:py-16 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-600/10 backdrop-blur-lg rounded-xl border border-white/10">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {questions.map((question, i) => (
            <div
              key={i}
              className={cn(
                "flex-[0_0_100%] min-w-0 relative px-4",
                "animate-fade-in transition-all duration-500 ease-in-out",
              )}
            >
              <div className="text-center">
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                  {question}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
        onClick={scrollNext}
      >
        <ArrowRight className="h-6 w-6" />
      </Button>
    </div>
  );
}