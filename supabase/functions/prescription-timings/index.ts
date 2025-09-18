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
    const { imageBase64 } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are a medical assistant. Extract medicine schedule from the prescription image.

Strictly return JSON only with this exact shape:
{
  "medicines": [
    {
      "name": "Medicine name with strength",
      "dosage": "e.g., 1 tablet, 5 ml, 1 cap",
      "frequency": "e.g., once daily, twice daily, thrice daily",
      "timings": { "morning": true, "afternoon": false, "evening": true, "night": false },
      "withFood": "before food | after food | with food | unspecified",
      "duration": "e.g., 5 days, 1 week",
      "notes": "any special notes like if fever >101, SOS, etc."
    }
  ],
  "summary": "human friendly summary of the schedule"
}

Guidelines:
- If handwriting is unclear, make your best clinical guess and mark uncertain notes in "notes".
- Map typical shorthand: BD=twice daily, TDS=thrice daily, OD=once daily, HS=at night, SOS=as needed.
- Convert dots/marks around timings into booleans for morning/afternoon/evening/night.
- Assume adult dosing unless clearly pediatric.`;

    const mimeMatch = imageBase64?.match(/^data:(image\/[^;]+);base64,/);
    const mimeType = mimeMatch?.[1] || 'image/jpeg';
    const base64Data = imageBase64?.includes(',') ? imageBase64.split(',')[1] : imageBase64;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Data } }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
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
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Clean potential markdown fences
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : cleaned || '{}';

    let timings;
    try {
      timings = JSON.parse(jsonString);
    } catch (e) {
      console.error('JSON parse failed, using fallback:', e, cleaned);
      timings = {
        medicines: [],
        summary: 'Unable to confidently extract timings. Please upload a clearer photo.'
      };
    }

    return new Response(JSON.stringify({ timings }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in prescription-timings function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
