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
    const { imageBase64, symptoms } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `Analyze this food image for someone with these symptoms: "${symptoms}".

Provide a JSON response with:
{
  "foodName": "identified food name",
  "recommendation": "good" | "avoid" | "moderate",
  "nutritionalInfo": {
    "calories": "estimated calories per serving",
    "nutrients": ["key nutrients present"],
    "healthBenefits": ["benefits for general health"]
  },
  "advice": "specific advice for the symptoms mentioned",
  "reasoning": "why this food is good/bad for these symptoms"
}

Focus on Indian dietary context and Ayurvedic principles where relevant.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64.split(',')[1] // Remove data:image/jpeg;base64, prefix
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
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
    
    // Try to parse JSON response, fallback to structured response if parsing fails
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      analysis = {
        foodName: "Unknown Food",
        recommendation: "moderate",
        nutritionalInfo: {
          calories: "Unable to determine",
          nutrients: ["Analysis unavailable"],
          healthBenefits: ["Consult nutritionist"]
        },
        advice: "Unable to analyze properly. Please consult a healthcare provider.",
        reasoning: "Image analysis was inconclusive."
      };
    }

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-food function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});