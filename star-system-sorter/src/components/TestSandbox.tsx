/**
 * Temporary Test Sandbox Component
 * Used to verify API integration and caching behavior
 */

import { useEffect, useState } from 'react';
import { computeHDExtractWithCache } from '../api/bodygraph-client';
import type { BirthDataAPIRequest, HDExtract } from '../lib/schemas';

export function TestSandbox() {
  const [data, setData] = useState<HDExtract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [callCount, setCallCount] = useState(0);

  const testRequest: BirthDataAPIRequest = {
    dateISO: '1990-01-15',
    time: '14:30',
    timeZone: 'America/New_York',
  };

  const fetchData = async () => {
    console.log(`[TestSandbox] Fetch attempt #${callCount + 1}`);
    console.log('[TestSandbox] Request:', testRequest);
    
    try {
      const result = await computeHDExtractWithCache(testRequest);
      console.log('[TestSandbox] Success:', result);
      setData(result);
      setCallCount(prev => prev + 1);
      setError(null);
    } catch (err) {
      console.error('[TestSandbox] Error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    console.log('[TestSandbox] Component mounted');
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      border: '2px solid orange', 
      margin: '20px',
      fontFamily: 'monospace'
    }}>
      <h2>🧪 Test Sandbox</h2>
      <p>Testing computeHDExtractWithCache() integration</p>
      
      <div style={{ marginTop: '10px' }}>
        <button 
          onClick={fetchData}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Fetch HD Data (Call #{callCount + 1})
        </button>
        
        <button 
          onClick={() => {
            localStorage.clear();
            console.log('[TestSandbox] localStorage cleared');
            alert('localStorage cleared! Next fetch will hit API.');
          }}
          style={{ 
            padding: '10px 20px', 
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Clear Cache
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          padding: '10px', 
          backgroundColor: '#ffebee',
          color: '#c62828'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: '20px' }}>
          <h3>✅ Data Received (Call #{callCount})</h3>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '10px',
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p><strong>Instructions:</strong></p>
        <ol>
          <li>Open DevTools Network tab</li>
          <li>Click "Fetch HD Data" - should see POST to /api/hd</li>
          <li>Click "Fetch HD Data" again - should NOT see network request (cache hit)</li>
          <li>Check localStorage for cache entry (hd-cache-*)</li>
          <li>Click "Clear Cache" then fetch again - should see POST to /api/hd</li>
        </ol>
      </div>
    </div>
  );
}
