import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Camera, CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FoodAnalysis {
  foodName: string;
  recommendation: 'good' | 'avoid' | 'moderate';
  nutritionalInfo: {
    calories: string;
    nutrients: string[];
    healthBenefits: string[];
  };
  advice: string;
  reasoning: string;
}

export const FoodAnalysis = () => {
  const [symptoms, setSymptoms] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async () => {
    if (!selectedImage || !symptoms.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide both symptoms and upload a food image.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('analyze-food', {
          body: { imageBase64, symptoms },
        });

        if (error) throw error;

        setAnalysis(data.analysis);
        toast({
          title: 'Analysis Complete',
          description: 'Food analysis has been completed successfully.',
        });
      };
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Food analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Failed to analyze the food image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendationIcon = (recommendation: string) => {
    switch (recommendation) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'avoid':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'avoid':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            Food Analysis Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Describe Your Symptoms</label>
            <Textarea
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="e.g., Acidity, headache, stomach pain, cold, fever..."
              className="min-h-[100px]"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Upload Food Image</label>
            <div className="border-2 border-dashed border-border rounded-lg p-4">
              {imagePreview ? (
                <div className="space-y-3">
                  <img
                    src={imagePreview}
                    alt="Selected food"
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Change Image
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <Button onClick={() => fileInputRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Food Image
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG, or WEBP up to 10MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <Button
            onClick={analyzeFood}
            disabled={isLoading || !selectedImage || !symptoms.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing Food...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Analyze Food
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{analysis.foodName}</h3>
                <div className="flex items-center gap-2">
                  {getRecommendationIcon(analysis.recommendation)}
                  <Badge className={getRecommendationColor(analysis.recommendation)}>
                    {analysis.recommendation.charAt(0).toUpperCase() + analysis.recommendation.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-medium mb-2">Advice for Your Symptoms</h4>
                <p className="text-sm">{analysis.advice}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Nutritional Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Calories:</span>
                    <span className="font-medium">{analysis.nutritionalInfo.calories}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Key Nutrients:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.nutritionalInfo.nutrients.map((nutrient, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {nutrient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Health Benefits:</span>
                    <ul className="text-sm mt-1 space-y-1">
                      {analysis.nutritionalInfo.healthBenefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">•</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-medium text-blue-900 mb-1">Reasoning</h4>
                <p className="text-sm text-blue-800">{analysis.reasoning}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Upload a food image and describe your symptoms to get AI-powered analysis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};