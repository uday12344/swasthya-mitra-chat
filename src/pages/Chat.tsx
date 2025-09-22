import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChatBubble } from "@/components/ChatBubble";
import { LanguageSwitcher, Language } from "@/components/LanguageSwitcher";
import { QuickReplies } from "@/components/QuickReplies";
import { useChat } from "@/hooks/useChat";
import { Send, ArrowLeft, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { outbreakAlerts } from "@/data/healthData";

const Chat = () => {
  const [language, setLanguage] = useState<Language>("en");
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, userProfile, isTyping, sendMessage, symptomState, handleSymptomAnswer } = useChat(language);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (message?: string) => {
    const messageToSend = message || inputMessage.trim();
    if (messageToSend) {
      sendMessage(messageToSend);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeAlert = outbreakAlerts[0]; // Show most recent alert

  return (
    <div className="min-h-screen bg-gradient-to-br from-chat-bg to-background flex flex-col">
      {/* Header */}
      <header className="bg-card/90 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/home" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-healthcare-blue to-healthcare-green rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
                <div>
                  <h1 className="font-semibold">SwasthyaAI</h1>
                  <p className="text-xs text-muted-foreground">
                    {userProfile.name
                      ? `Hello, ${userProfile.name}`
                      : "Health Assistant"}
                  </p>
                </div>
              </div>
            </div>

            <LanguageSwitcher
              currentLanguage={language}
              onLanguageChange={setLanguage}
            />
          </div>
        </div>
      </header>

      {/* Outbreak Alert Banner */}
      {activeAlert && (
        <div className="bg-destructive/10 border-l-4 border-destructive px-4 py-3 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-sm font-medium text-destructive">
                Health Alert
              </p>
              <p className="text-xs text-muted-foreground">
                {activeAlert.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message.message}
                isUser={message.isUser}
                timestamp={message.timestamp}
                options={message.options}
                onOptionClick={handleSymptomAnswer}
                language={language}
              />
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-3 mb-4 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <span className="text-xs">AI</span>
                </div>
                <div className="bg-chat-bot-bubble rounded-2xl rounded-bl-md px-4 py-3 border border-border">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Quick Replies and Input */}
      <div className="bg-card/90 backdrop-blur-sm border-t p-4">
        <div className="max-w-4xl mx-auto">
          {symptomState === "finished" && (
            <>
              <QuickReplies
                language={language}
                onQuickReply={handleSendMessage}
                className="mb-4"
              />

              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === "en"
                      ? "Type your health question..."
                      : language === "hi"
                      ? "अपना स्वास्थ्य प्रश्न टाइप करें..."
                      : "మీ ఆరోగ్య ప్రశ్నను టైప్ చేయండి..."
                  }
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  size="icon"
                  className="transition-all duration-200 hover:scale-105"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}

          <p className="text-xs text-muted-foreground text-center mt-2">
            {language === "en"
              ? "SwasthyaAI can make mistakes. Please verify important medical information."
              : language === "hi"
              ? "SwasthyaAI गलतियां कर सकता है। कृपया महत्वपूर्ण चिकित्सा जानकारी सत्यापित करें।"
              : "SwasthyaAI తప్పులు చేయవచ్చు. దయచేసి ముఖ్యమైన వైద్య సమాచారాన్ని ధృవీకరించండి."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
