import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestSuiteCard } from './TestSuiteCard';
import { TestRun } from '@/types/test-history';
import { FileText, TestTube } from 'lucide-react';

interface TestSuiteBreakdownProps {
  testRuns: TestRun[];
}

export function TestSuiteBreakdown({ testRuns }: TestSuiteBreakdownProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TestTube className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Test Suite Breakdown by Run</h2>
      </div>
      
      {testRuns.map((run) => (
        <Card key={run.id} className="shadow-soft border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <CardTitle className="text-lg">Run #{run.runNumber}</CardTitle>
                  <p className="text-sm text-muted-foreground">{run.fileName}</p>
                </div>
              </div>
              <div className="text-right text-sm text-muted-foreground">
                <p>{formatDate(run.timestamp)}</p>
                <p>{run.results.total_count} tests • {formatTime(run.results.total_time)}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {run.results.test_suites.map((suite, index) => (
                <TestSuiteCard key={`${run.id}-${index}`} suite={suite} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}