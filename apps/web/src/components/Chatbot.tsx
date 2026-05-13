"use client";

import { useState, useRef, useEffect } from "react";
import { chatApi, type ChatMessage, type ChatContext } from "@/lib/api";
import { Loader2, Send, X, MessageCircle } from "lucide-react";

import type { Recommendation, CostData } from "@/lib/api";

interface ChatbotProps {
  pageType: "recommendations" | "costs";
  contextData?: {
    accountId?: string;
    recommendations?: Recommendation[];
    costData?: CostData;
  };
}

export default function Chatbot({ pageType, contextData }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const context: ChatContext = {
        pageType,
        accountId: contextData?.accountId,
        recommendations: contextData?.recommendations,
        costData: contextData?.costData,
      };
      const response = await chatApi.sendMessage(input, context);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (err: any) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClear = async () => {
    try {
      await chatApi.clearHistory();
      setMessages([]);
    } catch (err: any) {
      setError(err.message || "Failed to clear history");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-violet-500 text-white shadow-lg shadow-violet-500/20 transition-transform hover:scale-105 focus:outline-none"
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-end">
          <div
            className="absolute inset-0 bg-black/50 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative w-full max-w-md h-[500px] sm:h-[600px] bg-[#111218] border border-[#1E1E2E] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col mx-4 sm:mx-6 mb-4">
            <div className="flex items-center justify-between p-4 border-b border-[#1E1E2E]">
              <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={handleClear}
                    className="text-xs text-zinc-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-zinc-400 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center text-zinc-500 py-8">
                  <p className="text-sm">Ask me anything about your cloud costs!</p>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-violet-600 text-white"
                          : "bg-[#1A1B26] text-zinc-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#1A1B26] p-3 rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="px-4 pb-2">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <div className="p-4 border-t border-[#1E1E2E]">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 resize-none rounded-xl border border-zinc-700 bg-[#12151F] px-4 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none"
                  rows={1}
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}