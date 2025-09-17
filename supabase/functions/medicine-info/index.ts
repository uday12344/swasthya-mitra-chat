import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicineName } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Provide medicine information for "${medicineName}". Return a JSON response with:

{
  "name": "medicine name",
  "genericName": "generic/scientific name",
  "uses": ["primary uses"],
  "dosage": {
    "typical": "typical dosage",
    "timing": "when to take (e.g., after meals, twice daily)",
    "duration": "typical treatment duration"
  },
  "precautions": ["important precautions"],
  "sideEffects": ["common side effects"],
  "interactions": ["drug/food interactions"],
  "storage": "how to store",
  "disclaimer": "Always consult your doctor before taking any medication"
}

Focus on Indian pharmaceutical context. If the medicine is not recognized, indicate so clearly.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      console.error('Gemini API error:', await response.text());
      return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    
    // Try to parse JSON response
    let medicineInfo;
    try {
      medicineInfo = JSON.parse(aiResponse);
    } catch {
      medicineInfo = {
        name: medicineName,
        genericName: "Unknown",
        uses: ["Information not available"],
        dosage: {
          typical: "Consult your doctor",
          timing: "As prescribed",
          duration: "As prescribed"
        },
        precautions: ["Always consult your healthcare provider"],
        sideEffects: ["Information not available"],
        interactions: ["Consult pharmacist"],
        storage: "Store as per package instructions",
        disclaimer: "Always consult your doctor before taking any medication"
      };
    }

    return new Response(JSON.stringify({ medicineInfo }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in medicine-info function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});