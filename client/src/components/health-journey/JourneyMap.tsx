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
    id: 'intake',
    title: 'Intake',
    description: 'Initial consultation and information gathering',
    status: 'completed',
    link: '/onboarding'
  },
  {
    id: 'diagnosis',
    title: 'Diagnosis',
    description: 'Comprehensive evaluation and testing',
    status: 'current',
    link: '/tests'
  },
  {
    id: 'treatment-decision',
    title: 'Treatment Decision',
    description: 'Reviewing options and creating a treatment plan',
    status: 'upcoming',
    link: '/chat'
  },
  {
    id: 'treatment',
    title: 'Treatment',
    description: 'Actively undergoing chosen treatment',
    status: 'upcoming',
    link: '/documents'
  },
  {
    id: 'monitor',
    title: 'Monitoring',
    description: 'Regular check-ups and progress tracking',
    status: 'upcoming',
    link: '/dashboard'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Enhancement',
    description: 'Maintaining health and wellness practices',
    status: 'upcoming',
    link: '/recommendations'
  }
];

export function JourneyMap() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [, navigate] = useLocation();

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px] relative">
        <svg
          width="100%"
          height="200"
          viewBox="0 0 800 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* More interesting curved path with waves */}
          <path
            d="M 50,100 
               C 150,150 200,50 300,100 
               S 450,150 550,100 
               S 700,50 750,100"
            className="stroke-blue-200"
            strokeWidth="40"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stages positioned along the path */}
          {stages.map((stage, index) => {
            // Calculate position along the curved path
            const progress = index / (stages.length - 1);
            const x = 50 + progress * 700;
            // Add vertical variation based on the progress
            const y = 100 + Math.sin(progress * Math.PI * 2) * 30;

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
                      {/* Circle background */}
                      <circle
                        cx={x}
                        cy={y}
                        r="20"
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
                        className="fill-white text-sm font-bold"
                      >
                        {index + 1}
                      </text>

                      {/* Stage title */}
                      <text
                        x={x}
                        y={y + 35}
                        textAnchor="middle"
                        className={cn(
                          "fill-gray-700 text-xs font-medium",
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