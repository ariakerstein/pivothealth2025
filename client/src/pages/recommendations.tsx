import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  Loader2,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Flame,
  CalendarPlus,
  MessageSquare,
  Stethoscope,
  ClipboardList,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import AchievementCard from "@/components/achievements/AchievementCard";
import { JourneyMap } from "@/components/health-journey/JourneyMap";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  actionItems: string[];
  status: string;
  supportingData?: {
    type: string;
    value: number;
    context: string;
  }[];
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  progress: number;
  isUnlocked: boolean;
}

export default function Recommendations() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations/active'],
  });

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/recommendations/generate', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate recommendations');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/active'] });
      toast({
        title: "Recommendations Generated",
        description: "New health recommendations have been generated based on your latest data.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate recommendations.",
        variant: "destructive",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const response = await fetch(`/api/recommendations/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update recommendation status');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/recommendations/active'] });
    },
  });

  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: streak } = useQuery<{ currentStreak: number }>({
    queryKey: ['/api/streak'],
  });

  const handleExport = () => {
    const content = recommendations?.map(rec =>
      `${rec.title}\n${rec.description}\n\nCategory: ${rec.category}\nPriority: ${rec.priority}\n\nAction Items:\n${rec.actionItems.join('\n')}`
    ).join('\n\n---\n\n');

    const blob = new Blob([content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health-recommendations.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  const getActionButton = (recommendation: Recommendation) => {
    const category = recommendation.category.toLowerCase();

    switch (category) {
      case 'screening':
        return (
          <Button 
            onClick={() => navigate('/tests')} 
            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          >
            <Stethoscope className="mr-2 h-4 w-4" />
            Schedule Screening Test
          </Button>
        );
      case 'lifestyle':
        return (
          <Button 
            onClick={() => navigate('/chat')} 
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Chat with Health Coach
          </Button>
        );
      case 'prevention':
        return (
          <Button 
            onClick={() => navigate('/tests')} 
            className="w-full mt-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            View Prevention Plan
          </Button>
        );
      default:
        return (
          <Button 
            onClick={() => navigate('/chat')} 
            className="w-full mt-4 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
          >
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Appointment
          </Button>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Your Progress</h2>
          {streak?.currentStreak ? (
            <div className="flex items-center gap-2 text-orange-600">
              <Flame className="h-5 w-5" />
              <span className="font-semibold">{streak.currentStreak} Day Streak!</span>
            </div>
          ) : null}
        </div>

        {/* Add Journey Map */}
        <div className="mb-8">
          <JourneyMap />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements?.slice(0, 3).map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              streak={achievement.category === "streak" ? streak?.currentStreak : undefined}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Health Recommendations</h1>
        <div className="space-x-2">
          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
          >
            {generateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Generate New
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {recommendations?.map((rec) => (
          <Card key={rec.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle>{rec.title}</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{rec.category}</Badge>
                    <Badge className={getPriorityColor(rec.priority)}>
                      {rec.priority} Priority
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => statusMutation.mutate({
                    id: rec.id,
                    status: rec.status === 'active' ? 'completed' : 'active'
                  })}
                >
                  {rec.status === 'completed' ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Mark Complete
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>

              {rec.supportingData && rec.supportingData.length > 0 && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <h4 className="font-semibold mb-2">Supporting Data:</h4>
                  <ul className="space-y-2">
                    {rec.supportingData.map((data, i) => (
                      <li key={i} className="flex items-center text-sm">
                        <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                        {data.type}: {data.value} - {data.context}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Action Items:</h4>
                <ul className="space-y-2">
                  {rec.actionItems.map((item, i) => (
                    <li key={i} className="flex items-center text-sm">
                      <ArrowRight className="mr-2 h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {rec.status !== 'completed' && getActionButton(rec)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}