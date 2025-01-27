import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Brain, Flask, Send } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-semibold mb-4">
            Pivot Health
          </h1>
          <h2 className="text-4xl font-semibold mb-6">
            Your cancer co-pilot
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Personalized navigation, diagnostics & support for <span className="underline">your</span> cancer journey.
          </p>
          
          <div className="flex gap-4 max-w-md">
            <Input 
              type="email" 
              placeholder="Email" 
              className="bg-gray-900 border-gray-800"
            />
            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8"
            >
              JOIN THE WAITLIST
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <section className="bg-black py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-16">
            How it works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            {/* Navigation & Discovery */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="mb-4">
                <Brain className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Navigation & Discovery</h3>
              <ul className="space-y-4">
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Ask questions to your medically-trained, always available AI Co-pilot
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Find high trust doctors, products & services relevant to each step in your care journey.
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Tailored recommendations support your treatment decisions.
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Secure records sharing and storage.
                </li>
              </ul>
            </Card>

            {/* Trusted Diagnostics */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="mb-4">
                <Flask className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted Diagnostics</h3>
              <ul className="space-y-4">
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  We'll order the right tests, with clear pricing, at the most convenient location (many at home).
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Review test results with a team of experts deeply familiar with your diagnosis.
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Decide your best next steps with personalized, holistic care plans tailored to your unique situation.
                </li>
              </ul>
            </Card>

            {/* Support Community */}
            <Card className="bg-gray-900 border-gray-800 p-6">
              <div className="mb-4">
                <Send className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Support Community</h3>
              <ul className="space-y-4">
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Leverage the wisdom of crowds with community-vetted protocols.
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Connect with a support network of patients that have already traveled the road you're on.
                </li>
                <li className="flex gap-2 text-gray-400">
                  <span className="text-blue-500">→</span>
                  Empower your own network (family, loved ones) with tools to help them best support you.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
