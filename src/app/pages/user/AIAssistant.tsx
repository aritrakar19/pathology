import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle } from "lucide-react";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import { useAuth } from "../../context/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: any;
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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Listen for messages in current user's conversation
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, "aiChats", user.uid, "messages"),
      orderBy("createdAt", "asc")
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
    }, (err) => {
      console.error("Error fetching messages:", err);
    });
    
    return () => unsubscribe();
  }, [user]);

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
        role: m.role,
        content: m.content
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
    if (!msgText.trim() || isLoading || !user) return;
    
    setError(null);
    setInput("");
    setIsLoading(true);
    
    try {
      // Save user message
      await addDoc(collection(db, "aiChats", user.uid, "messages"), {
        role: "user",
        content: msgText,
        createdAt: serverTimestamp()
      });
      
      // Prepare history for API call
      const chatHistory = [...messages]; 
      
      // Fetch AI response
      const responseText = await callGroqAPI(chatHistory, msgText);
      
      // Save AI response
      await addDoc(collection(db, "aiChats", user.uid, "messages"), {
        role: "assistant",
        content: responseText,
        createdAt: serverTimestamp()
      });
      
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
        
        {/* Welcome message if no chat history */}
        {messages.length === 0 && !isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl text-sm bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-bl-md shadow-sm whitespace-pre-wrap">
                Hello! 👋 I'm your MediPath AI Health Assistant. How can I help you today?
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "assistant" ? "bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B]" : "bg-[#E6F0EE]"}`}>
                {msg.role === "assistant" ? <Bot className="w-4 h-4 text-white" /> : <User className="w-4 h-4 text-[#6B7C7B]" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-sm ${msg.role === "user" ? "bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] text-white rounded-br-md shadow-sm" : "bg-white border border-[#E6F0EE] text-[#1C2B2A] rounded-bl-md shadow-sm whitespace-pre-wrap"}`}>
                {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end gap-2 max-w-[85%]">
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#1FAF9A] to-[#0E7C6B] shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-white border border-[#E6F0EE] rounded-bl-md flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 text-[#1FAF9A] animate-spin" />
                <span className="text-sm text-[#6B7C7B]">Typing...</span>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex justify-center my-2">
            <div className="bg-red-50 text-red-600 text-xs px-4 py-2.5 rounded-xl border border-red-100 max-w-md text-center shadow-sm">
              {error}
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-wrap gap-2 mb-3 shrink-0">
          {suggestions.map((s) => (
            <button key={s} onClick={() => handleSend(s)} className="px-3 py-2 bg-white border border-[#E6F0EE] rounded-xl text-xs text-[#6B7C7B] hover:border-[#1FAF9A] hover:text-[#1FAF9A] hover:shadow-sm transition-all flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> {s}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex flex-col gap-2 shrink-0">
        <div className="flex items-center gap-2 bg-white border border-[#E6F0EE] rounded-2xl p-2 shadow-sm focus-within:border-[#1FAF9A] focus-within:ring-2 focus-within:ring-[#1FAF9A]/20 transition-all">
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
            className="w-10 h-10 bg-gradient-to-r from-[#1FAF9A] to-[#0E7C6B] rounded-xl flex items-center justify-center text-white hover:shadow-md transition-all disabled:opacity-50 disabled:hover:shadow-none shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
