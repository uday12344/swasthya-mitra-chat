import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Language = "en" | "hi" | "te";

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
}

const languages = [
  { code: "en" as Language, name: "English", flag: "🇺🇸" },
  { code: "hi" as Language, name: "हिंदी", flag: "🇮🇳" },
  { code: "te" as Language, name: "తెలుగు", flag: "🇮🇳" },
];

export const LanguageSwitcher = ({ currentLanguage, onLanguageChange, className }: LanguageSwitcherProps) => {
  return (
    <div className={cn("flex gap-2", className)}>
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant={currentLanguage === lang.code ? "default" : "outline"}
          size="sm"
          onClick={() => onLanguageChange(lang.code)}
          className="flex items-center gap-1 transition-all duration-200"
        >
          <span className="text-sm">{lang.flag}</span>
          <span className="text-xs font-medium">{lang.name}</span>
        </Button>
      ))}
    </div>
  );
};