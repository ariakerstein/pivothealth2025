interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

interface ChatResponse {
  message: string;
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
    const errorText = await response.text();
    console.error('Chat API error:', errorText);
    throw new Error(errorText || "Failed to send message");
  }

  const data = await response.json();
  return { message: data.message };
}