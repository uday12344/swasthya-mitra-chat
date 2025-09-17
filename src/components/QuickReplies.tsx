import { Button } from "@/components/ui/button";
import { quickReplies } from "@/data/healthData";
import { Language } from "./LanguageSwitcher";

interface QuickRepliesProps {
  language: Language;
  onQuickReply: (message: string) => void;
  className?: string;
}

export const QuickReplies = ({ language, onQuickReply, className }: QuickRepliesProps) => {
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-4">
        {quickReplies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onQuickReply(reply[language])}
            className="text-xs bg-card hover:bg-muted border-chat-shadow transition-all duration-200 hover:scale-105"
          >
            {reply[language]}
          </Button>
        ))}
      </div>
    </div>
  );
};