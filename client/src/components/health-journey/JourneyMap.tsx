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
};

const stages: JourneyStage[] = [
  {
    id: 'diagnose',
    title: 'Diagnose',
    description: 'Comprehensive evaluation and testing',
    status: 'current',
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

export function JourneyMap() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="w-full">
      <div className="max-w-[600px] mx-auto relative">
        <svg
          width="100%"
          height="120"
          viewBox="0 0 600 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved path */}
          <path
            d="M 50,80 Q 150,120 300,60 T 550,80"
            className="stroke-blue-200"
            strokeWidth="4"
            strokeDasharray="8 4"
          />

          {/* Stages positioned along the path */}
          {stages.map((stage, index) => {
            // Calculate position along the curved path
            const progress = index / (stages.length - 1);
            const x = 50 + progress * 500;
            // Calculate y position based on the curve
            const y = 80 + Math.sin(progress * Math.PI) * -20;

            return (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredStage(stage.id)}
                      onMouseLeave={() => setHoveredStage(null)}
                      onClick={() => navigate(stage.link)}
                    >
                      {/* Larger circle with border */}
                      <circle
                        cx={x}
                        cy={y}
                        r="18"
                        className="fill-white stroke-2"
                        stroke={
                          stage.status === 'completed' ? '#22c55e' :
                          stage.status === 'current' ? '#3b82f6' :
                          '#d1d5db'
                        }
                        strokeWidth="2"
                      />

                      {/* Inner colored circle */}
                      <circle
                        cx={x}
                        cy={y}
                        r="14"
                        className={cn(
                          stage.status === 'completed' ? 'fill-green-500' :
                          stage.status === 'current' ? 'fill-blue-500' :
                          'fill-gray-300'
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
                          "fill-gray-700 text-[10px] font-medium",
                          hoveredStage === stage.id && "fill-blue-600 font-bold"
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