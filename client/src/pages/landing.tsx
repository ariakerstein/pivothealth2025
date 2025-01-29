import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Rocket, Shield, Heart } from "lucide-react";

// Simple SVG logo component
const Logo = () => (
  <svg
    width="120"
    height="32"
    viewBox="0 0 120 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-white"
  >
    <path
      d="M12 8C8.13401 8 5 11.134 5 15C5 18.866 8.13401 22 12 22H20C23.866 22 27 18.866 27 15C27 11.134 23.866 8 20 8H12Z"
      className="fill-blue-500"
    />
    <path
      d="M35 15C35 11.134 38.134 8 42 8H50C53.866 8 57 11.134 57 15C57 18.866 53.866 22 50 22H42C38.134 22 35 18.866 35 15Z"
      className="fill-blue-400"
    />
    <text
      x="70"
      y="20"
      className="fill-current font-bold text-lg"
    >
      Pivot
    </text>
  </svg>
);

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
          <Logo />
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
          {/* Hero Section */}
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
              Your cancer co-pilot
            </h2>
            <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed">
              Personalized navigation, diagnostics & support for{" "}
              <span className="text-blue-400">your</span> cancer journey.
            </p>

            {/* Email Collection Form */}
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
                  className="bg-blue-600 hover:bg-blue-700 min-w-[180px]"
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
          </div>

          {/* How it Works Section */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-2xl font-semibold text-center mb-12">
              How It Works
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
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
                <h4 className="font-semibold text-xl">Secure Integration</h4>
                <p className="text-gray-400">
                  Seamlessly connect with your healthcare providers and medical records.
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="bg-blue-600/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <Heart className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="font-semibold text-xl">Community Support</h4>
                <p className="text-gray-400">
                  Connect with mentors and peers who understand your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}