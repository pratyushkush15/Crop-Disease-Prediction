import React from 'react';
import { DiagnosisResult } from '../types';
import { ShieldCheck, Zap, AlertTriangle, CheckCircle, BarChart, Microscope, Info, ArrowLeft } from 'lucide-react';

interface DiagnosisResultsProps {
  result: DiagnosisResult;
  onBack: () => void;
  translations: any;
}

export const DiagnosisResults: React.FC<DiagnosisResultsProps> = ({ result, onBack, translations }) => {
  const { primaryDisease, imageUrl, imageName } = result;

  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'text-green-600';
    if (confidence > 0.75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const InfoCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode; }> = ({ icon, title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 flex-shrink-0 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <div className="text-gray-700 space-y-2">{children}</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5" />
        {/* FIX: Use optional chaining and a default fallback text */}
        {translations?.results?.backToUpload ?? 'New Diagnosis'}
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img src={imageUrl} alt={imageName} className="rounded-lg w-full h-auto object-cover border border-gray-200" />
              <p className="text-sm text-gray-500 mt-2 text-center italic">{imageName}</p>
            </div>
            <div className="md:w-1/2">
              <p className="text-sm font-semibold text-green-600 uppercase mb-1">
                {/* FIX: Use optional chaining */}
                {translations?.results?.primaryDiagnosis ?? 'Primary Diagnosis'}
              </p>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                {primaryDisease.name}
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Affected crop: {primaryDisease.affectedCrops.join(', ')}
              </p>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3">
                  <BarChart className="w-6 h-6 text-gray-500" />
                  <div>
                    <p className="font-semibold text-gray-800">{translations?.results?.confidenceScore ?? 'Confidence Score'}</p>
                    <p className={`text-2xl font-bold ${getConfidenceColor(primaryDisease.confidence)}`}>
                      {(primaryDisease.confidence * 100).toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InfoCard icon={<Info className="w-6 h-6" />} title={translations?.results?.description ?? 'Description'}>
              <p>{primaryDisease.description}</p>
            </InfoCard>

            <InfoCard icon={<Microscope className="w-6 h-6" />} title={translations?.results?.symptoms ?? 'Symptoms'}>
              <ul className="list-disc list-inside space-y-1">
                {primaryDisease.symptoms.map((symptom, index) => <li key={index}>{symptom}</li>)}
              </ul>
            </InfoCard>
            
            <InfoCard icon={<ShieldCheck className="w-6 h-6" />} title={translations?.results?.prevention ?? 'Prevention'}>
              {primaryDisease.prevention.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {primaryDisease.prevention.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p>{translations?.results?.noPrevention ?? 'No prevention info.'}</p>
              )}
            </InfoCard>
            
            <InfoCard icon={<Zap className="w-6 h-6" />} title="Remedies">
              {primaryDisease.remedies.length > 0 ? (
                <ul className="list-disc list-inside space-y-1">
                  {primaryDisease.remedies.map((item, index) => <li key={index}>{item}</li>)}
                </ul>
              ) : (
                <p>{translations?.results?.noTreatment ?? 'No remedies info.'}</p> 
              )}
            </InfoCard>
            
          </div>
        </div>

        <div className="p-8 border-t border-gray-200">
           <InfoCard icon={<CheckCircle className="w-6 h-6" />} title={translations?.results?.recommendations?.title ?? 'Recommendations'}>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">{translations?.results?.recommendations?.immediate ?? 'Immediate'}</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                  {result.recommendations.immediate.map((rec, i) => <li key={`imm-${i}`}>{rec}</li>)}
                </ul>
                <h4 className="font-bold text-gray-800 mb-2">{translations?.results?.recommendations?.shortTerm ?? 'Short-Term'}</h4>
                <ul className="list-disc list-inside space-y-1 mb-4">
                   {result.recommendations.shortTerm.map((rec, i) => <li key={`st-${i}`}>{rec}</li>)}
                </ul>
                 <h4 className="font-bold text-gray-800 mb-2">{translations?.results?.recommendations?.longTerm ?? 'Long-Term'}</h4>
                <ul className="list-disc list-inside space-y-1">
                   {result.recommendations.longTerm.map((rec, i) => <li key={`lt-${i}`}>{rec}</li>)}
                </ul>
              </div>
            </InfoCard>
        </div>

        
      </div>
    </div>
  );
};