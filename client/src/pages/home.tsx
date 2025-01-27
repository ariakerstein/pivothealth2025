import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import OnboardingForm from "@/components/onboarding/OnboardingForm";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();

  return (
    <div className="space-y-8">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Your Health Journey Starts Here
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Welcome to your personalized healthcare platform. Let's begin by understanding your health needs.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Patient Onboarding</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingForm onComplete={() => {
              toast({
                title: "Onboarding Complete",
                description: "Your health profile has been saved successfully."
              });
            }} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
            alt="Medical professional"
            className="rounded-lg w-full aspect-video object-cover"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Link href="/chat">
              <Button className="w-full" variant="outline">Chat with AI</Button>
            </Link>
            <Link href="/tests">
              <Button className="w-full">Order Tests</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
