import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageSwitcher, Language } from "@/components/LanguageSwitcher";
import {
  vaccinationSchedule,
  outbreakAlerts,
  diseaseInfo,
} from "@/data/healthData";
import {
  Calendar,
  AlertTriangle,
  BookOpen,
  Users,
  TrendingUp,
  ArrowLeft,
  Syringe,
  MapPin,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [language, setLanguage] = useState<Language>("en");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getTranslation = (key: string) => {
    const translations = {
      en: {
        dashboard: "Health Dashboard",
        overview: "Overview",
        vaccinations: "Vaccinations",
        outbreaks: "Outbreaks",
        education: "Education",
        activeAlerts: "Active Health Alerts",
        vaccinationSchedule: "Vaccination Schedule",
        diseaseEducation: "Disease Education",
        symptoms: "Symptoms",
        prevention: "Prevention",
        treatment: "Treatment",
        totalVaccines: "Total Vaccines",
        activeOutbreaks: "Active Outbreaks",
        healthTopics: "Health Topics",
        severity: "Severity",
      },
      hi: {
        dashboard: "स्वास्थ्य डैशबोर्ड",
        overview: "सिंहावलोकन",
        vaccinations: "टीकाकरण",
        outbreaks: "प्रकोप",
        education: "शिक्षा",
        activeAlerts: "सक्रिय स्वास्थ्य अलर्ट",
        vaccinationSchedule: "टीकाकरण कार्यक्रम",
        diseaseEducation: "रोग शिक्षा",
        symptoms: "लक्षण",
        prevention: "रोकथाम",
        treatment: "इलाज",
        totalVaccines: "कुल टीके",
        activeOutbreaks: "सक्रिय प्रकोप",
        healthTopics: "स्वास्थ्य विषय",
        severity: "गंभीरता",
      },
      te: {
        dashboard: "ఆరోగ్య డాష్‌బోర్డ్",
        overview: "సమీక్ష",
        vaccinations: "టీకాలు",
        outbreaks: "వ్యాప్తులు",
        education: "విద్య",
        activeAlerts: "క్రియాశీల ఆరోగ్య హెచ్చరికలు",
        vaccinationSchedule: "టీకా షెడ్యూల్",
        diseaseEducation: "వ్యాధి విద్య",
        symptoms: "లక్షణాలు",
        prevention: "నివారణ",
        treatment: "చికిత్స",
        totalVaccines: "మొత్తం టీకాలు",
        activeOutbreaks: "క్రియాశీల వ్యాప్తులు",
        healthTopics: "ఆరోగ్య విషయాలు",
        severity: "తీవ్రత",
      },
    };
    return translations[language][key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-chat-bg to-background">
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
              <h1 className="text-xl font-bold">
                {getTranslation("dashboard")}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <LanguageSwitcher
                currentLanguage={language}
                onLanguageChange={setLanguage}
              />
              <Button asChild>
                <Link to="/chat">Start Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {getTranslation("overview")}
            </TabsTrigger>
            <TabsTrigger
              value="vaccinations"
              className="flex items-center gap-2"
            >
              <Syringe className="w-4 h-4" />
              {getTranslation("vaccinations")}
            </TabsTrigger>
            <TabsTrigger value="outbreaks" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {getTranslation("outbreaks")}
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              {getTranslation("education")}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-healthcare-blue/10 to-healthcare-blue/5 border-healthcare-blue/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation("totalVaccines")}
                  </CardTitle>
                  <Syringe className="h-4 w-4 text-healthcare-blue" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-healthcare-blue">
                    {vaccinationSchedule.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation("activeOutbreaks")}
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {outbreakAlerts.length}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-healthcare-green/10 to-healthcare-green/5 border-healthcare-green/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {getTranslation("healthTopics")}
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-healthcare-green" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-healthcare-green">
                    {diseaseInfo.length}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  {getTranslation("activeAlerts")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {outbreakAlerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg bg-card/50"
                  >
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{alert.disease}</h4>
                        <Badge variant={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {alert.location}
                      </p>
                      <p className="text-sm">{alert.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Vaccinations Tab */}
          <TabsContent value="vaccinations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{getTranslation("vaccinationSchedule")}</CardTitle>
                <CardDescription>
                  Complete vaccination schedule for children
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {vaccinationSchedule.map((vaccine, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-healthcare-blue/10 rounded-full flex items-center justify-center">
                        <Syringe className="w-6 h-6 text-healthcare-blue" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{vaccine.vaccine}</h3>
                        <p className="text-sm text-muted-foreground">
                          {vaccine.description}
                        </p>
                      </div>
                      <Badge variant="outline">{vaccine.age}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outbreaks Tab */}
          <TabsContent value="outbreaks" className="space-y-6">
            <div className="grid gap-4">
              {outbreakAlerts.map((alert, index) => (
                <Card key={index} className="border-l-4 border-l-destructive">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        {alert.disease} - {alert.location}
                      </CardTitle>
                      <Badge variant={getSeverityColor(alert.severity)}>
                        {getTranslation("severity")}: {alert.severity}
                      </Badge>
                    </div>
                    <CardDescription>{alert.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{alert.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education" className="space-y-6">
            <div className="grid gap-6">
              {diseaseInfo.map((disease, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-healthcare-green" />
                      {disease.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-destructive mb-2">
                        {getTranslation("symptoms")}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {disease.symptoms.map((symptom, idx) => (
                          <Badge key={idx} variant="destructive">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-healthcare-green mb-2">
                        {getTranslation("prevention")}:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {disease.prevention.map((tip, idx) => (
                          <Badge key={idx} variant="secondary">
                            {tip}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-healthcare-blue mb-2">
                        {getTranslation("treatment")}:
                      </h4>
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {disease.treatment}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
