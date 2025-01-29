import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Rocket, Shield, Heart, Sparkles } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { QuestionsCarousel } from "@/components/ui/questions-carousel";

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const joinWaitlist = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Welcome aboard!",
        description: "We'll notify you when we launch.",
      });
      setEmail("");
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      joinWaitlist.mutate(email);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Logo className="w-10 h-10" />
            <span className="text-xl font-semibold">Pivot Health</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="ghost" 
              className="text-white hover:text-white hover:bg-white/10"
              onClick={() => setLocation('/auth')}
            >
              Login
            </Button>
          </div>
        </nav>

        <div className="py-24 lg:py-32 space-y-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Your cancer co-pilot
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
              Personalized navigation, diagnostics & support for{" "}
              <span className="text-blue-400">your</span> cancer journey.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 min-w-[180px] font-semibold transition-colors duration-200"
                disabled={joinWaitlist.isPending}
              >
                {joinWaitlist.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "JOIN THE WAITLIST"
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Be the first to know when we launch. We'll never share your email.
            </p>
          </form>

          {/* Questions Carousel */}
          <div className="max-w-4xl mx-auto">
            <QuestionsCarousel />
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center space-y-4">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Rocket className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-xl">Smart Navigation</h4>
                <p className="text-gray-400">
                  AI-powered guidance through your treatment journey, helping you make informed decisions.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-xl">Precision Diagnostics</h4>
                <p className="text-gray-400">
                  Cutting edge diagnostics and world class experts ensure your diagnosis is accurate and complete.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-xl">Community Support</h4>
                <p className="text-gray-400">
                  Connect with mentors, experts, and peers who understand your journey and can provide valuable guidance.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-xl">Care Resources</h4>
                <p className="text-gray-400">
                  Discover products & services to support your care journey, carefully curated for your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}