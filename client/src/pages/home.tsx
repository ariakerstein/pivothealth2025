import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText, Heart } from "lucide-react";
import { JourneyMap } from "@/components/health-journey/JourneyMap";

export default function Home() {
  const { toast } = useToast();

  const { data: recommendations } = useQuery<any[]>({
    queryKey: ['/api/recommendations/active'],
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ['/api/documents'],
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Your Health Journey</h2>
        <JourneyMap />
      </section>

      <section className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Pivot Health
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your personalized healthcare journey starts here. Let's work together to provide you with the best possible care.
        </p>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Help us understand your health needs better by providing some basic information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OnboardingForm onComplete={() => {
              toast({
                title: "Profile Updated",
                description: "Your health profile has been saved successfully."
              });
            }} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Document Management
            </CardTitle>
            <CardDescription>
              Securely upload and manage your medical documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Recent Documents ({documents?.length || 0})
              </p>
              {documents && documents.length > 0 ? (
                <ul className="space-y-2">
                  {documents.slice(0, 3).map((doc: any) => (
                    <li key={doc.id} className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm truncate">{doc.filename}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No documents uploaded yet
                </p>
              )}
            </div>
            <Link href="/documents">
              <Button className="w-full">
                Manage Documents
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Care Recommendations
            </CardTitle>
            <CardDescription>
              Personalized recommendations based on your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-2">
                Active Recommendations ({recommendations?.length || 0})
              </p>
              {recommendations && recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {recommendations.slice(0, 3).map((rec: any) => (
                    <li key={rec.id} className="text-sm">
                      • {rec.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Complete your profile to receive personalized recommendations
                </p>
              )}
            </div>
            <Link href="/recommendations">
              <Button className="w-full" variant="outline">
                View All Recommendations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}