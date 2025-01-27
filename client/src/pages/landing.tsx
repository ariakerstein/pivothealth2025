import { Button } from "@/components/ui/button";
import { Brain, Beaker, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 lg:px-8">
        <nav className="py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Pivot Health</h1>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-white hover:text-white">Login</Button>
            <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
          </div>
        </nav>

        <div className="py-24 lg:py-32 max-w-4xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">
            Your cancer co-pilot
          </h2>
          <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed">
            Personalized navigation, diagnostics & support for{" "}
            <span className="text-blue-400">your</span> cancer journey.
          </p>
        </div>
      </div>

      {/* How it works Section */}
      <section className="py-24 lg:py-32 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-16">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Navigation & Discovery */}
            <div className="rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm border border-gray-800">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Brain className="h-7 w-7 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Navigation & Discovery</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Ask questions to your medically-trained AI Co-pilot</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Find trusted doctors & services for your care journey</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Get personalized treatment recommendations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Secure medical records management</span>
                </li>
              </ul>
            </div>

            {/* Trusted Diagnostics */}
            <div className="rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm border border-gray-800">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Beaker className="h-7 w-7 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Trusted Diagnostics</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Convenient test ordering with transparent pricing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Expert review of your test results</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Personalized care plans for your situation</span>
                </li>
              </ul>
            </div>

            {/* Support Community */}
            <div className="rounded-2xl bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-8 backdrop-blur-sm border border-gray-800">
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-blue-400" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4">Support Community</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Access community-vetted treatment protocols</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Connect with others on similar journeys</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-400 shrink-0">→</span>
                  <span>Tools for family & caregivers to support you</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}