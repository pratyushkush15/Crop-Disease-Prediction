import { Disease, DiagnosisResult } from '../types';

export const analyzePlantImage = async (imageFile: File): Promise<DiagnosisResult> => {
  const apiUrl = '/api/predict';
  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const imageBase64 = await fileToBase64(imageFile);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    return mapApiResponseToDiagnosisResult(data.prediction, imageBase64, imageFile.name);

  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};


const mapApiResponseToDiagnosisResult = (
  prediction: any,
  imageBase64: string,
  imageName: string
): DiagnosisResult => {
  const imageUrl = imageBase64;

  let cropName = 'Unknown Crop';
  let diseaseName = prediction.disease_name;

  if (prediction.disease_name && prediction.disease_name.includes(' - ')) {
    const parts = prediction.disease_name.split(' - ');
    cropName = parts[0];
    diseaseName = parts.slice(1).join(' - ');
  }

  const disease: Disease = {
    id: prediction.disease_name.replace(/\s+/g, '-'),
    name: diseaseName,
    scientificName: 'N/A',
    confidence: prediction.confidence,
    description: prediction.description,
    severity: 'undetermined',
    symptoms: prediction.symptoms || [],
    causes: ['See description.'],
    prevention: prediction.prevention || [],
    remedies: prediction.remedies || [], // Changed from 'treatment'
    organicTreatment: [],
    chemicalTreatment: [],
    timeline: 'undetermined',
    affectedCrops: [cropName],
  };

  const result: DiagnosisResult = {
    id: Date.now().toString(),
    timestamp: new Date(),
    imageUrl,
    imageName,
    diseases: [disease],
    primaryDisease: disease,
    recommendations: {
      immediate: ['Isolate affected plants.', 'Apply recommended treatment.'],
      shortTerm: ['Monitor surrounding plants daily.'],
      longTerm: ['Consider planting resistant varieties next season.'],
    },
  };

  return result;
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const saveOfflineData = (data: DiagnosisResult) => {
  const offlineData = JSON.parse(localStorage.getItem('offlineDiagnoses') || '[]');
  offlineData.push(data);
  localStorage.setItem('offlineDiagnoses', JSON.stringify(offlineData));
};

export const getOfflineData = (): DiagnosisResult[] => {
  return JSON.parse(localStorage.getItem('offlineDiagnoses') || '[]');
};