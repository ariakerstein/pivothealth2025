import { useCallback } from "react";
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

  return (
    <div className="relative px-4 sm:px-6 py-8 sm:py-12 bg-white/5 backdrop-blur-sm rounded-lg">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {questions.map((question, i) => (
            <div
              key={i}
              className={cn(
                "flex-[0_0_100%] min-w-0 relative px-4",
                "transition-opacity duration-500",
              )}
            >
              <div className="text-center">
                <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90">
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
        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10"
        onClick={scrollNext}
      >
        <ArrowRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
