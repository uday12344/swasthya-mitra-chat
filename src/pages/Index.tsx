import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageSquare, Shield, Calendar, TrendingUp, Users, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/healthcare-hero.jpg";

const Index = () => {
  const features = [
    {
      icon: MessageSquare,
      title: "Smart Health Chat",
      description: "Get instant answers to health queries in your preferred language"
    },
    {
      icon: Shield,
      title: "Disease Prevention",
      description: "Learn about symptoms, prevention tips for common diseases"
    },
    {
      icon: Calendar,
      title: "Vaccination Reminders",
      description: "Never miss important vaccinations for you and your family"
    },
    {
      icon: TrendingUp,
      title: "Outbreak Alerts",
      description: "Stay informed about health outbreaks in your area"
    },
    {
      icon: Users,
      title: "Personalized Care",
      description: "Customized health recommendations based on your profile"
    },
    {
      icon: Globe,
      title: "Multilingual Support",
      description: "Available in English, Hindi, and Telugu"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-bg to-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-healthcare-blue to-healthcare-green rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-healthcare-blue to-healthcare-green bg-clip-text text-transparent">
              SwasthyaAI
            </h1>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link to="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link to="/chat">Start Chat</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-center lg:text-left relative z-10 lg:pr-8 xl:pr-12">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-healthcare-blue via-healthcare-green to-healthcare-blue bg-clip-text text-transparent">
                SwasthyaAI
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-4">
                Multilingual Health Chatbot
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Your intelligent healthcare companion providing personalized health guidance, 
                vaccination reminders, and disease prevention tips in English, Hindi, and Telugu.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12 lg:mr-20 xl:mr-24 lg:max-w-[500px]">
                <Button asChild size="lg" className="text-lg px-8">
                  <Link to="/ai-platform" className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    AI Health Platform
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/chat">Original Chat</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative z-0 lg:pl-8 overflow-hidden">
              <img 
                src={heroImage} 
                alt="SwasthyaAI Healthcare Chatbot - Indian family consulting health assistant"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center border-healthcare-blue/20 bg-card/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-healthcare-blue mb-2">24/7</div>
              <div className="text-muted-foreground">Available Support</div>
            </Card>
            <Card className="p-6 text-center border-healthcare-green/20 bg-card/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-healthcare-green mb-2">3</div>
              <div className="text-muted-foreground">Languages Supported</div>
            </Card>
            <Card className="p-6 text-center border-healthcare-amber/20 bg-card/50 backdrop-blur-sm">
              <div className="text-3xl font-bold text-healthcare-amber mb-2">100+</div>
              <div className="text-muted-foreground">Health Topics</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Comprehensive healthcare assistance tailored for Indian families
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-healthcare-blue to-healthcare-green rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-healthcare-blue to-healthcare-green text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of families already using SwasthyaAI for better health management
          </p>
          <Button asChild size="lg" variant="secondary" className="text-lg px-8">
            <Link to="/ai-platform" className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Start Your AI Health Journey
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 SwasthyaAI - Multilingual Health Chatbot. Built for preventive healthcare awareness.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
