import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Download } from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  actionItems: string[];
}

export default function Recommendations() {
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ['/api/recommendations'],
  });

  const handleExport = () => {
    // Implementation for exporting recommendations
    const content = recommendations?.map(rec => 
      `${rec.title}\n${rec.description}\n\nAction Items:\n${rec.actionItems.join('\n')}`
    ).join('\n\n');
    
    const blob = new Blob([content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'health-recommendations.txt';
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Your Health Recommendations</h1>
        <Button onClick={handleExport} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <div className="grid gap-6">
        {recommendations?.map((rec) => (
          <Card key={rec.id}>
            <CardHeader>
              <CardTitle>{rec.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{rec.description}</p>
              
              <div>
                <h4 className="font-semibold mb-2">Action Items:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {rec.actionItems.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
