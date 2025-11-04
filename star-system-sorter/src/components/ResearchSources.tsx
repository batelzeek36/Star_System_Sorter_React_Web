import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  author: string;
  year: number;
  publisher: string;
  source_type: string;
  isbn?: string;
  url?: string;
  summary: string;
  astronomical_component: string;
  used_for: string;
}

interface SourcesData {
  core_sources: Source[];
  shadow_sources: Source[];
  all_sources: Source[];
  source_count: number;
}

interface ResearchSourcesProps {
  systemName: string;
  sources: SourcesData;
  coreThemes: string[];
}

const SOURCE_TYPE_LABELS: Record<string, string> = {
  ancient: 'Ancient Text',
  research: 'Academic Research',
  channeled: 'Channeled Material',
  esoteric: 'Esoteric Tradition',
  controversial: 'Controversial',
  unknown: 'Unknown'
};

const SOURCE_TYPE_COLORS: Record<string, string> = {
  ancient: 'bg-amber-100 text-amber-800 border-amber-300',
  research: 'bg-blue-100 text-blue-800 border-blue-300',
  channeled: 'bg-purple-100 text-purple-800 border-purple-300',
  esoteric: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  controversial: 'bg-red-100 text-red-800 border-red-300',
  unknown: 'bg-gray-100 text-gray-800 border-gray-300'
};

export const ResearchSources: React.FC<ResearchSourcesProps> = ({
  systemName,
  sources,
  coreThemes
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAllSources, setShowAllSources] = useState(false);

  const displaySources = showAllSources 
    ? sources.all_sources 
    : sources.core_sources.slice(0, 5);

  return (
    <div className="mt-8 border border-lavender-300 rounded-lg bg-white/50 backdrop-blur-sm">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-lavender-50 transition-colors rounded-t-lg"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-lavender-600" />
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">
              Research Sources
            </h3>
            <p className="text-sm text-gray-600">
              {sources.source_count} academic sources • 862-1,656 hours of research
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-lavender-200">
          {/* Core themes */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">
              Core Themes for {systemName}:
            </h4>
            <ul className="space-y-1">
              {coreThemes.slice(0, 3).map((theme, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-lavender-500 mt-1">•</span>
                  <span>{theme}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Source list */}
          <div className="space-y-4">
            {displaySources.map((source, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-lavender-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h5 className="font-semibold text-gray-900">
                        {source.title}
                      </h5>
                      {source.url && (
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lavender-600 hover:text-lavender-700"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {source.author} ({source.year})
                    </p>
                    
                    {source.publisher && (
                      <p className="text-xs text-gray-500 mb-2">
                        {source.publisher}
                      </p>
                    )}
                    
                    <p className="text-sm text-gray-700 mb-3">
                      {source.summary}
                    </p>
                    
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs px-2 py-1 rounded border ${
                          SOURCE_TYPE_COLORS[source.source_type] || SOURCE_TYPE_COLORS.unknown
                        }`}
                      >
                        {SOURCE_TYPE_LABELS[source.source_type] || 'Unknown'}
                      </span>
                      
                      {source.isbn && (
                        <span className="text-xs text-gray-500">
                          ISBN: {source.isbn}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Show more/less button */}
          {sources.all_sources.length > 5 && (
            <button
              onClick={() => setShowAllSources(!showAllSources)}
              className="mt-4 w-full py-2 text-sm text-lavender-600 hover:text-lavender-700 font-medium"
            >
              {showAllSources 
                ? 'Show fewer sources' 
                : `Show all ${sources.all_sources.length} sources`}
            </button>
          )}

          {/* Methodology note */}
          <div className="mt-6 p-4 bg-lavender-50 rounded-lg border border-lavender-200">
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong>Research Standards:</strong> All sources are publisher-backed with ISBN or known imprint, 
              university press publications, peer-reviewed journals, or ancient texts with named translators. 
              This research represents 862-1,656 hours of academic-grade comparative mythology work, 
              not typical astrology blog content.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
