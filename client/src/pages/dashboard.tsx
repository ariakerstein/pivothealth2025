import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Activity, FileText, Calendar, MessageSquare } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import RiskAssessmentCard from "@/components/risk-assessment/RiskAssessmentCard";

interface ActivityItem {
  id: number;
  type: string;
  description: string;
  timestamp: string;
}

interface EngagementMetrics {
  documentUploads: number;
  testOrders: number;
  chatInteractions: number;
  recommendationsViewed: number;
}

// Sample PSA data (to be replaced with real data from backend)
const psaData = [
  { date: '2024-01-01', psa: 0.8 },
  { date: '2024-01-15', psa: 1.2 },
  { date: '2024-02-01', psa: 0.9 },
  { date: '2024-02-15', psa: 1.1 },
  { date: '2024-03-01', psa: 1.0 },
];

const PSARangeTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const psaValue = payload[0].value;
    const getRange = (value: number) => {
      // Age-based ranges (assuming patient age for this example)
      const age = 55; // This should come from patient data
      if (age < 50) return '0-2.5';
      if (age < 60) return '0-3.5';
      if (age < 70) return '0-4.5';
      return '0-6.5';
    };

    return (
      <div className="bg-white p-2 shadow rounded border">
        <p className="font-medium">Date: {label}</p>
        <p>PSA Level: {psaValue} ng/ml</p>
        <p className="text-sm text-muted-foreground">
          Normal Range: {getRange(psaValue)} ng/ml
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { data: activities, isLoading: loadingActivities } = useQuery<ActivityItem[]>({
    queryKey: ['/api/patient/activities'],
  });

  const { data: metrics, isLoading: loadingMetrics } = useQuery<EngagementMetrics>({
    queryKey: ['/api/patient/engagement-metrics'],
  });

  if (loadingActivities || loadingMetrics) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Patient Dashboard</h1>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.documentUploads}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Orders</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.testOrders}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chat Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.chatInteractions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recommendations</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics?.recommendationsViewed}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* PSA Level Chart */}
        <Card>
          <CardHeader>
            <CardTitle>PSA Levels Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={psaData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString()}
                  />
                  <YAxis
                    domain={[0, 7]}
                    label={{ value: 'PSA (ng/ml)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip content={<PSARangeTooltip />} />

                  {/* Reference lines for normal ranges */}
                  <ReferenceLine y={2.5} stroke="#22c55e" strokeDasharray="3 3" label="Age 40-49 Max" />
                  <ReferenceLine y={3.5} stroke="#eab308" strokeDasharray="3 3" label="Age 50-59 Max" />
                  <ReferenceLine y={4.5} stroke="#f97316" strokeDasharray="3 3" label="Age 60-69 Max" />
                  <ReferenceLine y={6.5} stroke="#ef4444" strokeDasharray="3 3" label="Age 70+ Max" />

                  <Line
                    type="monotone"
                    dataKey="psa"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment */}
        <RiskAssessmentCard />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {activities?.map((activity) => (
              <div key={activity.id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}