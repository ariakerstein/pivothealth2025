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
    <div className="w-full overflow-x-auto p-8">
      <div className="min-w-[800px] relative">
        <svg
          width="100%"
          height="300"
          viewBox="0 0 800 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transform scale-100 transition-transform duration-300"
        >
          {/* More curved winding path */}
          <path
            d="M 50,150 
               C 150,50 250,250 350,150 
               S 550,50 650,150 
               S 750,250 750,150"
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
            const y = 150 + Math.sin(progress * Math.PI * 2) * 50;

            return (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer transform transition-transform duration-200 hover:scale-110"
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
                          "transition-colors duration-200",
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