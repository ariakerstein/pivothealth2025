import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle2, 
  ChevronRight, 
  Hospital, 
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
    description: "Choose your healthcare provider to access your medical records",
    icon: <Hospital className="h-6 w-6" />,
  },
  {
    title: "Review & Consent",
    description: "Review what information will be shared",
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
        title: "Connecting to Provider",
        description: "You'll be redirected to your provider's login page.",
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
                <SelectItem value="dana-farber">Dana-Farber Cancer Institute</SelectItem>
                <SelectItem value="mskcc">Memorial Sloan Kettering</SelectItem>
                <SelectItem value="mdanderson">MD Anderson Cancer Center</SelectItem>
                <SelectItem value="other">Other Provider</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              Note: Currently using EPIC sandbox for testing. Your actual medical records will not be accessed.
            </p>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="font-medium mb-2">What You're Agreeing To</h4>
              <p className="text-sm text-muted-foreground mb-4">
                By connecting your medical records, you'll allow Pivot Health to:
              </p>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  View your medical records and test results
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Download important health documents
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  Keep your health information up to date automatically
                </li>
              </ul>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>Your privacy is important:</p>
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  <li>We never share your data without your permission</li>
                  <li>You can disconnect at any time</li>
                  <li>All data is encrypted and secure</li>
                </ul>
              </div>
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
              "Connect to Provider"
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