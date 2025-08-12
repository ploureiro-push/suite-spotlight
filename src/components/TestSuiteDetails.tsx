import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TestSuite } from '@/types/test-results';
import { TestCaseDetails } from './TestCaseDetails';
import { CheckCircle, XCircle, AlertCircle, Clock, ChevronDown, TestTube } from 'lucide-react';
import { useState } from 'react';

interface TestSuiteDetailsProps {
  testSuite: TestSuite;
}

export function TestSuiteDetails({ testSuite }: TestSuiteDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const successRate = (testSuite.success_count / testSuite.total_count) * 100;

  return (
    <Card className="shadow-strong border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TestTube className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">{testSuite.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {testSuite.total_count} tests • {testSuite.total_time.toFixed(2)}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {testSuite.success_count > 0 && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {testSuite.success_count}
                    </Badge>
                  )}
                  {testSuite.failed_count > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="h-3 w-3" />
                      {testSuite.failed_count}
                    </Badge>
                  )}
                  {testSuite.error_count > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {testSuite.error_count}
                    </Badge>
                  )}
                  {testSuite.skipped_count > 0 && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {testSuite.skipped_count}
                    </Badge>
                  )}
                </div>
                <Badge 
                  variant={successRate === 100 ? "default" : successRate > 50 ? "secondary" : "destructive"}
                >
                  {successRate.toFixed(1)}%
                </Badge>
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {testSuite.suite_error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <h4 className="text-sm font-medium text-destructive mb-2">Suite Error</h4>
                <pre className="text-xs whitespace-pre-wrap">{testSuite.suite_error}</pre>
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Test Cases ({testSuite.test_cases.length})</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testSuite.test_cases.map((testCase, index) => (
                  <TestCaseDetails key={index} testCase={testCase} />
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}