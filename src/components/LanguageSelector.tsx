import React from 'react';
import { Globe } from 'lucide-react';
import { languages } from '../utils/translations';

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange
}) => {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200">
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(l => l.code === currentLanguage)?.nativeName}
        </span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[150px]">
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={`block w-full text-left px-4 py-3 hover:bg-green-50 transition-colors duration-150 ${
              currentLanguage === language.code 
                ? 'bg-green-100 text-green-800 font-medium' 
                : 'text-gray-700'
            }`}
          >
            <div className="font-medium">{language.nativeName}</div>
            <div className="text-xs text-gray-500">{language.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};