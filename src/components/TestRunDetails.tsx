import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestRun } from '@/types/test-history';
import { TestSuiteDetails } from './TestSuiteDetails';
import { StatsOverview } from './StatsOverview';
import { FileText, GitCommit, Calendar, Hash } from 'lucide-react';

interface TestRunDetailsProps {
  testRun: TestRun;
}

export function TestRunDetails({ testRun }: TestRunDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Test Run Header */}
      <Card className="shadow-strong border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">Test Run #{testRun.runNumber}</CardTitle>
                <p className="text-sm text-muted-foreground">{testRun.fileName}</p>
              </div>
            </div>
            <Badge variant="outline">{testRun.results.test_suites.length} suites</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <GitCommit className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Commit SHA</p>
                <p className="text-sm font-mono text-muted-foreground">
                  {testRun.results.sha.slice(0, 8)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Pipeline Start</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(testRun.results.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            
            {testRun.results.pipeline_id && (
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Pipeline ID</p>
                  <p className="text-sm font-mono text-muted-foreground">
                    {testRun.results.pipeline_id}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Overall Stats */}
          <StatsOverview results={testRun.results} />
        </CardContent>
      </Card>

      {/* Test Suites */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Test Suites</h3>
        <div className="space-y-4">
          {testRun.results.test_suites.map((suite, index) => (
            <TestSuiteDetails key={index} testSuite={suite} />
          ))}
        </div>
      </div>
    </div>
  );
}