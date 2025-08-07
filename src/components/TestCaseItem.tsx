import { useState } from 'react';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, MinusCircle, Clock, Code } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TestCase } from '@/types/test-results';

interface TestCaseItemProps {
  testCase: TestCase;
}

export function TestCaseItem({ testCase }: TestCaseItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusIcon = () => {
    switch (testCase.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-error" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-error" />;
      case 'skipped':
        return <MinusCircle className="h-4 w-4 text-warning" />;
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (testCase.status) {
      case 'success':
        return (
          <Badge variant="secondary" className="bg-success-bg text-success border-success/20">
            Passed
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
            Failed
          </Badge>
        );
      case 'error':
        return (
          <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
            Error
          </Badge>
        );
      case 'skipped':
        return (
          <Badge variant="secondary" className="bg-warning-bg text-warning border-warning/20">
            Skipped
          </Badge>
        );
      default:
        return null;
    }
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(3)}s`;
  };

  const hasDetails = testCase.system_output || testCase.stack_trace;
  const isFailure = testCase.status === 'failed' || testCase.status === 'error';

  return (
    <div className={`border rounded-lg transition-all duration-200 ${
      isFailure ? 'border-error/20 bg-error-bg/30' : 'border-border/50 bg-card/50'
    }`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/30 transition-colors duration-200">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {hasDetails && (isFailure || isOpen) ? (
                isOpen ? (
                  <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                ) : (
                  <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                )
              ) : (
                <div className="w-3" />
              )}
              
              {getStatusIcon()}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{testCase.name}</p>
                <p className="text-xs text-muted-foreground truncate">{testCase.classname}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{formatTime(testCase.execution_time)}</span>
              </div>
              {getStatusBadge()}
            </div>
          </div>
        </CollapsibleTrigger>
        
        {hasDetails && (
          <CollapsibleContent>
            <div className="px-3 pb-3 space-y-3">
              {testCase.system_output && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Code className="h-4 w-4 text-muted-foreground" />
                    <h6 className="text-sm font-medium text-foreground">System Output</h6>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap overflow-x-auto">
                      {testCase.system_output}
                    </pre>
                  </div>
                </div>
              )}
              
              {testCase.stack_trace && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-error" />
                    <h6 className="text-sm font-medium text-foreground">Stack Trace</h6>
                  </div>
                  <div className="bg-error-bg/50 border border-error/20 rounded-md p-3">
                    <pre className="text-xs text-error whitespace-pre-wrap overflow-x-auto font-mono">
                      {testCase.stack_trace}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </div>
  );
}