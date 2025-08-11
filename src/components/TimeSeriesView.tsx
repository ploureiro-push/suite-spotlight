import { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendData } from '@/types/test-history';
import { TrendChart } from './TrendChart';
import { RunSelector } from './RunSelector';
import { TestSuiteBreakdown } from './TestSuiteBreakdown';
import { TestRun } from '@/types/test-history';

interface TimeSeriesViewProps {
  testRuns: TestRun[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

export function TimeSeriesView({ 
  testRuns, 
  loading, 
  error, 
  onRefresh 
}: TimeSeriesViewProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(
    testRuns.length > 0 ? testRuns[testRuns.length - 1].id : null
  );

  const trendData: TrendData[] = testRuns.map(run => ({
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

  const getOverallTrends = () => {
    if (trendData.length < 2) return null;

    const first = trendData[0];
    const last = trendData[trendData.length - 1];
    
    return {
      successRateChange: last.successRate - first.successRate,
      timeChange: last.totalTime - first.totalTime,
      testCountChange: last.totalTests - first.totalTests,
      runsAnalyzed: trendData.length
    };
  };

  const trends = getOverallTrends();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Test Evolution Analysis
          </h2>
          <p className="text-muted-foreground">
            Analyzing {testRuns.length} test runs over time
          </p>
        </div>
      </div>

      {trends && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="shadow-soft border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate Trend</p>
                  <p className={`text-2xl font-bold ${
                    trends.successRateChange >= 0 ? 'text-success' : 'text-error'
                  }`}>
                    {trends.successRateChange >= 0 ? '+' : ''}{trends.successRateChange.toFixed(1)}%
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${
                  trends.successRateChange >= 0 ? 'text-success' : 'text-error'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Execution Time Trend</p>
                  <p className={`text-2xl font-bold ${
                    trends.timeChange <= 0 ? 'text-success' : 'text-warning'
                  }`}>
                    {trends.timeChange >= 0 ? '+' : ''}{trends.timeChange.toFixed(1)}s
                  </p>
                </div>
                <Calendar className={`h-8 w-8 ${
                  trends.timeChange <= 0 ? 'text-success' : 'text-warning'
                }`} />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Test Count Change</p>
                  <p className="text-2xl font-bold text-info">
                    {trends.testCountChange >= 0 ? '+' : ''}{trends.testCountChange}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Runs Analyzed</p>
                  <p className="text-2xl font-bold text-primary">{trends.runsAnalyzed}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="trends" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="trends">Trends Overview</TabsTrigger>
          <TabsTrigger value="suites">Test Suite Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <RunSelector 
            runs={testRuns}
            selectedRunId={selectedRunId}
            onSelectRun={setSelectedRunId}
          />
          
          <TrendChart data={trendData} />
        </TabsContent>

        <TabsContent value="suites" className="space-y-6">
          <TestSuiteBreakdown testRuns={testRuns} />
        </TabsContent>
      </Tabs>
    </div>
  );
}