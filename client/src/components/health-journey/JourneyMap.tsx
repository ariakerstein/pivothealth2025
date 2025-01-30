import React, { useState } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type JourneyStage = {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
  link: string;
  onAction?: () => void;
};

interface JourneyMapProps {
  onIntakeClick?: () => void;
}

const stages: (onIntakeClick?: () => void) => JourneyStage[] = (onIntakeClick) => [
  {
    id: 'intake',
    title: 'Intake',
    description: 'Complete your health profile',
    status: 'current',
    link: '#',
    onAction: onIntakeClick
  },
  {
    id: 'diagnose',
    title: 'Diagnose',
    description: 'Comprehensive evaluation and testing',
    status: 'upcoming',
    link: '/tests'
  },
  {
    id: 'decide',
    title: 'Decide',
    description: 'Review options and create treatment plan',
    status: 'upcoming',
    link: '/chat'
  },
  {
    id: 'connect',
    title: 'Connect',
    description: 'Connect with healthcare providers and support network',
    status: 'upcoming',
    link: '/community'
  },
  {
    id: 'treat',
    title: 'Treat',
    description: 'Active treatment and monitoring',
    status: 'upcoming',
    link: '/documents'
  },
  {
    id: 'discover',
    title: 'Discover',
    description: 'Explore resources and lifestyle improvements',
    status: 'upcoming',
    link: '/recommendations'
  }
];

export function JourneyMap({ onIntakeClick }: JourneyMapProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [, navigate] = useLocation();

  const handleStageClick = (stage: JourneyStage) => {
    if (stage.onAction) {
      stage.onAction();
    } else {
      navigate(stage.link);
    }
  };

  const currentStages = stages(onIntakeClick);

  return (
    <div className="w-full py-8">
      <div className="max-w-[600px] mx-auto relative">
        <svg
          width="100%"
          height="200"
          viewBox="0 0 600 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          {/* More pronounced S-shaped path that trends upward */}
          <path
            d="M 50,150 C 150,175 250,75 300,100 S 450,25 550,50"
            className="stroke-blue-200"
            strokeWidth="4"
            strokeDasharray="8 4"
            fill="none"
          />

          {/* Stages positioned along the path */}
          {currentStages.map((stage, index) => {
            // Calculate position along the curved path
            const progress = index / (currentStages.length - 1);
            const x = 50 + progress * 500;

            // Calculate y position based on the upward-trending S curve
            const y = 150 - progress * 100 + Math.sin(progress * Math.PI * 2) * 50;

            return (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer transform transition-transform hover:scale-105"
                      onMouseEnter={() => setHoveredStage(stage.id)}
                      onMouseLeave={() => setHoveredStage(null)}
                      onClick={() => handleStageClick(stage)}
                    >
                      {/* Larger circle with border */}
                      <circle
                        cx={x}
                        cy={y}
                        r="18"
                        className={cn(
                          "fill-white stroke-2 transition-all duration-200",
                          hoveredStage === stage.id ? "stroke-blue-500" : "stroke-gray-300"
                        )}
                        strokeWidth="2"
                      />

                      {/* Inner colored circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        className={cn(
                          "transition-colors duration-200",
                          hoveredStage === stage.id
                            ? "fill-blue-500"
                            : stage.status === 'completed'
                            ? 'fill-green-500'
                            : 'fill-gray-300'
                        )}
                      />

                      {/* Stage number */}
                      <text
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dy=".3em"
                        className="fill-white text-xs font-bold"
                      >
                        {index + 1}
                      </text>

                      {/* Stage title */}
                      <text
                        x={x}
                        y={y + 28}
                        textAnchor="middle"
                        className={cn(
                          "text-[10px] font-medium transition-colors duration-200",
                          hoveredStage === stage.id
                            ? "fill-blue-600 font-bold"
                            : "fill-gray-700"
                        )}
                      >
                        {stage.title}
                      </text>
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">{stage.title}</p>
                    <p className="text-sm text-gray-500">{stage.description}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </svg>
      </div>
    </div>
  );
}