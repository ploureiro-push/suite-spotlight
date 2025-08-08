import React from 'react';
import { FileX, RefreshCw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTestHistory } from '@/hooks/useTestHistory';
import { TimeSeriesView } from './TimeSeriesView';

export function TestDashboard() {
  const { testRuns, loading, error, refreshFiles } = useTestHistory();

  return (
    <div className="min-h-screen bg-gradient-primary p-4 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Test Results Dashboard
          </h1>
          <p className="mt-2 text-white/80">
            Automatically monitoring test results from /test-results/ folder
          </p>
        </header>

        {/* Status and Refresh */}
        <Card className="shadow-strong border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${loading ? 'bg-warning animate-pulse' : 'bg-success'}`} />
                <span className="text-sm text-muted-foreground">
                  {loading ? 'Checking for new test results...' : `${testRuns.length} test runs loaded`}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshFiles}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            {error && (
              <div className="mt-3 text-sm text-destructive">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Content */}
        {testRuns.length > 0 ? (
          <TimeSeriesView 
            testRuns={testRuns} 
            loading={loading} 
            error={error}
            onRefresh={refreshFiles}
          />
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <div className="rounded-full bg-muted p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
                <FileX className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No test results found</h3>
              <p className="text-muted-foreground mb-4">
                Place JSON test result files in the /public/test-results/ folder to start monitoring
              </p>
              <Button variant="outline" onClick={refreshFiles}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Again
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}