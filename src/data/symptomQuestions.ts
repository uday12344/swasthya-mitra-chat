
export interface SymptomQuestion {
  id: string;
  question: {
    en: string;
    hi: string;
    te: string;
  };
  options: {
    id: string;
    text: {
      en: string;
      hi: string;
      te: string;
    };
  }[];
}

export const symptomQuestions: SymptomQuestion[] = [
  {
    id: "q1",
    question: {
      en: "What is your primary symptom?",
      hi: "आपका प्राथमिक लक्षण क्या है?",
      te: "మీ ప్రాధమిక లక్షణం ఏమిటి?",
    },
    options: [
      { id: "fever", text: { en: "Fever", hi: "बुखार", te: "జ్వరం" } },
      { id: "cough", text: { en: "Cough", hi: "खांसी", te: "దగ్గు" } },
      { id: "headache", text: { en: "Headache", hi: "सिरदर्द", te: "తలనొప్పి" } },
      { id: "fatigue", text: { en: "Fatigue", hi: "थकान", te: "అలసట" } },
    ],
  },
  {
    id: "q2",
    question: {
      en: "How long have you had this symptom?",
      hi: "आपको यह लक्षण कितने समय से है?",
      te: "మీకు ఈ లక్షణం ఎంతకాలంగా ఉంది?",
    },
    options: [
      { id: "less_than_a_day", text: { en: "Less than a day", hi: "एक दिन से कम", te: "ఒక రోజు కన్నా తక్కువ" } },
      { id: "1_3_days", text: { en: "1-3 days", hi: "1-3 दिन", te: "1-3 రోజులు" } },
      { id: "more_than_3_days", text: { en: "More than 3 days", hi: "3 दिन से ज्यादा", te: "3 రోజుల కన్నా ఎక్కువ" } },
    ],
  },
  {
    id: "q3",
    question: {
      en: "Are you experiencing any other symptoms?",
      hi: "क्या आप किसी अन्य लक्षण का अनुभव कर रहे हैं?",
      te: "మీరు ఏ ఇతర లక్షణాలను ఎదుర్కొంటున్నారు?",
    },
    options: [
      { id: "sore_throat", text: { en: "Sore throat", hi: "गले में खराश", te: "గొంతు మంట" } },
      { id: "runny_nose", text: { en: "Runny nose", hi: "बहती नाक", te: "ముక్కు కారటం" } },
      { id: "body_aches", text: { en: "Body aches", hi: "बदन दर्द", te: "శరీర నొప్పులు" } },
      { id: "none", text: { en: "None of the above", hi: "इनमे से कोई नहीं", te: "పైవేవీ కావు" } },
    ],
  },
];
