import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  className?: string;
}

export const ChatBubble = ({ message, isUser, timestamp, className }: ChatBubbleProps) => {
  return (
    <div className={cn("flex gap-3 mb-4 animate-in slide-in-from-bottom duration-300", 
      isUser ? "flex-row-reverse" : "flex-row", className)}>
      
      {/* Avatar */}
      <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm",
        isUser ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message bubble */}
      <div className={cn("max-w-[80%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-md transition-all duration-200",
        isUser 
          ? "bg-chat-user-bubble text-white rounded-br-md" 
          : "bg-chat-bot-bubble text-foreground border border-border rounded-bl-md")}>
        
        <p className="text-sm leading-relaxed break-words">{message}</p>
        
        <div className={cn("text-xs mt-2 opacity-70",
          isUser ? "text-right text-white/80" : "text-left text-muted-foreground")}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};