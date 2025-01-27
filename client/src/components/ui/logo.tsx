import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("text-primary", className)}
      width="32"
      height="32"
    >
      {/* Outer circle */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="currentColor"
        strokeWidth="2"
        className="text-blue-500"
      />

      {/* Inner circles */}
      <circle
        cx="50"
        cy="50"
        r="35"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="4 4"
        className="text-blue-400"
      />

      {/* Heartbeat line */}
      <path
        d="M30 50 L40 50 L45 35 L55 65 L60 50 L70 50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-600"
      />

      {/* Dots */}
      <circle cx="20" cy="50" r="3" fill="currentColor" className="text-blue-400" />
      <circle cx="80" cy="50" r="3" fill="currentColor" className="text-blue-400" />
      <circle cx="50" cy="20" r="3" fill="currentColor" className="text-blue-400" />
      <circle cx="50" cy="80" r="3" fill="currentColor" className="text-blue-400" />
    </svg>
  );
}