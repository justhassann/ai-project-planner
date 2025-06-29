import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { PlanDisplay } from './components/PlanDisplay';
import { TrelloExportModal } from './components/TrelloExportModal';
import { generateProjectPlan, exportToTrello } from './services/api';
import { PlanGenerationRequest, ProjectPlan, TrelloBoard } from './types';

function App() {
  const [currentPlan, setCurrentPlan] = useState<ProjectPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showTrelloModal, setShowTrelloModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleGeneratePlan = async (request: PlanGenerationRequest) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const plan = await generateProjectPlan(request);
      setCurrentPlan(plan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToTrello = async (apiKey: string, token: string) => {
    if (!currentPlan) return;

    setIsExporting(true);
    setError(null);
    
    try {
      const board: TrelloBoard = await exportToTrello({
        plan: currentPlan,
        apiKey,
        token
      });
      
      setSuccessMessage(`🎉 Successfully created Trello board: "${board.name}"`);
      setShowTrelloModal(false);
      
      // Open the new board in a new tab
      window.open(board.url, '_blank');
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export to Trello');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{error}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setError(null)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{successMessage}</p>
              </div>
              <div className="ml-auto">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-green-500 hover:text-green-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        {!currentPlan && (
          <InputForm 
            onSubmit={handleGeneratePlan} 
            isLoading={isGenerating} 
          />
        )}

        {/* Plan Display */}
        {currentPlan && (
          <div className="space-y-6">
            <PlanDisplay 
              plan={currentPlan}
              onExportToTrello={() => setShowTrelloModal(true)}
              isExporting={isExporting}
            />
            
            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentPlan(null);
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
              >
                Create New Plan
              </button>
            </div>
          </div>
        )}

        {/* Trello Export Modal */}
        <TrelloExportModal
          isOpen={showTrelloModal}
          onClose={() => setShowTrelloModal(false)}
          onExport={handleExportToTrello}
          isLoading={isExporting}
        />
      </div>
    </div>
  );
}

export default App;