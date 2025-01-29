import React, { useState, useEffect } from "react";
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
};

const stages: JourneyStage[] = [
  {
    id: 'intake',
    title: 'Intake',
    description: 'Initial consultation and information gathering',
    status: 'completed'
  },
  {
    id: 'diagnosis',
    title: 'Diagnosis',
    description: 'Comprehensive evaluation and testing',
    status: 'current'
  },
  {
    id: 'treatment-decision',
    title: 'Treatment Decision',
    description: 'Reviewing options and creating a treatment plan',
    status: 'upcoming'
  },
  {
    id: 'treatment',
    title: 'Treatment',
    description: 'Actively undergoing chosen treatment',
    status: 'upcoming'
  },
  {
    id: 'monitor',
    title: 'Monitoring',
    description: 'Regular check-ups and progress tracking',
    status: 'upcoming'
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle Enhancement',
    description: 'Maintaining health and wellness practices',
    status: 'upcoming'
  }
];

export function JourneyMap() {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);

  return (
    <div className="w-full overflow-x-auto p-8">
      <div className="min-w-[800px] h-[400px] relative">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Winding path */}
          <path
            d="M 50,200 
               C 150,200 200,100 300,100 
               S 450,200 550,200 
               S 700,300 750,300"
            className="stroke-blue-200"
            strokeWidth="40"
            strokeLinecap="round"
            fill="none"
          />

          {/* Stages positioned along the path */}
          {stages.map((stage, index) => {
            const x = 50 + (700 * index) / (stages.length - 1);
            const y = 200 + Math.sin((index * Math.PI) / 2) * 100;

            return (
              <TooltipProvider key={stage.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <g
                      className="cursor-pointer transform transition-transform hover:scale-110"
                      onMouseEnter={() => setHoveredStage(stage.id)}
                      onMouseLeave={() => setHoveredStage(null)}
                    >
                      {/* Circle background */}
                      <circle
                        cx={x}
                        cy={y}
                        r="25"
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
                        y={y + 40}
                        textAnchor="middle"
                        className={cn(
                          "fill-gray-700 text-xs font-medium",
                          hoveredStage === stage.id && "fill-blue-600"
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