export interface Disease {
  id: string;
  name: string;
  scientificName: string;
  confidence: number;
  description: string;
  severity: string;
  symptoms: string[];
  causes: string[];
  prevention: string[];
  remedies: string[]; // Changed from 'treatment'
  organicTreatment: string[];
  chemicalTreatment: string[];
  timeline: string;
  affectedCrops: string[];
}

export interface DiagnosisResult {
  id: string;
  timestamp: Date;
  imageUrl: string;
  imageName: string;
  diseases: Disease[];
  primaryDisease: Disease;
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
}
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export interface ExtensionService {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  specialties: string[];
  emergencyAvailable: boolean;
}

export interface SeasonalAlert {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  startDate: Date;
  endDate: Date;
  affectedRegions: string[];
  preventionTips: string[];
}