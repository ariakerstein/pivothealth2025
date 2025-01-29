interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

interface ChatResponse {
  message: string;
  citations?: string[];
}

export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || response.statusText;
    console.error('Chat API error:', errorMessage);
    throw new Error(errorMessage || "Failed to send message");
  }

  const data = await response.json();
  return {
    message: data.message,
    citations: data.citations
  };
}