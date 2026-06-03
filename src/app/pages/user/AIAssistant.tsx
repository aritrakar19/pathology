import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const suggestions = [
  "Fever",
  "Diabetes",
  "Blood Pressure",
  "Thyroid",
  "Heart Health",
  "Diet Advice"
];

const SYSTEM_PROMPT = `You are MediPath AI Health Assistant.

Your job is to:
- Explain symptoms
- Explain medicines
- Explain medical tests
- Provide health guidance
- Explain reports in simple language
- Suggest when a doctor consultation is needed

Important:
- Never claim to be a doctor.
- Never provide final diagnosis.
- Never prescribe medicines.
- Always recommend consulting a healthcare professional for serious conditions.
- Keep responses simple and patient-friendly.`;

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Hello! 👋 I'm your MediPath AI Health Assistant. How can I help you today?", 
      sender: "ai", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); 
  }, [messages, isLoading]);

  const callGroqAPI = async (chatHistory: Message[], newText: string) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("Groq API key is not configured.");
    }

    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text
      })),
      { role: "user", content: newText }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 1024,
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || "Failed to fetch response from AI");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  };

  const handleSend = async (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim() || isLoading) return;
    
    setError(null);
    const userMsg: Message = { 
      id: Date.now().toString(), 
      text: msgText, 
      sender: "user", 
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };
    
    const currentMessages = [...messages];
    setMessages([...currentMessages, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await callGroqAPI(currentMessages, msgText);
      
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: responseText, 
        sender: "ai", 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the AI assistant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-2 rounded-xl flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>AI responses are for informational purposes only and are not a substitute for professional medical advice.</p>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1C2B2A]">MediPath AI Assistant</h1>
            <div className="flex items-center gap-1 text-xs text-[#1FAF9A]">
              <span className="w-2 h-2 bg-[#1FAF9A] rounded-full animate-pulse" /> Online
            </div>
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-[#E6F0EE] scrollbar-track-transparent">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "ai" ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]" : "bg-[#E6F0EE]"}`}>
                {msg.sender === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#6B7C7B]" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-br-md" : "bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-bl-md whitespace-pre-wrap"}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6F0EE] rounded-bl-md flex items-center gap-2">
                <Loader2 className="w-4 h-4 text-[#1FAF9A] animate-spin" />
                <span className="text-sm text-[#6B7C7B]">Typing...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-600 text-xs px-3 py-2 rounded-lg border border-red-100 max-w-md text-center">
              {error}
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="px-3 py-2 bg-white border border-[#E6F0EE] rounded-xl text-xs text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-white border border-[#E6F0EE] rounded-2xl p-2 shadow-sm focus-within:border-[#1FAF9A] focus-within:ring-1 focus-within:ring-[#1FAF9A]/20 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about health..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-[#1C2B2A] placeholder:text-[#6B7C7B]/50 disabled:opacity-50"
          />
          <button 
            onClick={() => handleSend()} 
            disabled={isLoading || !input.trim()}
            className="w-10 h-10 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:hover:shadow-none"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
