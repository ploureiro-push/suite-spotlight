import { Calendar, Clock, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TestRun } from '@/types/test-history';

interface RunSelectorProps {
  runs: TestRun[];
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
}

export function RunSelector({ runs, selectedRunId, onSelectRun }: RunSelectorProps) {
  const selectedRun = runs.find(run => run.id === selectedRunId);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  if (runs.length === 0) return null;

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Test Run Selection ({runs.length} runs)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Select value={selectedRunId || ''} onValueChange={onSelectRun}>
            <SelectTrigger>
              <SelectValue placeholder="Select a test run">
                {selectedRun && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Run #{selectedRun.runNumber}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-sm text-muted-foreground">{selectedRun.fileName}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {runs.map((run) => (
                <SelectItem key={run.id} value={run.id}>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Run #{run.runNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm">{run.fileName}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedRun && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="text-sm font-medium">{formatDate(selectedRun.timestamp)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{formatTime(selectedRun.results.total_time)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-sm font-medium">
                  {((selectedRun.results.success_count / selectedRun.results.total_count) * 100).toFixed(1)}%
                </p>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground">Total Tests</p>
                <p className="text-sm font-medium">{selectedRun.results.total_count.toLocaleString()}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-info-bg text-info border-info/20">
              {runs.length} runs loaded
            </Badge>
            {selectedRun && (
              <>
                <Badge variant="secondary" className="bg-success-bg text-success border-success/20">
                  {selectedRun.results.success_count} passed
                </Badge>
                {selectedRun.results.failed_count > 0 && (
                  <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
                    {selectedRun.results.failed_count} failed
                  </Badge>
                )}
                {selectedRun.results.error_count > 0 && (
                  <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
                    {selectedRun.results.error_count} errors
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}