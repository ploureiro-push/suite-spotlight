import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TestRun } from '@/types/test-history';
import { TestRunDetails } from './TestRunDetails';
import { Calendar, FileText } from 'lucide-react';

interface RunSelectorProps {
  runs: TestRun[];
  selectedRunId: string | null;
  onSelectRun: (runId: string) => void;
}

export function RunSelector({ runs, selectedRunId, onSelectRun }: RunSelectorProps) {
  const selectedRun = runs.find(run => run.id === selectedRunId);

  return (
    <div className="space-y-6">
      <Card className="shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Test Run Selection ({runs.length} runs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedRunId || ""} onValueChange={onSelectRun}>
            <SelectTrigger>
              <SelectValue placeholder="Select a test run to view details" />
            </SelectTrigger>
            <SelectContent>
              {runs
                .sort((a, b) => b.runNumber - a.runNumber)
                .map((run) => (
                  <SelectItem key={run.id} value={run.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Run #{run.runNumber}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{run.fileName}</span>
                      <span className="text-muted-foreground">•</span>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(run.results.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedRun && <TestRunDetails testRun={selectedRun} />}
    </div>
  );
}