import { DiagnosisResult } from '../types';

const STORAGE_KEY = 'plantDiagnosisHistory';

export const saveDiagnosis = (diagnosis: DiagnosisResult): void => {
  const existing = getDiagnosisHistory();
  const updated = [diagnosis, ...existing].slice(0, 50); // Keep last 50 diagnoses
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getDiagnosisHistory = (): DiagnosisResult[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return parsed.map((item: any) => ({
      ...item,
      timestamp: new Date(item.timestamp)
    }));
  } catch (error) {
    console.error('Error loading diagnosis history:', error);
    return [];
  }
};

export const deleteDiagnosis = (id: string): void => {
  const existing = getDiagnosisHistory();
  const filtered = existing.filter(d => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const clearDiagnosisHistory = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

// Export functionality
export const exportToPDF = async (diagnosis: DiagnosisResult): Promise<void> => {
  // This would integrate with a PDF generation library like jsPDF
  // For now, we'll create a printable version
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Plant Diagnosis Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #4ade80; padding-bottom: 20px; }
            .section { margin: 20px 0; }
            .disease-name { color: #dc2626; font-size: 24px; font-weight: bold; }
            .confidence { color: #059669; }
            .severity { padding: 4px 8px; border-radius: 4px; color: white; }
            .severity.high { background-color: #dc2626; }
            .severity.medium { background-color: #f59e0b; }
            .severity.low { background-color: #10b981; }
            .list-item { margin: 8px 0; }
            img { max-width: 300px; height: auto; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Plant Disease Diagnosis Report</h1>
            <p>Generated on: ${diagnosis.timestamp.toLocaleString()}</p>
        </div>
        
        <div class="section">
            <h2>Image Analysis</h2>
            <img src="${diagnosis.imageUrl}" alt="Plant image" />
            <p><strong>Image:</strong> ${diagnosis.imageName}</p>
        </div>
        
        <div class="section">
            <h2>Primary Diagnosis</h2>
            <div class="disease-name">${diagnosis.primaryDisease.name}</div>
            <p><em>${diagnosis.primaryDisease.scientificName}</em></p>
            <p class="confidence">Confidence: ${(diagnosis.primaryDisease.confidence * 100).toFixed(1)}%</p>
            <span class="severity ${diagnosis.primaryDisease.severity}">
                ${diagnosis.primaryDisease.severity.toUpperCase()} SEVERITY
            </span>
        </div>
        
        <div class="section">
            <h3>Description</h3>
            <p>${diagnosis.primaryDisease.description}</p>
        </div>
        
        <div class="section">
            <h3>Symptoms</h3>
            <ul>
                ${diagnosis.primaryDisease.symptoms.map(s => `<li class="list-item">${s}</li>`).join('')}
            </ul>
        </div>
        
        <div class="section">
            <h3>Treatment Recommendations</h3>
            <h4>Immediate Actions:</h4>
            <ul>
                ${diagnosis.recommendations.immediate.map(r => `<li class="list-item">${r}</li>`).join('')}
            </ul>
            
            <h4>Organic Treatment:</h4>
            <ul>
                ${diagnosis.primaryDisease.organicTreatment.map(t => `<li class="list-item">${t}</li>`).join('')}
            </ul>
        </div>
        
        <div class="section">
            <h3>Prevention for Future</h3>
            <ul>
                ${diagnosis.primaryDisease.prevention.map(p => `<li class="list-item">${p}</li>`).join('')}
            </ul>
        </div>
    </body>
    </html>
  `;
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};