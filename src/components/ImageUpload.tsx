import React, { useCallback, useState } from 'react';
import { Upload, Camera, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { analyzePlantImage } from '../utils/plantDiseaseAI';
import { DiagnosisResult } from '../types';

interface ImageUploadProps {
  onDiagnosisComplete: (result: DiagnosisResult) => void;
  translations: any;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onDiagnosisComplete, translations }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    setError('');
    setIsProcessing(true);

    try {
      const result = await analyzePlantImage(file);
      onDiagnosisComplete(result);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [onDiagnosisComplete]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, [handleFileUpload]);

  const handleCameraCapture = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // Use rear camera on mobile
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFileUpload(target.files[0]);
      }
    };
    input.click();
  }, [handleFileUpload]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <ImageIcon className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {translations.upload.title}
        </h2>
        <p className="text-lg text-gray-600">
          {translations.upload.subtitle}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
          isDragOver
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
        } ${isProcessing ? 'pointer-events-none opacity-60' : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
      >
        {isProcessing ? (
          <div className="text-center py-8">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {translations.upload.processing}
            </h3>
            <p className="text-gray-600">
              Our AI is analyzing your plant image...
            </p>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center gap-4 mb-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
                <Upload className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
                <Camera className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {translations.upload.dragDrop}
            </h3>
            
            <p className="text-gray-600 mb-6">
              {translations.upload.or}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <label className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer">
                <Upload className="w-5 h-5" />
                {translations.upload.clickToSelect}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={handleCameraCapture}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              {translations.upload.formats}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <h4 className="font-semibold text-amber-800 mb-2">📸 Best Results Tips:</h4>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• Take photos in good natural light</li>
          <li>• Focus on affected leaves and symptoms</li>
          <li>• Include both healthy and affected parts</li>
          <li>• Avoid blurry or distant images</li>
          <li>• Clean the lens before taking photos</li>
        </ul>
      </div>
    </div>
  );
};