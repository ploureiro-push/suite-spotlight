import { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle, MinusCircle, FolderOpen, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TestResults } from '@/types/test-results';
import { TestSuiteCard } from './TestSuiteCard';
import { StatsOverview } from './StatsOverview';
import { TimeSeriesView } from './TimeSeriesView';
import { useTestHistory } from '@/hooks/useTestHistory';

export function TestDashboard() {
  const [singleTestResults, setSingleTestResults] = useState<TestResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'single' | 'multiple'>('single');
  
  const {
    testHistory,
    error: historyError,
    isLoading,
    loadTestFiles,
    selectRun,
    clearHistory,
    getTrendData,
    getSelectedRun
  } = useTestHistory();

  const handleSingleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as TestResults;
      setSingleTestResults(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON file. Please check the format.');
      setSingleTestResults(null);
    }
  };

  const handleMultipleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    await loadTestFiles(files);
  };

  const handleJsonInput = (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText) as TestResults;
      setSingleTestResults(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setSingleTestResults(null);
    }
  };

  const resetToUpload = () => {
    setSingleTestResults(null);
    clearHistory();
    setError(null);
    setMode('single');
  };

  const switchToTimeSeriesMode = () => {
    setMode('multiple');
  };

  const switchToSingleMode = () => {
    setMode('single');
  };

  const hasData = (mode === 'single' && singleTestResults) || (mode === 'multiple' && testHistory.runs.length > 0);
  const currentError = error || historyError;

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Results Dashboard</h1>
          <p className="text-muted-foreground">
            {mode === 'single' 
              ? 'Upload a single test result JSON or analyze multiple runs over time'
              : 'Analyzing test evolution across multiple runs'
            }
          </p>
        </div>

        {!hasData ? (
          <Card className="max-w-2xl mx-auto shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Load Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={mode} onValueChange={(value) => setMode(value as 'single' | 'multiple')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="single" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Single Run
                  </TabsTrigger>
                  <TabsTrigger value="multiple" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Multiple Runs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="single-file-upload" className="block text-sm font-medium mb-2">
                      Upload Single JSON File
                    </label>
                    <Input
                      id="single-file-upload"
                      type="file"
                      accept=".json"
                      onChange={handleSingleFileUpload}
                      className="cursor-pointer"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">Or paste JSON</span>
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="Paste your test results JSON here..."
                      className="w-full h-32 p-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground resize-none"
                      onChange={(e) => handleJsonInput(e.target.value)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="multiple" className="space-y-4 mt-6">
                  <div>
                    <label htmlFor="multiple-file-upload" className="block text-sm font-medium mb-2">
                      Upload Multiple Test Run Files
                    </label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Select multiple JSON files from a folder containing test results from different runs.
                      Files should be named with numbers to indicate run order (e.g., run1.json, test_2.json, etc.)
                    </p>
                    <Input
                      id="multiple-file-upload"
                      type="file"
                      accept=".json"
                      multiple
                      onChange={handleMultipleFileUpload}
                      className="cursor-pointer"
                      disabled={isLoading}
                    />
                    {isLoading && (
                      <p className="text-sm text-muted-foreground mt-2">Loading and analyzing test files...</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {currentError && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-error-bg border border-error/20">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <span className="text-error text-sm">{currentError}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ) : mode === 'single' && singleTestResults ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Single Run Analysis</h2>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={switchToTimeSeriesMode}
                  className="border-border/50 hover:bg-secondary"
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analyze Multiple Runs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetToUpload}
                  className="border-border/50 hover:bg-secondary"
                >
                  Load New Results
                </Button>
              </div>
            </div>

            <StatsOverview results={singleTestResults} />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Test Suites ({singleTestResults.test_suites.length})
              </h3>
              
              {singleTestResults.test_suites.map((suite, index) => (
                <TestSuiteCard key={index} suite={suite} />
              ))}
            </div>
          </div>
        ) : mode === 'multiple' && testHistory.runs.length > 0 ? (
          <TimeSeriesView
            runs={testHistory.runs}
            trendData={getTrendData()}
            selectedRunId={testHistory.selectedRunId}
            onSelectRun={selectRun}
            onBackToSingle={switchToSingleMode}
          />
        ) : null}
      </div>
    </div>
  );
}