import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

const questions = [
  "\"I need to understand what tests I should get at this stage...\"",
  "\"What are the important things I should know about my journey that I might be missing?\"",
  "\"I wish I could connect with someone who has been through exactly what I'm going through...\"",
  "\"What questions should I be asking my doctor that I haven't thought of?\"",
  "\"How do I find the right services to address my specific needs?\""
];

export function QuestionsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    dragFree: true,
    align: "center",
  });

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
              <p className="text-xl sm:text-2xl lg:text-3xl font-medium italic bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}