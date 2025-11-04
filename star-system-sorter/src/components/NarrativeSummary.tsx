/**
 * Narrative Summary Component
 * 
 * Displays AI-generated personalized narrative about user's star system classification
 */

import React, { useState } from 'react';
import { useNarrative } from '../hooks/useNarrative';
import type { ClassificationResult } from '../lib/scorer';
import type { HDExtract } from '../lib/schemas';

interface NarrativeSummaryProps {
  classification: ClassificationResult;
  hdData: HDExtract;
}

export function NarrativeSummary({ classification, hdData }: NarrativeSummaryProps) {
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [forceRefresh, setForceRefresh] = useState(0);
  const { narrative, loading, error, cached } = useNarrative(classification, hdData, forceRefresh);
  
  const MAX_REGENERATIONS = 3;
  const canRegenerate = regenerateCount < MAX_REGENERATIONS;
  
  const handleRegenerate = () => {
    if (canRegenerate) {
      setRegenerateCount(prev => prev + 1);
      setForceRefresh(prev => prev + 1);
    }
  };
  
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-400 border-t-transparent" />
          <p className="text-purple-200 text-sm">
            {regenerateCount > 0 ? 'Regenerating your summary...' : 'Generating your personalized summary...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-900/20 rounded-lg p-6 border border-red-500/30">
        <p className="text-red-200 text-sm">
          Unable to generate narrative summary. {error}
        </p>
      </div>
    );
  }
  
  if (!narrative) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30 relative">
      {/* Cosmic decoration */}
      <div className="absolute top-4 right-4 text-2xl">🌌</div>
      
      {/* Title */}
      <h3 className="text-xl font-semibold text-purple-100 mb-4">
        Your Star System Signature
      </h3>
      
      {/* Narrative content */}
      <div className="prose prose-invert prose-purple max-w-none">
        <p 
          key={narrative} 
          className="text-purple-50 leading-relaxed whitespace-pre-wrap animate-fade-in"
        >
          {narrative}
        </p>
      </div>
      
      {/* Regenerate button */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={handleRegenerate}
          disabled={!canRegenerate || loading}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
            transition-all duration-200
            ${canRegenerate && !loading
              ? 'bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:scale-105'
              : 'bg-purple-900/20 text-purple-400/50 cursor-not-allowed'
            }
          `}
        >
          <span className="text-base">🔒</span>
          <span>Regenerate Summary</span>
          <span className="text-xs opacity-70">
            ({regenerateCount}/{MAX_REGENERATIONS})
          </span>
        </button>
        
        {!canRegenerate && (
          <span className="text-xs text-purple-300/50 italic">
            Premium feature • Limit reached
          </span>
        )}
      </div>
      
      {/* Footer note */}
      <div className="mt-4 pt-4 border-t border-purple-500/20">
        <p className="text-xs text-purple-300/70">
          Based on Human Design and the I Ching • Star system classification
          {cached && ' • Cached result'}
        </p>
      </div>
    </div>
  );
}
