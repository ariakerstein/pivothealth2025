import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessage: Message = {
  role: "assistant",
  content: `Welcome to your medical Co-Pilot. I'm here to help you navigate your cancer care journey with evidence-based information and support.

Here are some examples of questions you can ask:

🔍 Understanding Your Care:
- Can you explain what PSA levels mean and why they're important?
- What are common side effects of immunotherapy treatments?
- How do clinical trials work and how can I find relevant ones?

🏥 Care Navigation:
- What questions should I ask my oncologist during my next visit?
- How can I better manage treatment-related fatigue?
- What support services are typically available at cancer centers?

💡 Lifestyle & Wellness:
- What dietary changes can support my treatment plan?
- How can I maintain physical activity during treatment?
- What stress management techniques work well for cancer patients?

Remember: I'm your Co-Pilot in this journey, providing information and support, but always consult your healthcare team for medical decisions.

How can I assist you today?`
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: "assistant", content: response.message }]);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to get response from AI assistant",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || mutation.isPending) return;

    const newMessage = { role: "user" as const, content: input.trim() };
    setMessages(prev => [...prev, newMessage]);
    setInput("");

    mutation.mutate({ 
      messages: [...messages, newMessage]
    });
  };

  return (
    <div className="container px-4 sm:max-w-3xl mx-auto py-4 sm:py-8 space-y-4">
      <Card className="border-0 sm:border">
        <CardHeader className="px-4 sm:px-6">
          <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            Health Co-Pilot
            <span className="text-xs sm:text-sm font-normal text-muted-foreground">
              (Evidence-Based Support)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your Co-Pilot provides evidence-based information and support. Always consult healthcare professionals for medical advice.
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[60vh] sm:h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-3 sm:px-4 py-2 max-w-[85%] sm:max-w-[80%] text-sm sm:text-base ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : msg === initialMessage
                        ? "bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800"
                        : "bg-muted"
                    }`}
                    style={{
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {mutation.isPending && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              )}
              {mutation.isError && (
                <Alert variant="destructive" className="mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to get response. Please try again.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              disabled={mutation.isPending}
              className="text-sm sm:text-base"
            />
            <Button 
              type="submit" 
              disabled={mutation.isPending || !input.trim()}
              className="whitespace-nowrap"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span className="hidden sm:inline">Sending...</span>
                </>
              ) : (
                'Send'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}