import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { sendMessage } from "@/lib/api";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const initialMessage: Message = {
  role: "assistant",
  content: `Welcome to your medical AI assistant. While I'm not a doctor, I'm here to help you navigate your cancer care journey with evidence-based information and support.

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

Remember: I'm here to provide information and support, but always consult your healthcare team for medical decisions.

How can I assist you today?`
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [input, setInput] = useState("");

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (response) => {
      setMessages(prev => [...prev, { role: "assistant", content: response.message }]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: "user" as const, content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    mutation.mutate({ messages: [...messages, newMessage] });
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            AI Health Assistant
            <span className="text-sm font-normal text-muted-foreground">
              (Non-Medical Advice)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 dark:bg-blue-950">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This AI assistant provides general information and support. Always consult healthcare professionals for medical advice.
            </AlertDescription>
          </Alert>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
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
            </div>
          </ScrollArea>

          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              disabled={mutation.isPending}
            />
            <Button type="submit" disabled={mutation.isPending}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}