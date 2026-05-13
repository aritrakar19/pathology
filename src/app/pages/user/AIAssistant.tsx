import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  time: string;
}

const suggestions = [
  "What tests should I take for a full body checkup?",
  "I have a headache and fever — what could it be?",
  "Which doctor should I consult for back pain?",
  "What does a high TSH level mean?",
];

const aiResponses: Record<string, string> = {
  default: "I'd be happy to help! As your AI health assistant, I can help you find the right tests, understand your symptoms, or recommend doctors. What would you like to know?",
  "full body": "For a comprehensive full body checkup, I'd recommend our **Complete Health Checkup** package (₹1,499). It includes 72+ tests covering CBC, Lipid Profile, Liver & Kidney Function, Thyroid, and more. Would you like to book it?",
  headache: "Headache and fever could indicate several conditions — from a common viral infection to flu. I'd recommend consulting a **General Physician**. Dr. Priya Sharma is available today at 3:00 PM. Shall I book an appointment?",
  back: "For back pain, I'd suggest consulting an **Orthopedic specialist**. Dr. Vikram Singh has 15 years of experience. You can also consider a Vitamin D test, as deficiency can cause body aches.",
  tsh: "A high TSH (Thyroid Stimulating Hormone) level typically indicates **hypothyroidism** — meaning your thyroid gland is underactive. I'd recommend our Thyroid Profile package (₹499) for a complete assessment.",
};

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes("full body") || lower.includes("checkup")) return aiResponses["full body"];
  if (lower.includes("headache") || lower.includes("fever")) return aiResponses["headache"];
  if (lower.includes("back") || lower.includes("pain")) return aiResponses["back"];
  if (lower.includes("tsh") || lower.includes("thyroid")) return aiResponses["tsh"];
  return aiResponses["default"];
}

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! 👋 I'm your AI Health Assistant. I can help you find the right tests, understand symptoms, or recommend doctors. How can I help you today?", sender: "ai", time: "Now" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    const userMsg: Message = { id: Date.now(), text: msg, sender: "user", time: "Now" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const aiMsg: Message = { id: Date.now() + 1, text: getAIResponse(msg), sender: "ai", time: "Now" };
      setMessages((prev) => [...prev, aiMsg]);
    }, 800);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)] md:h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] rounded-2xl flex items-center justify-center">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[#1C2B2A]">AI Health Assistant</h1>
          <div className="flex items-center gap-1 text-xs text-[#1FAF9A]">
            <span className="w-2 h-2 bg-[#1FAF9A] rounded-full animate-pulse" /> Online
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "ai" ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]" : "bg-[#E6F0EE]"}`}>
                {msg.sender === "ai" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#6B7C7B]" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm ${msg.sender === "user" ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-br-md" : "bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-bl-md"}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="px-3 py-2 bg-white border border-[#E6F0EE] rounded-xl text-xs text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] transition-all flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 bg-white border border-[#E6F0EE] rounded-2xl p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask me anything about health..."
          className="flex-1 px-3 py-2 text-sm bg-transparent focus:outline-none text-[#1C2B2A] placeholder:text-[#6B7C7B]/50"
        />
        <button onClick={() => handleSend()} className="w-10 h-10 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
