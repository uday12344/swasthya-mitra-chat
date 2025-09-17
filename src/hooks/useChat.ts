import { useState, useCallback, useEffect } from "react";
import { Language } from "@/components/LanguageSwitcher";
import { chatResponses, vaccinationSchedule, outbreakAlerts } from "@/data/healthData";

export interface ChatMessage {
  id: string;
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export interface UserProfile {
  name?: string;
  age?: number;
  location?: string;
  allergies?: string[];
  lastVisit?: Date;
}

export const useChat = (language: Language) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [isTyping, setIsTyping] = useState(false);

  // Load user profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem("swasthya-user-profile");
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }

    // Welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      message: getWelcomeMessage(language),
      isUser: false,
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  }, [language]);

  // Save user profile to localStorage
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updates };
    setUserProfile(newProfile);
    localStorage.setItem("swasthya-user-profile", JSON.stringify(newProfile));
  }, [userProfile]);

  const getWelcomeMessage = (lang: Language) => {
    const messages = {
      en: `Hello! I'm SwasthyaAI, your multilingual health assistant. I can help you with health queries, vaccination schedules, outbreak alerts, and preventive care tips. How can I assist you today?`,
      hi: `नमस्ते! मैं SwasthyaAI हूं, आपका बहुभाषी स्वास्थ्य सहायक। मैं आपको स्वास्थ्य प्रश्न, टीकाकरण कार्यक्रम, प्रकोप अलर्ट और निवारक देखभाल युक्तियों में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?`,
      te: `నమస్కారం! నేను SwasthyaAI, మీ బహుభాషా ఆరోగ్య సహాయకుడిని. నేను మీకు ఆరోగ్య ప్రశ్నలు, టీకా షెడ్యూల్స్, వ్యాప్తి హెచ్చరికలు మరియు నివారణ సంరక్షణ చిట్కాలతో సహాయం చేయగలను. ఈరోజు నేను మీకు ఎలా సహాయం చేయగలను?`
    };
    return messages[lang];
  };

  const generateResponse = useCallback((userMessage: string, lang: Language): string => {
    const message = userMessage.toLowerCase();
    
    // Check for user profile information
    if (message.includes("my name is") || message.includes("i am")) {
      const nameMatch = message.match(/(?:my name is|i am) ([a-zA-Z\s]+)/);
      if (nameMatch) {
        const name = nameMatch[1].trim();
        updateUserProfile({ name });
        return lang === "en" ? `Nice to meet you, ${name}! I've saved your information. How can I help you with your health queries?` :
               lang === "hi" ? `आपसे मिलकर खुशी हुई, ${name}! मैंने आपकी जानकारी सहेज ली है। मैं आपके स्वास्थ्य प्रश्नों में कैसे मदद कर सकता हूं?` :
               `మిమ్మల్ని కలవడం ఆనందంగా ఉంది, ${name}! నేను మీ సమాచారాన్ని సేవ్ చేశాను. మీ ఆరోగ్య ప్రశ్నలతో నేను ఎలా సహాయం చేయగలను?`;
      }
    }

    // Check for age information
    const ageMatch = message.match(/(\d+)\s*(?:years?|months?)\s*old/);
    if (ageMatch) {
      const age = parseInt(ageMatch[1]);
      updateUserProfile({ age });
      
      // Provide vaccination recommendations for children
      if (age <= 18) {
        const relevantVaccines = vaccinationSchedule.filter(v => {
          if (age === 0) return v.age.includes("birth");
          if (age < 1) return v.age.includes("weeks") || v.age.includes("months");
          return v.age.includes("years") || v.age.includes("months");
        });
        
        if (relevantVaccines.length > 0) {
          const vaccineList = relevantVaccines.map(v => `${v.vaccine} (${v.age})`).join(", ");
          return lang === "en" ? `Based on the age ${age}, here are important vaccinations: ${vaccineList}. Please consult your pediatrician for the complete schedule.` :
                 lang === "hi" ? `${age} वर्ष की आयु के आधार पर, यहां महत्वपूर्ण टीकाकरण हैं: ${vaccineList}। पूर्ण कार्यक्रम के लिए कृपया अपने बाल रोग विशेषज्ञ से सलाह लें।` :
                 `${age} వయస్సు ఆధారంగా, ఇవి ముఖ్యమైన టీకాలు: ${vaccineList}. పూర్తి షెడ్యూల్ కోసం దయచేసి మీ పీడియాట్రిషియన్‌ని సంప్రదించండి.`;
        }
      }
    }

    // Check outbreak alerts
    if (message.includes("outbreak") || message.includes("alert")) {
      const activeAlerts = outbreakAlerts.slice(0, 2);
      const alertText = activeAlerts.map(alert => `${alert.disease} in ${alert.location} - ${alert.description}`).join("\n");
      return lang === "en" ? `Current health alerts:\n${alertText}` :
             lang === "hi" ? `वर्तमान स्वास्थ्य अलर्ट:\n${alertText}` :
             `ప్రస్తుత ఆరోగ్య హెచ్చరికలు:\n${alertText}`;
    }

    // Find matching response
    for (const response of chatResponses) {
      if (response.keywords.some(keyword => message.includes(keyword))) {
        return response.response[lang];
      }
    }

    // Default response
    const defaultResponses = {
      en: "I'm here to help with health-related questions. You can ask me about symptoms, prevention, vaccination schedules, or outbreak alerts. Try asking about malaria, dengue, healthy diet, or vaccination schedules.",
      hi: "मैं स्वास्थ्य संबंधी प्रश्नों में मदद के लिए यहां हूं। आप मुझसे लक्षण, रोकथाम, टीकाकरण कार्यक्रम या प्रकोप अलर्ट के बारे में पूछ सकते हैं। मलेरिया, डेंगू, स्वस्थ आहार या टीकाकरण कार्यक्रम के बारे में पूछने का प्रयास करें।",
      te: "నేను ఆరోగ్య సంబంధిత ప్రశ్నలతో సహాయం చేయడానికి ఇక్కడ ఉన్నాను. మీరు నన్ను లక్షణాలు, నివారణ, టీకా షెడ్యూల్స్ లేదా వ్యాప్తి హెచ్చరికల గురించి అడగవచ్చు. మలేరియా, డెంగీ, ఆరోగ్యకర ఆహారం లేదా టీకా షెడ్యూల్స్ గురించి అడగడానికి ప్రయత్నించండి."
    };
    
    return defaultResponses[lang];
  }, [updateUserProfile]);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse = generateResponse(message, language);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  }, [generateResponse, language]);

  return {
    messages,
    userProfile,
    isTyping,
    sendMessage,
    updateUserProfile,
  };
};