import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TestCase } from '@/types/test-results';
import { CheckCircle, XCircle, AlertCircle, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface TestCaseDetailsProps {
  testCase: TestCase;
}

export function TestCaseDetails({ testCase }: TestCaseDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    switch (testCase.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-error" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-error" />;
      case 'skipped':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusVariant = () => {
    switch (testCase.status) {
      case 'success':
        return 'default';
      case 'failed':
      case 'error':
        return 'destructive';
      case 'skipped':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const hasDetails = testCase.system_output || testCase.stack_trace;

  return (
    <Card className="shadow-soft border-border/50">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <CardTitle className="text-base">{testCase.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{testCase.classname}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusVariant()}>
                  {testCase.status}
                </Badge>
                <Badge variant="outline">
                  {testCase.execution_time.toFixed(3)}s
                </Badge>
                {hasDetails && (
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        {hasDetails && (
          <CollapsibleContent>
            <CardContent className="pt-0 space-y-4">
              {testCase.system_output && (
                <div>
                  <h4 className="text-sm font-medium mb-2">System Output</h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                    {testCase.system_output}
                  </pre>
                </div>
              )}
              
              {testCase.stack_trace && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Stack Trace</h4>
                  <pre className="text-xs bg-muted p-3 rounded-md overflow-x-auto whitespace-pre-wrap">
                    {testCase.stack_trace}
                  </pre>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        )}
      </Collapsible>
    </Card>
  );
}