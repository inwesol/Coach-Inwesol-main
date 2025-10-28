// components/ClientSummaryModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X, Save, Loader } from 'lucide-react';

interface ClientSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
  sessionId: number;
  clientName: string;
}

export default function ClientSummaryModal({
  isOpen,
  onClose,
  clientId,
  sessionId,
  clientName
}: ClientSummaryModalProps) {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Fetch existing summary on modal open
  useEffect(() => {
    if (isOpen && clientId && sessionId !== null) {
      fetchExistingSummary();
    }
  }, [isOpen, clientId, sessionId]);

  const fetchExistingSummary = async () => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/client-summary?clientId=${clientId}&sessionId=${sessionId}`
      );
      const data = await response.json();

      if (response.ok && data.data) {
        setSummary(data.data.summary || '');
      } else if (!response.ok && data.error !== 'No summary found') {
        throw new Error(data.error || 'Failed to fetch summary');
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch summary');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSaveSummary = async () => {
    if (!summary.trim()) {
      setError('Summary cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/client-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId,
          sessionId,
          summary: summary.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save summary');
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving summary:', err);
      setError(err instanceof Error ? err.message : 'Failed to save summary');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center text-white">
            <h2 className="text-2xl font-bold">Session Summary</h2>
            <p className="text-sm text-white/80 mt-1">
              {clientName} - Session {sessionId}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {isFetching ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                  <p className="text-green-600 text-sm font-medium">
                    ✓ Summary saved successfully!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Summary Notes
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Write your session summary here... Include key points, client progress, action items, and any important observations."
                  className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
                <p className="text-xs text-gray-500">
                  Character count: {summary.length}
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
          <button
            onClick={handleSaveSummary}
            disabled={isLoading || isFetching || !summary.trim()}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Save Summary</span>
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}