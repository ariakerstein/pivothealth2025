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
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            Pivot Health
          </span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your personalized healthcare journey starts here. Let's begin by understanding your health needs.
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
          <Card className="p-6">
            <div className="flex items-center justify-center mb-4">
              <svg
                width="64"
                height="64"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-blue-500"
              >
                <path
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 8v16M8 16h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-center text-muted-foreground">
              Pivot Health provides you with personalized healthcare support, AI-powered assistance, and easy access to diagnostic services.
            </p>
          </Card>

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