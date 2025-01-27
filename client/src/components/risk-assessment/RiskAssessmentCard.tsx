import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";

interface RiskFactors {
  age: number;
  psaLevel: number;
  familyHistory: boolean;
  previousBiopsies: number;
  otherConditions: string[];
}

interface RiskAssessment {
  id: number;
  assessmentDate: string;
  riskFactors: RiskFactors;
  riskScore: number;
  notes: string;
}

export default function RiskAssessmentCard() {
  const [riskFactors, setRiskFactors] = useState<RiskFactors>({
    age: 50,
    psaLevel: 0,
    familyHistory: false,
    previousBiopsies: 0,
    otherConditions: [],
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: latestAssessment, isLoading } = useQuery<RiskAssessment>({
    queryKey: ['/api/risk-assessment/latest'],
  });

  const assessmentMutation = useMutation({
    mutationFn: async (factors: RiskFactors) => {
      const response = await fetch('/api/risk-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factors),
      });

      if (!response.ok) {
        throw new Error('Failed to submit assessment');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/risk-assessment/latest'] });
      toast({
        title: "Risk Assessment Updated",
        description: "Your risk assessment has been calculated and saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update risk assessment.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    assessmentMutation.mutate(riskFactors);
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "High", color: "text-red-500", icon: AlertTriangle };
    if (score >= 60) return { level: "Elevated", color: "text-orange-500", icon: AlertCircle };
    if (score >= 40) return { level: "Moderate", color: "text-yellow-500", icon: AlertCircle };
    return { level: "Low", color: "text-green-500", icon: CheckCircle2 };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Current Risk Score Display */}
          {latestAssessment && (
            <div className="rounded-lg bg-background p-6 border">
              <div className="flex items-center gap-4">
                {(() => {
                  const { level, color, icon: Icon } = getRiskLevel(latestAssessment.riskScore);
                  return (
                    <>
                      <Icon className={`h-8 w-8 ${color}`} />
                      <div>
                        <h3 className="font-semibold text-lg">
                          {level} Risk Level
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Score: {latestAssessment.riskScore}/100
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {latestAssessment.notes}
              </p>
            </div>
          )}

          {/* Risk Assessment Form */}
          <div className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  value={riskFactors.age}
                  onChange={(e) => setRiskFactors(prev => ({
                    ...prev,
                    age: parseInt(e.target.value)
                  }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="psaLevel">PSA Level (ng/ml)</Label>
                <Input
                  id="psaLevel"
                  type="number"
                  step="0.1"
                  value={riskFactors.psaLevel}
                  onChange={(e) => setRiskFactors(prev => ({
                    ...prev,
                    psaLevel: parseFloat(e.target.value)
                  }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="familyHistory">Family History of Cancer</Label>
                <Switch
                  id="familyHistory"
                  checked={riskFactors.familyHistory}
                  onCheckedChange={(checked) => setRiskFactors(prev => ({
                    ...prev,
                    familyHistory: checked
                  }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="previousBiopsies">Number of Previous Biopsies</Label>
                <Select
                  value={riskFactors.previousBiopsies.toString()}
                  onValueChange={(value) => setRiskFactors(prev => ({
                    ...prev,
                    previousBiopsies: parseInt(value)
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[0, 1, 2, 3, 4, "5+"].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Other Risk Factors</Label>
                <Select
                  value=""
                  onValueChange={(value) => setRiskFactors(prev => ({
                    ...prev,
                    otherConditions: [...prev.otherConditions, value]
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select conditions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="obesity">Obesity</SelectItem>
                    <SelectItem value="smoking">Smoking</SelectItem>
                    <SelectItem value="diabetes">Diabetes</SelectItem>
                    <SelectItem value="hypertension">Hypertension</SelectItem>
                  </SelectContent>
                </Select>
                {riskFactors.otherConditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {riskFactors.otherConditions.map((condition) => (
                      <div
                        key={condition}
                        className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-2"
                      >
                        {condition}
                        <button
                          onClick={() => setRiskFactors(prev => ({
                            ...prev,
                            otherConditions: prev.otherConditions.filter(c => c !== condition)
                          }))}
                          className="hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={assessmentMutation.isPending}
            >
              Calculate Risk Score
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
