import { useState } from 'react';
import { ArrowLeft, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendData } from '@/types/test-history';
import { TrendChart } from './TrendChart';
import { RunSelector } from './RunSelector';
import { TestRun } from '@/types/test-history';

interface TimeSeriesViewProps {
  runs: TestRun[];
  trendData: TrendData[];
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
  onBackToSingle: () => void;
}

export function TimeSeriesView({ 
  runs, 
  trendData, 
  selectedRunId, 
  onSelectRun, 
  onBackToSingle 
}: TimeSeriesViewProps) {
  const [viewMode, setViewMode] = useState<'overview' | 'detailed'>('overview');

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
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={onBackToSingle}
            className="border-border/50 hover:bg-secondary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Single Run
          </Button>
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              Test Evolution Analysis
            </h2>
            <p className="text-muted-foreground">
              Analyzing {runs.length} test runs over time
            </p>
          </div>
        </div>
        
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'overview' | 'detailed')}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed</TabsTrigger>
          </TabsList>
        </Tabs>
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

      <TabsContent value="overview" className={viewMode === 'overview' ? 'block' : 'hidden'}>
        <TrendChart data={trendData} />
      </TabsContent>

      <TabsContent value="detailed" className={viewMode === 'detailed' ? 'block' : 'hidden'}>
        <div className="space-y-6">
          <RunSelector 
            runs={runs}
            selectedRunId={selectedRunId}
            onSelectRun={onSelectRun}
          />
          
          <TrendChart data={trendData} />
        </div>
      </TabsContent>
    </div>
  );
}