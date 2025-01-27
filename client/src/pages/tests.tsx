import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Test {
  id: number;
  name: string;
  description: string;
  price: number;
  preparationSteps: string[];
}

export default function Tests() {
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const { data: tests, isLoading } = useQuery<Test[]>({
    queryKey: ['/api/tests'],
  });

  const orderMutation = useMutation({
    mutationFn: (testId: number) => 
      fetch('/api/tests/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testId }),
      }).then(res => res.json()),
    onSuccess: () => {
      toast({
        title: "Test Ordered Successfully",
        description: "You will receive further instructions via email.",
      });
      setSelectedTest(null);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Available Diagnostic Tests</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {tests?.map((test) => (
          <Card key={test.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedTest(test)}>
            <CardHeader>
              <CardTitle>{test.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{test.description}</p>
              <p className="mt-4 font-semibold">${test.price.toFixed(2)}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTest?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>{selectedTest?.description}</p>
            
            <div>
              <h4 className="font-semibold mb-2">Preparation Steps:</h4>
              <ul className="list-disc list-inside space-y-1">
                {selectedTest?.preparationSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <p className="font-semibold">Price: ${selectedTest?.price.toFixed(2)}</p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTest(null)}>
              Cancel
            </Button>
            <Button 
              onClick={() => selectedTest && orderMutation.mutate(selectedTest.id)}
              disabled={orderMutation.isPending}
            >
              {orderMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Confirm Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
