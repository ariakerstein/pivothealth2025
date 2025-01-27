import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import Recommendations from "@/pages/recommendations";
import Tests from "@/pages/tests";
import Documents from "@/pages/documents";
import Dashboard from "@/pages/dashboard";
import Navbar from "@/components/layout/Navbar";
import LandingPage from "@/pages/landing";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={LandingPage} />
        {/* Protected routes */}
        <Route path="/home" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/chat" component={Chat} />
        <Route path="/recommendations" component={Recommendations} />
        <Route path="/tests" component={Tests} />
        <Route path="/documents" component={Documents} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;