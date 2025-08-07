import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TestSuite } from '@/types/test-results';
import { TestCaseItem } from './TestCaseItem';

interface TestSuiteCardProps {
  suite: TestSuite;
}

export function TestSuiteCard({ suite }: TestSuiteCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getSuccessRate = () => {
    return ((suite.success_count / suite.total_count) * 100).toFixed(1);
  };

  const hasFailures = suite.failed_count > 0 || suite.error_count > 0;
  const cardBorderClass = hasFailures ? 'border-error/30' : 'border-success/30';

  return (
    <Card className={`shadow-soft ${cardBorderClass} transition-all duration-200 hover:shadow-strong`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{suite.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {suite.total_count} tests • {formatTime(suite.total_time)} • {getSuccessRate()}% success rate
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{formatTime(suite.total_time)}</span>
                </div>
                
                {hasFailures ? (
                  <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
                    {suite.failed_count + suite.error_count} Failed
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-success-bg text-success border-success/20">
                    All Passed
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <div className="mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-muted-foreground">Passed:</span>
                  <span className="font-medium text-success">{suite.success_count}</span>
                </div>
                
                {suite.failed_count > 0 && (
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-error" />
                    <span className="text-muted-foreground">Failed:</span>
                    <span className="font-medium text-error">{suite.failed_count}</span>
                  </div>
                )}
                
                {suite.error_count > 0 && (
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-error" />
                    <span className="text-muted-foreground">Errors:</span>
                    <span className="font-medium text-error">{suite.error_count}</span>
                  </div>
                )}
                
                {suite.skipped_count > 0 && (
                  <div className="flex items-center gap-2">
                    <MinusCircle className="h-4 w-4 text-warning" />
                    <span className="text-muted-foreground">Skipped:</span>
                    <span className="font-medium text-warning">{suite.skipped_count}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <h5 className="font-medium text-foreground mb-3">Test Cases ({suite.test_cases.length})</h5>
              {suite.test_cases.map((testCase, index) => (
                <TestCaseItem key={index} testCase={testCase} />
              ))}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}