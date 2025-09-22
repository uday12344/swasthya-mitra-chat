import { Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Language } from "./LanguageSwitcher";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  options?: {
    id: string;
    text: {
      en: string;
      hi: string;
      te: string;
    };
  }[];
  onOptionClick?: (text: string, id: string) => void;
  language?: Language;
}

export const ChatBubble = ({ message, isUser, timestamp, options, onOptionClick, language = 'en' }: ChatBubbleProps) => {
  const bubbleClasses = isUser
    ? "bg-chat-user-bubble text-white self-end rounded-tr-none"
    : "bg-chat-bot-bubble self-start rounded-tl-none";

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${isUser ? "justify-end" : ""}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
          <Bot className="w-5 h-5 text-secondary-foreground" />
        </div>
      )}
      <div
        className={`max-w-xl rounded-2xl px-4 py-3 border border-border shadow-sm ${bubbleClasses}`}>
        <p className="text-sm whitespace-pre-wrap">{message}</p>
        {options && onOptionClick && (
          <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => (
              <Button
                key={option.id}
                variant="outline"
                size="sm"
                onClick={() => onOptionClick(option.text[language], option.id)}>
                {option.text[language]}
              </Button>
            ))}
          </div>
        )}
        <p className="text-xs text-right mt-2 opacity-70">{formatTime(timestamp)}</p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center">
          <User className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};