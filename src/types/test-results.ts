export interface TestCase {
  status: 'success' | 'failed' | 'error' | 'skipped';
  name: string;
  classname: string;
  file: string | null;
  execution_time: number;
  system_output: string | null;
  stack_trace: string | null;
  recent_failures: any | null;
}

export interface TestSuite {
  name: string;
  total_time: number;
  total_count: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  error_count: number;
  suite_error: any | null;
  test_cases: TestCase[];
}

export interface TestResults {
  sha: string;
  created_at: string;
  pipeline_id?: string;
  total_time: number;
  total_count: number;
  success_count: number;
  failed_count: number;
  skipped_count: number;
  error_count: number;
  test_suites: TestSuite[];
}