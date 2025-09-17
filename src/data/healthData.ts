export interface VaccinationSchedule {
  vaccine: string;
  age: string;
  description: string;
}

export interface OutbreakAlert {
  disease: string;
  location: string;
  severity: "low" | "medium" | "high";
  date: string;
  description: string;
}

export interface DiseaseInfo {
  name: string;
  symptoms: string[];
  prevention: string[];
  treatment: string;
}

export interface ChatResponse {
  keywords: string[];
  response: {
    en: string;
    hi: string;
    te: string;
  };
}

export const vaccinationSchedule: VaccinationSchedule[] = [
  { vaccine: "BCG", age: "At birth", description: "Protection against tuberculosis" },
  { vaccine: "Hepatitis B", age: "At birth, 6 weeks, 14 weeks", description: "Protection against Hepatitis B" },
  { vaccine: "OPV", age: "6 weeks, 10 weeks, 14 weeks", description: "Oral Polio Vaccine" },
  { vaccine: "DPT", age: "6 weeks, 10 weeks, 14 weeks", description: "Diphtheria, Pertussis, Tetanus" },
  { vaccine: "Measles", age: "9 months", description: "Protection against measles" },
  { vaccine: "MMR", age: "12-15 months", description: "Measles, Mumps, Rubella" },
  { vaccine: "Chickenpox", age: "12-18 months", description: "Protection against chickenpox" },
  { vaccine: "Typhoid", age: "2 years", description: "Protection against typhoid fever" },
];

export const outbreakAlerts: OutbreakAlert[] = [
  {
    disease: "Dengue",
    location: "Guntur District",
    severity: "high",
    date: "2024-01-15",
    description: "⚠️ High dengue cases reported. Take preventive measures."
  },
  {
    disease: "Malaria",
    location: "Visakhapatnam",
    severity: "medium",
    date: "2024-01-10",
    description: "🦟 Increased malaria cases. Use mosquito nets and repellents."
  },
  {
    disease: "Chikungunya",
    location: "Hyderabad",
    severity: "low",
    date: "2024-01-08",
    description: "⚡ Few chikungunya cases detected. Stay alert."
  }
];

export const diseaseInfo: DiseaseInfo[] = [
  {
    name: "Malaria",
    symptoms: ["High fever", "Chills", "Headache", "Nausea", "Vomiting"],
    prevention: ["Use mosquito nets", "Apply repellents", "Remove stagnant water", "Wear full sleeves"],
    treatment: "Consult doctor immediately for antimalarial medication"
  },
  {
    name: "Dengue",
    symptoms: ["High fever", "Severe headache", "Joint pain", "Rash", "Low platelet count"],
    prevention: ["Remove stagnant water", "Use mosquito repellents", "Wear protective clothing"],
    treatment: "Rest, fluids, paracetamol. Avoid aspirin. Consult doctor."
  },
  {
    name: "Diabetes",
    symptoms: ["Frequent urination", "Excessive thirst", "Fatigue", "Blurred vision"],
    prevention: ["Regular exercise", "Healthy diet", "Weight management", "Regular checkups"],
    treatment: "Blood sugar monitoring, medication, lifestyle changes"
  }
];

export const chatResponses: ChatResponse[] = [
  {
    keywords: ["malaria", "symptoms", "fever"],
    response: {
      en: "Malaria symptoms include high fever, chills, headache, nausea, and vomiting. Please consult a doctor if you experience these symptoms.",
      hi: "मलेरिया के लक्षण हैं तेज बुखार, ठंड लगना, सिरदर्द, मतली और उल्टी। यदि आपको ये लक्षण दिखाई दें तो कृपया डॉक्टर से संपर्क करें।",
      te: "మలేరియా లక్షణాలు అధిక జ్వరం, వణుకు, తలనొప్పి, వికారం మరియు వాంతులు. ఈ లక్షణాలు కనిపిస్తే దయచేసి వైద్యుడిని సంప్రదించండి."
    }
  },
  {
    keywords: ["dengue", "prevention", "mosquito"],
    response: {
      en: "To prevent dengue: Remove stagnant water, use mosquito repellents, wear protective clothing, and maintain clean surroundings.",
      hi: "डेंगू से बचाव के लिए: स्थिर पानी हटाएं, मच्छर भगाने वाली दवा का उपयोग करें, सुरक्षात्मक कपड़े पहनें और साफ-सुथरा वातावरण बनाए रखें।",
      te: "డెంగీ నివారణ కోసం: నిలబడిన నీటిని తొలగించండి, దోమల వికర్షణలను ఉపయోగించండి, రక్షణ దుస్తులు ధరించండి మరియు పరిసర ప్రాంతాలను శుభ్రంగా ఉంచండి."
    }
  },
  {
    keywords: ["healthy", "diet", "nutrition"],
    response: {
      en: "A healthy diet includes fresh fruits, vegetables, whole grains, lean proteins, and plenty of water. Limit processed foods and sugar.",
      hi: "स्वस्थ आहार में ताजे फल, सब्जियां, साबुत अनाज, दुबला प्रोटीन और भरपूर पानी शामिल है। प्रसंस्कृत खाद्य पदार्थ और चीनी सीमित करें।",
      te: "ఆరోగ్యకరమైన ఆహారంలో తాజా పండ్లు, కూరగాయలు, తృణధాన్యాలు, కొవ్వు లేని ప్రోటీన్లు మరియు పుష్కలంగా నీరు ఉంటాయి. ప్రాసెస్ చేసిన ఆహారాలు మరియు చక్కెరను పరిమితం చేయండి."
    }
  },
  {
    keywords: ["vaccination", "child", "schedule"],
    response: {
      en: "Children need vaccinations at birth (BCG, Hepatitis B), 6 weeks (OPV, DPT), 9 months (Measles), and more. Please share your child's age for specific recommendations.",
      hi: "बच्चों को जन्म के समय (बीसीजी, हेपेटाइटिस बी), 6 सप्ताह (ओपीवी, डीपीटी), 9 महीने (खसरा) और अधिक पर टीकाकरण की आवश्यकता होती है। विशिष्ट सिफारिशों के लिए कृपया अपने बच्चे की उम्र साझा करें।",
      te: "పిల్లలకు జన్మ సమయంలో (BCG, హెపటైటిస్ B), 6 వారాలలో (OPV, DPT), 9 నెలలలో (మీజిల్స్) మరియు మరిన్ని టీకాలు అవసరం. నిర్దిష్ట సిఫార్సుల కోసం దయచేసి మీ పిల్లల వయస్సును పంచుకోండి."
    }
  }
];

export const quickReplies = [
  { en: "Malaria symptoms", hi: "मलेरिया के लक्षण", te: "మలేరియా లక్షణాలు" },
  { en: "Dengue prevention", hi: "डेंगू से बचाव", te: "డెంగీ నివారణ" },
  { en: "Healthy diet", hi: "स्वस्थ आहार", te: "ఆరోగ్యకర ఆహారం" },
  { en: "Vaccination schedule", hi: "टीकाकरण अनुसूची", te: "టీకా షెడ్యూల్" },
  { en: "Emergency help", hi: "आपातकालीन सहायता", te: "అత్యవసర సహాయం" }
];