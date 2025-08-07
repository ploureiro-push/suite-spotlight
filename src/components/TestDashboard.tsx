import { useState } from 'react';
import { Upload, FileText, Clock, CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { TestResults } from '@/types/test-results';
import { TestSuiteCard } from './TestSuiteCard';
import { StatsOverview } from './StatsOverview';

export function TestDashboard() {
  const [testResults, setTestResults] = useState<TestResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as TestResults;
      setTestResults(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON file. Please check the format.');
      setTestResults(null);
    }
  };

  const handleJsonInput = (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText) as TestResults;
      setTestResults(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON format. Please check your input.');
      setTestResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Test Results Dashboard</h1>
          <p className="text-muted-foreground">Upload or paste your test results JSON to view a comprehensive analysis</p>
        </div>

        {!testResults ? (
          <Card className="max-w-2xl mx-auto shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Load Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="file-upload" className="block text-sm font-medium mb-2">
                  Upload JSON File
                </label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
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

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-error-bg border border-error/20">
                  <AlertTriangle className="h-4 w-4 text-error" />
                  <span className="text-error text-sm">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Test Results Analysis</h2>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setTestResults(null)}
                className="border-border/50 hover:bg-secondary"
              >
                Load New Results
              </Button>
            </div>

            <StatsOverview results={testResults} />

            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Test Suites ({testResults.test_suites.length})
              </h3>
              
              {testResults.test_suites.map((suite, index) => (
                <TestSuiteCard key={index} suite={suite} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}