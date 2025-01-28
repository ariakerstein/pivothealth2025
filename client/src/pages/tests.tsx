import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Beaker, Activity, FileText, Stethoscope, CheckCircle2, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  preparationSteps?: string[];
  insuranceCoverage: boolean;
}

const categories = [
  { id: "recommended", label: "Recommended for You" },
  { id: "all", label: "All Services" },
  { id: "diagnostic", label: "Diagnostic Tests", icon: Beaker },
  { id: "monitoring", label: "Health Monitoring", icon: Activity },
  { id: "reports", label: "Medical Reports", icon: FileText },
  { id: "consultation", label: "Expert Consultation", icon: Stethoscope },
];

// Mock function to determine if a service is recommended
// In a real app, this would use patient data and AI/ML models
function isRecommendedService(service: Service): boolean {
  const recommendedServices = ['PSA Blood Test', 'Tumor Marker Panel', 'Expert Oncology Consultation'];
  return recommendedServices.includes(service.name);
}

export default function DiscoverPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState("recommended");
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({
    queryKey: ['/api/tests'],
  });

  const orderMutation = useMutation({
    mutationFn: (serviceId: number) =>
      fetch('/api/tests/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId: serviceId }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Service Requested Successfully",
        description: "You will receive further instructions via email.",
      });
      setSelectedService(null);
    },
  });

  const filteredServices = services?.filter(service => {
    if (activeCategory === "recommended") {
      return isRecommendedService(service);
    }
    return activeCategory === "all" || service.category === activeCategory;
  });

  const recommendedServices = services?.filter(isRecommendedService);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const ServiceCard = ({ service }: { service: Service }) => (
    <Card
      key={service.id}
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => setSelectedService(service)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {service.name}
          {service.insuranceCoverage ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
        <CardDescription>
          {service.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">
              ${(service.price / 100).toFixed(2)}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              {service.insuranceCoverage ? '(Covered by Insurance)' : '(Self-Pay)'}
            </span>
          </div>
          <Button variant="outline" size="sm">
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Discover Health Services</h1>
          <p className="text-muted-foreground mt-2">
            Find the right services for your healthcare journey
          </p>
        </div>
      </div>

      <Tabs defaultValue="recommended" className="mb-8" onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon && <category.icon className="h-4 w-4" />}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          {activeCategory === "recommended" && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-2">Personalized Recommendations</h3>
              <p className="text-sm text-muted-foreground">
                Based on your health profile and recent activity, we recommend these services for your continued care.
              </p>
            </div>
          )}

          {activeCategory === "all" && recommendedServices && recommendedServices.length > 0 && (
            <div className="mb-12 relative">
              <div className="absolute -left-4 -right-4 top-0 bottom-0 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/50 rounded-lg -z-10" />
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold">Recommended for You</h3>
                <p className="text-sm text-muted-foreground">
                  Services tailored to your current health journey
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <div className="border-b border-border/50 my-12" />
              <div className="text-xl font-semibold mb-6">All Available Services</div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices?.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedService?.name}
              {selectedService?.insuranceCoverage ? (
                <div className="flex items-center text-sm text-green-500">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Covered by Insurance
                </div>
              ) : (
                <div className="flex items-center text-sm text-red-500">
                  <XCircle className="h-4 w-4 mr-1" />
                  Self-Pay
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p>{selectedService?.description}</p>

            {selectedService?.preparationSteps && (
              <div>
                <h4 className="font-semibold mb-2">Preparation Instructions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {selectedService.preparationSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <span className="font-semibold">
                  Price: ${((selectedService?.price ?? 0) / 100).toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {selectedService?.insuranceCoverage ? '(Covered by Insurance)' : '(Self-Pay)'}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedService(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => selectedService && orderMutation.mutate(selectedService.id)}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Request Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}