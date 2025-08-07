import { TestResults } from './test-results';

export interface TestRun {
  id: string;
  runNumber: number;
  fileName: string;
  timestamp: Date;
  results: TestResults;
}

export interface TestHistory {
  runs: TestRun[];
  selectedRunId: string | null;
}

export interface TrendData {
  runNumber: number;
  timestamp: Date;
  totalTests: number;
  successCount: number;
  failedCount: number;
  errorCount: number;
  skippedCount: number;
  successRate: number;
  totalTime: number;
  fileName: string;
}

export interface SuiteTrend {
  suiteName: string;
  data: Array<{
    runNumber: number;
    timestamp: Date;
    successRate: number;
    totalTime: number;
    testCount: number;
  }>;
}