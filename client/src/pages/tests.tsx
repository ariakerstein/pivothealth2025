import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, Beaker, Activity, FileText, Stethoscope } from "lucide-react";
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
}

const categories = [
  { id: "all", label: "All Services" },
  { id: "diagnostic", label: "Diagnostic Tests", icon: Beaker },
  { id: "monitoring", label: "Health Monitoring", icon: Activity },
  { id: "reports", label: "Medical Reports", icon: FileText },
  { id: "consultation", label: "Expert Consultation", icon: Stethoscope },
];

export default function DiscoverPage() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
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

  const filteredServices = services?.filter(
    service => activeCategory === "all" || service.category === activeCategory
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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

      <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
        <TabsList>
          {categories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon && <category.icon className="h-4 w-4" />}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory} className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices?.map((service) => (
              <Card 
                key={service.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedService(service)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {service.name}
                  </CardTitle>
                  <CardDescription>
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">
                      ${(service.price / 100).toFixed(2)}
                    </span>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedService?.name}</DialogTitle>
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
              <span className="font-semibold">
                Price: ${(selectedService?.price ?? 0 / 100).toFixed(2)}
              </span>
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