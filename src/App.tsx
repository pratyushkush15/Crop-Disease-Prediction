import React, { useState, useEffect } from 'react';
import { Leaf, Wifi, WifiOff } from 'lucide-react';
import { ImageUpload } from './components/ImageUpload';
import { DiagnosisResults } from './components/DiagnosisResults';
import { Dashboard } from './components/Dashboard';
import { History } from './components/History';
import { LanguageSelector } from './components/LanguageSelector';
import { DiagnosisResult } from './types';
import { translations } from './utils/translations';
import { saveDiagnosis, getDiagnosisHistory } from './utils/storage';

type AppView = 'dashboard' | 'upload' | 'results' | 'history';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [currentResult, setCurrentResult] = useState<DiagnosisResult | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiagnosisResult[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const t = translations[currentLanguage as keyof typeof translations];

  useEffect(() => {
    setDiagnosisHistory(getDiagnosisHistory());
    
    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleDiagnosisComplete = (result: DiagnosisResult) => {
    setCurrentResult(result);
    saveDiagnosis(result);
    setDiagnosisHistory(getDiagnosisHistory());
    setCurrentView('results');
  };

  const handleHistoryUpdate = () => {
    setDiagnosisHistory(getDiagnosisHistory());
  };

  const handleNewDiagnosis = () => {
    setCurrentView('upload');
    setCurrentResult(null);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setCurrentResult(null);
  };

  const handleViewHistory = () => {
    setCurrentView('history');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-green-100">
      {/* Background Pattern */}
      <div 
        className="fixed inset-0 opacity-5 bg-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/257840/pexels-photo-257840.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
          backgroundSize: '400px 300px'
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t.appTitle}
                </h1>
                <p className="text-sm text-gray-600 hidden sm:block">
                  {t.tagline}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Online/Offline Indicator */}
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {isOnline ? (
                  <>
                    <Wifi className="w-4 h-4" />
                    Online
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4" />
                    Offline
                  </>
                )}
              </div>
              
              <LanguageSelector
                currentLanguage={currentLanguage}
                onLanguageChange={setCurrentLanguage}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            onNewDiagnosis={handleNewDiagnosis}
            onViewHistory={handleViewHistory}
            recentDiagnoses={diagnosisHistory}
            translations={t}
          />
        )}
        
        {currentView === 'upload' && (
          <ImageUpload
            onDiagnosisComplete={handleDiagnosisComplete}
            translations={t}
          />
        )}
        
        {currentView === 'results' && currentResult && (
          <DiagnosisResults
            result={currentResult}
            onBack={handleBackToDashboard}
            translations={t}
          />
        )}
        
        {currentView === 'history' && (
          <History
            onBack={handleBackToDashboard}
            history={diagnosisHistory}
            onHistoryUpdate={handleHistoryUpdate}
            translations={t}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Leaf className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold">Plant Health Center</h3>
              </div>
              <p className="text-gray-400">
                Empowering farmers with AI-driven plant disease diagnosis and treatment recommendations.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={handleNewDiagnosis} className="hover:text-white transition-colors">New Diagnosis</button></li>
                <li><button onClick={handleViewHistory} className="hover:text-white transition-colors">History</button></li>
                <li><button onClick={handleBackToDashboard} className="hover:text-white transition-colors">Dashboard</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency: +1-800-PLANT-911</li>
                <li>Support: support@planthealth.com</li>
                <li>Available 24/7 for critical cases</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Plant Health Center. Powered by advanced AI technology.</p>
            <p className="text-sm mt-2">
              {isOnline 
                ? 'All features available - Connected to AI services' 
                : 'Offline mode - Some features may be limited'
              }
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;