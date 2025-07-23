import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  message: string;
  intent: string;
  confidence: number;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Welcome! I\'m here to guide you on your spiritual journey. How can I assist you today?'
    }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        history: messages.slice(-6) // Send last 6 messages for context
      });
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.message }
      ]);
    },
    onError: () => {
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: 'I\'m experiencing a moment of silence. Please try again in a moment, or feel free to contact our human guides for immediate assistance.' 
        }
      ]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const userMessage = input.trim();
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
      setInput("");
      sendMessage.mutate(userMessage);
    }
  };

  return (
    <div className="chatbot-container">
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="brand-primary hover:brand-bright text-white hover:text-black p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        {isOpen ? <X className="text-xl" /> : <MessageCircle className="text-xl" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window absolute bottom-16 right-0 bg-white border border-gray-200 shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="chatbot-header brand-dark p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Spiritual Guide</h3>
              <p className="text-sm opacity-80">Here to assist your journey</p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="text-white hover:text-gray-300 p-1"
            >
              <X className="text-lg" />
            </Button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'brand-primary text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 p-3 rounded-lg">
                  <p className="text-sm">Reflecting on your question...</p>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="chatbot-input">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Share your spiritual question..."
                className="flex-1"
                disabled={sendMessage.isPending}
              />
              <Button
                type="submit"
                disabled={sendMessage.isPending || !input.trim()}
                className="brand-primary hover:brand-bright text-white hover:text-black"
              >
                <Send className="text-sm" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
