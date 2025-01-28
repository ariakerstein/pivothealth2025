import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  // Demographics
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.string(),
  gender: z.enum(["male", "female", "other"]),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  insuranceProvider: z.string(),
  insuranceNumber: z.string(),

  // Medical History
  previousConditions: z.string(),
  surgeryHistory: z.string(),
  currentMedications: z.string(),
  allergies: z.string(),

  // Cancer Specific
  cancerType: z.string(),
  cancerStage: z.string(),
  diagnosisDate: z.string(),
  biopsyResults: z.string().optional(),
  previousTreatments: z.string(),
  currentTreatmentPlan: z.string(),

  // Symptoms
  painLevel: z.enum(["none", "mild", "moderate", "severe"]),
  painLocation: z.string().optional(),
  fatigue: z.enum(["none", "mild", "moderate", "severe"]),
  weightChanges: z.boolean(),
  weightChangeAmount: z.string().optional(),
  otherSymptoms: z.string(),

  // Family History
  familyCancerHistory: z.string(),
  geneticTesting: z.boolean(),
  geneticTestingDetails: z.string().optional(),

  // Lifestyle
  smokingStatus: z.enum(["never", "former", "current"]),
  alcoholConsumption: z.enum(["none", "occasional", "moderate", "heavy"]),
  exerciseFrequency: z.enum(["none", "light", "moderate", "frequent"]),
  dietaryRestrictions: z.string(),

  // Psychosocial & Goals
  emotionalState: z.enum(["well", "mild_distress", "moderate_distress", "severe_distress"]),
  supportSystem: z.string(),
  workConcerns: z.string(),
  treatmentGoals: z.string(),
  primaryConcerns: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface OnboardingFormProps {
  onComplete: () => void;
}

const FORM_STEPS = [
  {
    title: "Personal Information",
    description: "Basic demographic and contact information",
    fields: ["name", "dateOfBirth", "gender", "email", "phone", "insuranceProvider", "insuranceNumber"],
  },
  {
    title: "Medical History",
    description: "Previous conditions and current medications",
    fields: ["previousConditions", "surgeryHistory", "currentMedications", "allergies"],
  },
  {
    title: "Cancer Details",
    description: "Specific information about your cancer diagnosis",
    fields: ["cancerType", "cancerStage", "diagnosisDate", "biopsyResults", "previousTreatments", "currentTreatmentPlan"],
  },
  {
    title: "Symptoms & Well-being",
    description: "Current symptoms and their severity",
    fields: ["painLevel", "painLocation", "fatigue", "weightChanges", "weightChangeAmount", "otherSymptoms"],
  },
  {
    title: "Family & Lifestyle",
    description: "Family history and lifestyle factors",
    fields: ["familyCancerHistory", "geneticTesting", "geneticTestingDetails", "smokingStatus", "alcoholConsumption", "exerciseFrequency", "dietaryRestrictions"],
  },
  {
    title: "Support & Goals",
    description: "Your support system and treatment goals",
    fields: ["emotionalState", "supportSystem", "workConcerns", "treatmentGoals", "primaryConcerns"],
  },
];

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [step, setStep] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      dateOfBirth: "",
      gender: "male",
      email: "",
      phone: "",
      insuranceProvider: "",
      insuranceNumber: "",
      previousConditions: "",
      surgeryHistory: "",
      currentMedications: "",
      allergies: "",
      cancerType: "",
      cancerStage: "",
      diagnosisDate: "",
      biopsyResults: "",
      previousTreatments: "",
      currentTreatmentPlan: "",
      painLevel: "none",
      painLocation: "",
      fatigue: "none",
      weightChanges: false,
      weightChangeAmount: "",
      otherSymptoms: "",
      familyCancerHistory: "",
      geneticTesting: false,
      geneticTestingDetails: "",
      smokingStatus: "never",
      alcoholConsumption: "none",
      exerciseFrequency: "none",
      dietaryRestrictions: "",
      emotionalState: "well",
      supportSystem: "",
      workConcerns: "",
      treatmentGoals: "",
      primaryConcerns: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      fetch("/api/patient/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }).then((res) => res.json()),
    onSuccess: onComplete,
  });

  const currentStep = FORM_STEPS[step];

  const nextStep = async () => {
    const fields = currentStep.fields as Array<keyof FormData>;
    const result = await form.trigger(fields);
    if (result) setStep((s) => Math.min(s + 1, FORM_STEPS.length - 1));
  };

  const previousStep = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const progress = ((step + 1) / FORM_STEPS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {step + 1} of {FORM_STEPS.length}</span>
          <span>{currentStep.title}</span>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ScrollArea className="h-[500px] pr-4">
            {step === 0 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">Female</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="previousConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Medical Conditions</FormLabel>
                      <FormDescription>
                        Include any previous cancers and other significant conditions
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="surgeryHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Surgery History</FormLabel>
                      <FormDescription>
                        List any previous surgeries with dates if known
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentMedications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Medications</FormLabel>
                      <FormDescription>
                        Include medication names, dosages, and frequency
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allergies</FormLabel>
                      <FormDescription>
                        List any allergies to medications, foods, or other substances
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="cancerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Cancer</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cancerStage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cancer Stage</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosisDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Diagnosis</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="biopsyResults"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Biopsy Results</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="previousTreatments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous Cancer Treatments</FormLabel>
                      <FormDescription>
                        Include any surgeries, radiation, or chemotherapy
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentTreatmentPlan"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Treatment Plan</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="painLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["none", "mild", "moderate", "severe"].map((level) => (
                            <FormItem key={level} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={level} />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {level}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="painLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pain Location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fatigue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fatigue Level</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {["none", "mild", "moderate", "severe"].map((level) => (
                            <FormItem key={level} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={level} />
                              </FormControl>
                              <FormLabel className="font-normal capitalize">
                                {level}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="weightChanges"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Significant Weight Changes
                        </FormLabel>
                        <FormDescription>
                          Check if you've experienced significant weight changes recently
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("weightChanges") && (
                  <FormField
                    control={form.control}
                    name="weightChangeAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight Change Details</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g., Lost 10 lbs in 2 months" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="otherSymptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Other Symptoms</FormLabel>
                      <FormDescription>
                        Describe any other symptoms you're experiencing
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="familyCancerHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Family Cancer History</FormLabel>
                      <FormDescription>
                        List family members who have had cancer, including type and age at diagnosis
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="geneticTesting"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          Genetic Testing
                        </FormLabel>
                        <FormDescription>
                          Have you had any genetic testing done?
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {form.watch("geneticTesting") && (
                  <FormField
                    control={form.control}
                    name="geneticTestingDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genetic Testing Details</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="smokingStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Smoking Status</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {[
                            { value: "never", label: "Never Smoked" },
                            { value: "former", label: "Former Smoker" },
                            { value: "current", label: "Current Smoker" },
                          ].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="alcoholConsumption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alcohol Consumption</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {[
                            { value: "none", label: "None" },
                            { value: "occasional", label: "Occasional" },
                            { value: "moderate", label: "Moderate" },
                            { value: "heavy", label: "Heavy" },
                          ].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exerciseFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exercise Frequency</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {[
                            { value: "none", label: "None" },
                            { value: "light", label: "Light" },
                            { value: "moderate", label: "Moderate" },
                            { value: "frequent", label: "Frequent" },
                          ].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dietaryRestrictions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dietary Restrictions</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 5 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="emotionalState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emotional Well-being</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          {[
                            { value: "well", label: "Doing Well" },
                            { value: "mild_distress", label: "Mild Distress" },
                            { value: "moderate_distress", label: "Moderate Distress" },
                            { value: "severe_distress", label: "Severe Distress" },
                          ].map((option) => (
                            <FormItem key={option.value} className="flex items-center space-x-2">
                              <FormControl>
                                <RadioGroupItem value={option.value} />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {option.label}
                              </FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="supportSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Support System</FormLabel>
                      <FormDescription>
                        Describe your support network (family, friends, support groups)
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workConcerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work/Financial Concerns</FormLabel>
                      <FormDescription>
                        Describe any concerns about work or finances related to your treatment
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="treatmentGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Treatment Goals</FormLabel>
                      <FormDescription>
                        What are your expectations and goals for treatment?
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryConcerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Concerns</FormLabel>
                      <FormDescription>
                        What are your main concerns about your cancer diagnosis?
                      </FormDescription>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={previousStep}
              disabled={step === 0}
            >
              Previous
            </Button>

            {step === FORM_STEPS.length - 1 ? (
              <Button type="submit" disabled={mutation.isPending}>
                Submit
              </Button>
            ) : (
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}