import { useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { cn } from "@/lib/utils";

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
              <p className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                {question}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}