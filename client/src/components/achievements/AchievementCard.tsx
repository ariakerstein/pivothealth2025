import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Medal, Trophy, Star, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  isUnlocked: boolean;
}

interface Props {
  achievement: Achievement;
  streak?: number;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Medal,
  Trophy,
  Star,
  Flame,
};

export default function AchievementCard({ achievement, streak }: Props) {
  const Icon = iconMap[achievement.icon] || Trophy;

  return (
    <Card className={cn(
      "transition-all duration-300",
      achievement.isUnlocked ? "bg-gradient-to-br from-yellow-50 to-orange-50" : "opacity-75"
    )}>
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-full",
            achievement.isUnlocked ? "bg-yellow-100" : "bg-muted"
          )}>
            <Icon className={cn(
              "h-6 w-6",
              achievement.isUnlocked ? "text-yellow-600" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <CardTitle className="text-base">{achievement.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{achievement.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={achievement.progress} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress: {achievement.progress}%</span>
            {streak && (
              <span className="flex items-center gap-1">
                <Flame className="h-4 w-4 text-orange-500" />
                {streak} day streak
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
