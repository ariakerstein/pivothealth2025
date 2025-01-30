import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TypeFormQuestionProps {
  question: string;
  description?: string;
  children: React.ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
  progress: number;
  currentStep?: number;
  totalSteps?: number;
}

export function TypeFormQuestion({
  question,
  description,
  children,
  onNext,
  onPrev,
  isFirst,
  isLast,
  progress,
  currentStep = 1,
  totalSteps = 6,
}: TypeFormQuestionProps) {
  return (
    <div className="typeform-container">
      <div className="typeform-progress relative">
        <motion.div 
          className="typeform-progress-bar"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
        <div className="typeform-step-count">
          Step {currentStep}/{totalSteps}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="typeform-question"
        >
          <motion.h2 
            className="text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {question}
          </motion.h2>

          {description && (
            <motion.p 
              className="text-lg text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <div className="typeform-navigation">
        {!isFirst && (
          <Button
            variant="outline"
            size="lg"
            onClick={onPrev}
            className={cn(
              "gap-2",
              isFirst && "opacity-50 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>
        )}

        {!isLast && (
          <Button
            size="lg"
            onClick={onNext}
            className="gap-2"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}