import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  CheckCircle2, 
  ChevronRight, 
  Hospital, 
  KeyRound, 
  ShieldCheck 
} from "lucide-react";

interface WizardStep {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const WIZARD_STEPS: WizardStep[] = [
  {
    title: "Select Healthcare Provider",
    description: "Choose your healthcare provider that uses EPIC EHR system",
    icon: <Hospital className="h-6 w-6" />,
  },
  {
    title: "Provider Details",
    description: "Enter your provider's EPIC system details",
    icon: <Building2 className="h-6 w-6" />,
  },
  {
    title: "Authentication",
    description: "Securely authenticate with your provider's EPIC system",
    icon: <KeyRound className="h-6 w-6" />,
  },
  {
    title: "Review & Consent",
    description: "Review the connection details and provide consent",
    icon: <ShieldCheck className="h-6 w-6" />,
  },
];

interface Props {
  onClose: () => void;
}

export default function EHRWizard({ onClose }: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [provider, setProvider] = useState("");
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Handle final submission
      toast({
        title: "Integration Started",
        description: "We're setting up your EPIC EHR integration. You'll be notified once it's complete.",
      });
      onClose();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <Select value={provider} onValueChange={setProvider}>
              <SelectTrigger>
                <SelectValue placeholder="Select your healthcare provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ucsf">UCSF Medical Center</SelectItem>
                <SelectItem value="stanford">Stanford Health Care</SelectItem>
                <SelectItem value="kaiser">Kaiser Permanente</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {provider === "other" && (
              <Input 
                placeholder="Enter your provider's name" 
                className="mt-2"
              />
            )}
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <Input placeholder="EPIC System URL" />
            <Input placeholder="Organization ID" />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Input placeholder="Username/Email" />
            <Input type="password" placeholder="Password" />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">Data Access Consent</h4>
              <p className="text-sm text-muted-foreground">
                By proceeding, you agree to allow Pivot Health to:
              </p>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Access your medical records
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Import your health documents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Sync future records automatically
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {WIZARD_STEPS[currentStep].icon}
          {WIZARD_STEPS[currentStep].title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          {WIZARD_STEPS[currentStep].description}
        </p>

        {renderStepContent()}

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            onClick={handleNext}
            disabled={currentStep === 0 && !provider}
          >
            {currentStep === WIZARD_STEPS.length - 1 ? (
              "Complete Setup"
            ) : (
              <>
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Step indicators */}
        <div className="flex justify-center gap-2">
          {WIZARD_STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentStep
                  ? "bg-primary"
                  : index < currentStep
                  ? "bg-primary/60"
                  : "bg-border"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
