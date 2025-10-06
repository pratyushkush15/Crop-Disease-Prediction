import React from 'react';
import {
  Camera,
  History,
  Phone,
  AlertTriangle,
  Clock,
  TrendingUp,
  MapPin,
  Calendar,
  Thermometer,
  Droplets
} from 'lucide-react';
import { DiagnosisResult, SeasonalAlert, ExtensionService } from '../types';

interface DashboardProps {
  onNewDiagnosis: () => void;
  onViewHistory: () => void;
  recentDiagnoses: DiagnosisResult[];
  translations: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNewDiagnosis,
  onViewHistory,
  recentDiagnoses,
  translations
}) => {
  // Mock data for seasonal alerts
  const seasonalAlerts: SeasonalAlert[] = [
    {
      id: '1',
      title: 'Late Blight Warning',
      description: 'High humidity and cool temperatures favor late blight development in tomatoes and potatoes.',
      severity: 'warning',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      affectedRegions: ['Northeast', 'Pacific Northwest'],
      preventionTips: [
        'Ensure good air circulation',
        'Avoid overhead watering',
        'Apply preventive copper sprays'
      ]
    },
    {
      id: '2',
      title: 'Aphid Season Peak',
      description: 'Aphid populations typically peak during warm, dry conditions. Monitor plants closely.',
      severity: 'info',
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      affectedRegions: ['Midwest', 'Southeast'],
      preventionTips: [
        'Introduce beneficial insects',
        'Use reflective mulch',
        'Regular inspection of plants'
      ]
    }
  ];

  // Mock extension services
  const extensionServices: ExtensionService[] = [
    {
      id: '1',
      name: 'County Agricultural Extension',
      phone: '+1-555-FARM-HELP',
      email: 'help@countyextension.gov',
      address: '123 Agriculture Blvd, Your County',
      specialties: ['Disease Diagnosis', 'Pest Control', 'Soil Testing'],
      emergencyAvailable: true
    },
    {
      id: '2',
      name: 'University Plant Clinic',
      phone: '+1-555-PLANT-DOC',
      email: 'clinic@university.edu',
      address: '456 Research Drive, University Town',
      specialties: ['Advanced Diagnostics', 'Research Studies'],
      emergencyAvailable: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-300 text-red-800';
      case 'warning': return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'info': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Welcome Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Plant Health Center
        </h1>
        <p className="text-xl text-gray-600">
          Your AI-powered companion for plant disease diagnosis and management
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <button
          onClick={onNewDiagnosis}
          className="group p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-1">
                {translations.actions.diagnose}
              </h3>
              <p className="text-green-100">
                Upload or capture a photo for instant AI diagnosis
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={onViewHistory}
          className="group p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors duration-200">
                <History className="w-6 h-6" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold mb-1">
                {translations.actions.viewHistory}
              </h3>
              <p className="text-blue-100">
                Review past diagnoses and track treatment progress
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Weather & Season Info */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-orange-500" />
          Current Growing Conditions
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <Thermometer className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-700">72°F</div>
            <div className="text-sm text-orange-600">Temperature</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Droplets className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">65%</div>
            <div className="text-sm text-blue-600">Humidity</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">Fair</div>
            <div className="text-sm text-green-600">Disease Risk</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">Spring</div>
            <div className="text-sm text-purple-600">Growing Season</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Diagnoses */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {translations.dashboard.recentDiagnoses}
          </h2>
          {recentDiagnoses.length > 0 ? (
            <div className="space-y-4">
              {recentDiagnoses.slice(0, 3).map((diagnosis) => (
                <div key={diagnosis.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={diagnosis.imageUrl}
                    alt={diagnosis.imageName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-900">
                      {diagnosis.primaryDisease.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {diagnosis.timestamp.toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    diagnosis.primaryDisease.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    diagnosis.primaryDisease.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    diagnosis.primaryDisease.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {diagnosis.primaryDisease.severity}
                  </div>
                </div>
              ))}
              <button
                onClick={onViewHistory}
                className="w-full text-center py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                View All →
              </button>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No diagnoses yet</p>
              <p className="text-sm">Start by uploading your first plant image</p>
            </div>
          )}
        </div>

        {/* Seasonal Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {translations.dashboard.seasonalAlerts}
          </h2>
          <div className="space-y-4">
            {seasonalAlerts.map((alert) => (
              <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{alert.title}</h4>
                  <span className="text-xs opacity-75 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {Math.ceil((alert.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
                  </span>
                </div>
                <p className="text-sm mb-2">{alert.description}</p>
                <div className="flex items-center gap-2 text-xs opacity-75">
                  <MapPin className="w-3 h-3" />
                  {alert.affectedRegions.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extension Services */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-green-500" />
          {translations.dashboard.extensionServices}
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {extensionServices.map((service) => (
            <div key={service.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                {service.emergencyAvailable && (
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                    24/7 Emergency
                  </span>
                )}
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{service.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{service.address}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {service.specialties.map((specialty, index) => (
                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};