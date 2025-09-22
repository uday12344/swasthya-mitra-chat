import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface VoiceAssistantProps {
  language?: 'en' | 'hi' | 'te' | 'ta' | 'kn';
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ language = 'en' }) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const recognition = useRef<SpeechRecognition | null>(null);
  const synthesis = useRef<SpeechSynthesis | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = language === 'en' ? 'en-US' : 
                                language === 'hi' ? 'hi-IN' :
                                language === 'te' ? 'te-IN' :
                                language === 'ta' ? 'ta-IN' :
                                language === 'kn' ? 'kn-IN' : 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setTranscript(transcript);
        handleVoiceInput(transcript);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive",
        });
      };
    }

    // Initialize speech synthesis
    if ('speechSynthesis' in window) {
      synthesis.current = window.speechSynthesis;
    }

    return () => {
      if (recognition.current) {
        recognition.current.stop();
      }
      if (synthesis.current) {
        synthesis.current.cancel();
      }
    };
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognition.current) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition. Please try a different browser.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isListening) {
      setTranscript('');
      setResponse('');
      setIsListening(true);
      try {
        recognition.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Could not start voice recognition. Please check your microphone permissions.",
          variant: "destructive",
        });
      }
    }
  }, [isListening, toast]);

  const stopListening = useCallback(() => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const handleVoiceInput = async (text: string) => {
    setIsProcessing(true);
    try {
      // Call the chat AI function with the voice input
      const { data, error } = await supabase.functions.invoke('chat-ai', {
        body: { 
          message: text,
          language: language,
          context: 'voice_assistant'
        }
      });

      if (error) throw error;

      const aiResponse = data.response;
      setResponse(aiResponse);
      
      // Speak the response
      speakText(aiResponse);
      
    } catch (error) {
      console.error('Error processing voice input:', error);
      toast({
        title: "Processing Error",
        description: "Could not process your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if (synthesis.current && text) {
      // Cancel any ongoing speech
      synthesis.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 
                      language === 'hi' ? 'hi-IN' :
                      language === 'te' ? 'te-IN' :
                      language === 'ta' ? 'ta-IN' :
                      language === 'kn' ? 'kn-IN' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthesis.current.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis.current) {
      synthesis.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Voice Health Assistant
        </h3>
        <p className="text-sm text-muted-foreground">
          Ask about symptoms, medicines, vaccines, or health conditions
        </p>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing || isSpeaking}
          variant={isListening ? "destructive" : "default"}
          size="lg"
          className="flex items-center space-x-2"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          <span>{isListening ? 'Stop Listening' : 'Start Speaking'}</span>
        </Button>

        <Button
          onClick={isSpeaking ? stopSpeaking : () => response && speakText(response)}
          disabled={!response || isProcessing}
          variant="outline"
          size="lg"
          className="flex items-center space-x-2"
        >
          {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          <span>{isSpeaking ? 'Stop Speaking' : 'Repeat Response'}</span>
        </Button>
      </div>

      {isProcessing && (
        <div className="text-center">
          <div className="animate-pulse text-sm text-muted-foreground">
            Processing your request...
          </div>
        </div>
      )}

      {transcript && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground">You said:</h4>
          <p className="text-sm bg-background/50 p-3 rounded-lg border">{transcript}</p>
        </div>
      )}

      {response && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-foreground">Assistant:</h4>
          <p className="text-sm bg-background/50 p-3 rounded-lg border">{response}</p>
        </div>
      )}

      <div className="text-xs text-muted-foreground text-center">
        <p>💡 Try asking: "What are the symptoms of fever?" or "Tell me about vitamin D"</p>
      </div>
    </Card>
  );
};