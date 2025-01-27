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
import LandingPage from "@/pages/landing";
import AuthPage from "@/pages/auth-page";
import { useUser } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType }) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!user) {
    window.location.href = '/auth';
    return null;
  }

  return (
    <>
      <Navbar />
      <Component {...rest} />
    </>
  );
}

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/auth" component={AuthPage} />

        {/* Protected routes */}
        <Route path="/home" component={() => <ProtectedRoute component={Home} />} />
        <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
        <Route path="/chat" component={() => <ProtectedRoute component={Chat} />} />
        <Route path="/recommendations" component={() => <ProtectedRoute component={Recommendations} />} />
        <Route path="/tests" component={() => <ProtectedRoute component={Tests} />} />
        <Route path="/documents" component={() => <ProtectedRoute component={Documents} />} />
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