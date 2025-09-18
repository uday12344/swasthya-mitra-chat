import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Pill, Clock, AlertTriangle, Shield, Package, Loader2, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MedicineInfo {
  name: string;
  genericName: string;
  uses: string[];
  dosage: {
    typical: string;
    timing: string;
    duration: string;
  };
  precautions: string[];
  sideEffects: string[];
  interactions: string[];
  storage: string;
  disclaimer: string;
}

interface PrescriptionMedicine {
  name: string;
  dosage: string;
  frequency: string;
  timings: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
  withFood: string;
  duration: string;
  notes: string;
}

interface PrescriptionTimings {
  medicines: PrescriptionMedicine[];
  summary: string;
}

export const MedicineInfo = () => {
  const [medicineName, setMedicineName] = useState('');
  const [medicineInfo, setMedicineInfo] = useState<MedicineInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Prescription upload & extraction state
  const [prescriptionImage, setPrescriptionImage] = useState<File | null>(null);
  const [prescriptionPreview, setPrescriptionPreview] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [prescriptionResult, setPrescriptionResult] = useState<PrescriptionTimings | null>(null);
  const prescriptionInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const searchMedicine = async () => {
    if (!medicineName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter a medicine name to search.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('medicine-info', {
        body: { medicineName: medicineName.trim() },
      });

      if (error) throw error;

      setMedicineInfo(data.medicineInfo);
      toast({
        title: 'Medicine Information Retrieved',
        description: 'Medicine details have been fetched successfully.',
      });
    } catch (error) {
      console.error('Medicine search error:', error);
      toast({
        title: 'Search Failed',
        description: 'Failed to retrieve medicine information. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrescriptionSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrescriptionImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrescriptionPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const extractPrescriptionTimings = async () => {
    if (!prescriptionImage) {
      toast({
        title: 'Missing Image',
        description: 'Please upload a prescription image.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('prescription-timings', {
          body: { imageBase64 },
        });

        if (error) throw error;

        setPrescriptionResult(data.timings);
        toast({
          title: 'Prescription Analyzed',
          description: 'Medicine timings have been extracted successfully.',
        });
      };
      reader.readAsDataURL(prescriptionImage);
    } catch (error) {
      console.error('Prescription extraction error:', error);
      toast({
        title: 'Extraction Failed',
        description: 'Failed to extract prescription timings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchMedicine();
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Search Section */}
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            Medicine Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Medicine Name</label>
            <Input
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Paracetamol, Aspirin, Amoxicillin..."
              disabled={isLoading}
            />
          </div>

          <Button
            onClick={searchMedicine}
            disabled={isLoading || !medicineName.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Get Medicine Info
              </>
            )}
          </Button>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-amber-800">
                <p className="font-medium mb-1">Important Disclaimer</p>
                <p>This information is for educational purposes only. Always consult your healthcare provider before taking any medication.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Medicine Information</CardTitle>
        </CardHeader>
        <CardContent>
          {medicineInfo ? (
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-xl font-semibold mb-2">{medicineInfo.name}</h3>
                <p className="text-muted-foreground">
                  <span className="font-medium">Generic Name:</span> {medicineInfo.genericName}
                </p>
              </div>

              {/* Uses */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-primary" />
                  Common Uses
                </h4>
                <div className="flex flex-wrap gap-2">
                  {medicineInfo.uses.map((use, index) => (
                    <Badge key={index} variant="secondary">
                      {use}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dosage */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2 text-blue-900">
                  <Clock className="w-4 h-4" />
                  Dosage Information
                </h4>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Typical Dose:</span>
                    <p className="text-blue-700">{medicineInfo.dosage.typical}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Timing:</span>
                    <p className="text-blue-700">{medicineInfo.dosage.timing}</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Duration:</span>
                    <p className="text-blue-700">{medicineInfo.dosage.duration}</p>
                  </div>
                </div>
              </div>

              {/* Precautions */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  Precautions
                </h4>
                <ul className="space-y-1">
                  {medicineInfo.precautions.map((precaution, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-amber-600 mt-0.5">•</span>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Side Effects */}
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  Common Side Effects
                </h4>
                <div className="flex flex-wrap gap-2">
                  {medicineInfo.sideEffects.map((effect, index) => (
                    <Badge key={index} variant="outline" className="border-red-200 text-red-700">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Interactions */}
              <div>
                <h4 className="font-medium mb-2">Drug/Food Interactions</h4>
                <ul className="space-y-1">
                  {medicineInfo.interactions.map((interaction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-orange-600 mt-0.5">•</span>
                      {interaction}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Storage */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium mb-1 flex items-center gap-2 text-green-900">
                  <Package className="w-4 h-4" />
                  Storage Instructions
                </h4>
                <p className="text-sm text-green-800">{medicineInfo.storage}</p>
              </div>

              {/* Disclaimer */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800 font-medium">{medicineInfo.disclaimer}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Pill className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No medicine information yet</p>
              <p>Enter a medicine name to get detailed information including uses, dosage, and precautions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};