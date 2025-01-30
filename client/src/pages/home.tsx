import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Upload, FileText, Heart, UserCog } from "lucide-react";
import { JourneyMap } from "@/components/health-journey/JourneyMap";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function Home() {
  const { toast } = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);

  const { data: patientProfile } = useQuery({
    queryKey: ['/api/patient/profile'],
  });

  const { data: recommendations } = useQuery<any[]>({
    queryKey: ['/api/recommendations/active'],
  });

  const { data: documents } = useQuery<any[]>({
    queryKey: ['/api/documents'],
  });

  const needsOnboarding = !patientProfile;

  return (
    <div className="container mx-auto py-8 px-4">
      {needsOnboarding ? (
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
      ) : (
        <>
          <section className="mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-tight">Your Health Journey</h2>
              <Button 
                variant="outline" 
                onClick={() => setShowOnboarding(true)}
                className="gap-2"
              >
                <UserCog className="h-4 w-4" />
                Edit Health Information
              </Button>
            </div>
            <JourneyMap />
          </section>

          <div className="grid lg:grid-cols-2 gap-8">
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

          {/* Edit Health Information Dialog */}
          <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
            <DialogContent className="max-w-4xl">
              <OnboardingForm onComplete={() => {
                setShowOnboarding(false);
                toast({
                  title: "Profile Updated",
                  description: "Your health information has been updated successfully."
                });
              }} />
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}