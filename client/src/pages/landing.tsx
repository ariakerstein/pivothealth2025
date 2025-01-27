import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
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
    </div>
  );
}