import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatBot } from './chatbot/ChatBot';
import { FoodAnalysis } from './food/FoodAnalysis';
import { MedicineInfo } from './medicine/MedicineInfo';
import { VoiceAssistant } from './VoiceAssistant';
import { Bot, Apple, Pill, Mic } from 'lucide-react';

export const AIHealthPlatform = () => {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            SwasthyaAI Healthcare Platform
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Your comprehensive AI-powered healthcare companion with multilingual support
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              AI Chatbot
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center gap-2">
              <Mic className="w-4 h-4" />
              Voice Assistant
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <Apple className="w-4 h-4" />
              Food Analysis
            </TabsTrigger>
            <TabsTrigger value="medicine" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medicine Info
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-0">
            <ChatBot />
          </TabsContent>

          <TabsContent value="voice" className="mt-0">
            <VoiceAssistant />
          </TabsContent>

          <TabsContent value="food" className="mt-0">
            <FoodAnalysis />
          </TabsContent>

          <TabsContent value="medicine" className="mt-0">
            <MedicineInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};