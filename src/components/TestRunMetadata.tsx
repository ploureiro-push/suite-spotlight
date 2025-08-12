import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestRun } from '@/types/test-history';
import { GitCommit, Calendar, Hash } from 'lucide-react';

interface TestRunMetadataProps {
  testRuns: TestRun[];
}

export function TestRunMetadata({ testRuns }: TestRunMetadataProps) {
  const sortedRuns = [...testRuns].sort((a, b) => a.runNumber - b.runNumber);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <GitCommit className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Test Run Metadata</h2>
      </div>
      
      <div className="grid gap-4">
        {sortedRuns.map((run) => (
          <Card key={run.id} className="shadow-soft border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">File #{run.runNumber}</CardTitle>
                <Badge variant="secondary">{run.fileName}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Commit SHA</p>
                    <p className="text-sm font-mono text-muted-foreground">
                      {run.results.sha.slice(0, 8)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Pipeline Start</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(run.results.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                
                {run.results.pipeline_id && (
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Pipeline ID</p>
                      <p className="text-sm font-mono text-muted-foreground">
                        {run.results.pipeline_id}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}