import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Calendar,
  Filter,
  Trash2,
  Download,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { DiagnosisResult } from '../types';
import { deleteDiagnosis, exportToPDF } from '../utils/storage';

interface HistoryProps {
  onBack: () => void;
  history: DiagnosisResult[];
  onHistoryUpdate: () => void;
  translations: any;
}

export const History: React.FC<HistoryProps> = ({ 
  onBack, 
  history, 
  onHistoryUpdate,
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.primaryDisease.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.imageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = filterSeverity === 'all' || item.primaryDisease.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this diagnosis?')) {
      deleteDiagnosis(id);
      onHistoryUpdate();
    }
  };

  const handleBulkDelete = () => {
    if (selectedItems.length > 0 && 
        window.confirm(`Are you sure you want to delete ${selectedItems.length} selected items?`)) {
      selectedItems.forEach(id => deleteDiagnosis(id));
      setSelectedItems([]);
      onHistoryUpdate();
    }
  };

  const handleExport = async (diagnosis: DiagnosisResult) => {
    try {
      await exportToPDF(diagnosis);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {translations.history.title}
          </h1>
        </div>

        {selectedItems.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4" />
            Delete Selected ({selectedItems.length})
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by disease name or image name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* History List */}
      {filteredHistory.length > 0 ? (
        <div className="space-y-4">
          {filteredHistory.map((diagnosis) => (
            <div key={diagnosis.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(diagnosis.id)}
                    onChange={() => toggleSelection(diagnosis.id)}
                    className="mt-2 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  
                  {/* Image */}
                  <img
                    src={diagnosis.imageUrl}
                    alt={diagnosis.imageName}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  {/* Content */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {diagnosis.primaryDisease.name}
                        </h3>
                        <p className="text-gray-600 italic">
                          {diagnosis.primaryDisease.scientificName}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getSeverityColor(diagnosis.primaryDisease.severity)}`}>
                        {diagnosis.primaryDisease.severity === 'critical' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                        {translations.severity[diagnosis.primaryDisease.severity]}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {diagnosis.timestamp.toLocaleDateString()}
                      </div>
                      <div>
                        Confidence: <span className="font-medium text-green-600">
                          {(diagnosis.primaryDisease.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        Image: <span className="text-gray-900">{diagnosis.imageName}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {diagnosis.primaryDisease.symptoms.slice(0, 3).map((symptom, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded border border-red-200"
                        >
                          {symptom}
                        </span>
                      ))}
                      {diagnosis.primaryDisease.symptoms.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded border border-gray-200">
                          +{diagnosis.primaryDisease.symptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleExport(diagnosis)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                    
                    <button
                      onClick={() => handleDelete(diagnosis.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12">
          <div className="text-center">
            <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {history.length === 0 ? translations.history.noHistory : 'No matching results'}
            </h3>
            <p className="text-gray-600 mb-6">
              {history.length === 0 
                ? 'Start diagnosing plants to build your history'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {history.length === 0 && (
              <button
                onClick={onBack}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Start First Diagnosis
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};