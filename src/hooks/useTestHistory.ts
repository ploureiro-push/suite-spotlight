import { useState, useCallback } from 'react';
import { TestHistory, TestRun, TrendData } from '@/types/test-history';
import { TestResults } from '@/types/test-results';

export function useTestHistory() {
  const [testHistory, setTestHistory] = useState<TestHistory>({
    runs: [],
    selectedRunId: null
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const extractRunNumber = (fileName: string): number => {
    const match = fileName.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  };

  const loadTestFiles = useCallback(async (files: FileList) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const runs: TestRun[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.name.endsWith('.json')) continue;
        
        try {
          const text = await file.text();
          const results = JSON.parse(text) as TestResults;
          const runNumber = extractRunNumber(file.name);
          
          runs.push({
            id: `${file.name}-${Date.now()}-${i}`,
            runNumber,
            fileName: file.name,
            timestamp: new Date(file.lastModified || Date.now()),
            results
          });
        } catch (err) {
          console.warn(`Failed to parse ${file.name}:`, err);
        }
      }
      
      if (runs.length === 0) {
        setError('No valid JSON test files found');
        return;
      }
      
      // Sort by run number
      runs.sort((a, b) => a.runNumber - b.runNumber);
      
      setTestHistory({
        runs,
        selectedRunId: runs[runs.length - 1]?.id || null // Select latest run
      });
      
    } catch (err) {
      setError('Failed to load test files');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const selectRun = useCallback((runId: string) => {
    setTestHistory(prev => ({
      ...prev,
      selectedRunId: runId
    }));
  }, []);

  const clearHistory = useCallback(() => {
    setTestHistory({
      runs: [],
      selectedRunId: null
    });
    setError(null);
  }, []);

  const getTrendData = useCallback((): TrendData[] => {
    return testHistory.runs.map(run => ({
      runNumber: run.runNumber,
      timestamp: run.timestamp,
      totalTests: run.results.total_count,
      successCount: run.results.success_count,
      failedCount: run.results.failed_count,
      errorCount: run.results.error_count,
      skippedCount: run.results.skipped_count,
      successRate: (run.results.success_count / run.results.total_count) * 100,
      totalTime: run.results.total_time,
      fileName: run.fileName
    }));
  }, [testHistory.runs]);

  const getSelectedRun = useCallback((): TestRun | null => {
    return testHistory.runs.find(run => run.id === testHistory.selectedRunId) || null;
  }, [testHistory]);

  return {
    testHistory,
    error,
    isLoading,
    loadTestFiles,
    selectRun,
    clearHistory,
    getTrendData,
    getSelectedRun
  };
}