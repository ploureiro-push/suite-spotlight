import { useState, useCallback, useEffect } from 'react';
import { TestRun, TrendData } from '@/types/test-history';
import { TestResults } from '@/types/test-results';

export function useTestHistory() {
  const [testRuns, setTestRuns] = useState<TestRun[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTestFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First, fetch the index file that lists all available test files
      const indexResponse = await fetch('/test-results/index.json');
      if (!indexResponse.ok) {
        throw new Error('Could not load test results index');
      }
      
      const fileList: string[] = await indexResponse.json();
      const runs: TestRun[] = [];
      
      // Fetch each test file
      for (const fileName of fileList) {
        try {
          const fileResponse = await fetch(`/test-results/${fileName}`);
          if (!fileResponse.ok) continue;
          
          const results = await fileResponse.json() as TestResults;
          
          // Extract run number from filename (e.g., "test_run_001.json" -> 1)
          const runNumberMatch = fileName.match(/(\d+)/);
          const runNumber = runNumberMatch ? parseInt(runNumberMatch[1], 10) : runs.length + 1;
          
          runs.push({
            id: `${fileName}-${runNumber}`,
            runNumber,
            fileName,
            timestamp: new Date(results.created_at),
            results
          });
        } catch (err) {
          console.error(`Error loading file ${fileName}:`, err);
        }
      }
      
      // Sort by run number
      runs.sort((a, b) => a.runNumber - b.runNumber);
      setTestRuns(runs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load test files');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load on mount and refresh every 30 seconds
  useEffect(() => {
    loadTestFiles();
    const interval = setInterval(loadTestFiles, 30000);
    return () => clearInterval(interval);
  }, [loadTestFiles]);

  const refreshFiles = useCallback(() => {
    loadTestFiles();
  }, [loadTestFiles]);

  return {
    testRuns,
    loading,
    error,
    refreshFiles
  };
}